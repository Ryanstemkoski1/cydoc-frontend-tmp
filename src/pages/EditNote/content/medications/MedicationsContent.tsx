import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Accordion, Grid, Table } from 'semantic-ui-react';
import sideEffects from 'constants/sideEffects';
import drugNames from 'constants/medications';
import diseases from 'constants/diagnoses';
import AddRowButton from 'components/tools/AddRowButton.js';
import { OptionMapping } from '_processOptions';
import {
    addMedication,
    deleteMedication,
    addMedsPopOption,
    updateCurrentlyTaking,
} from 'redux/actions/medicationsActions';
import { selectMedicationsState } from 'redux/selectors/medicationsSelectors';
import './Medications.css';
import { CurrentNoteState } from 'redux/reducers';
import MedicationsPanel from './MedicationsPanel';
import { ResponseTypes } from 'constants/hpiEnums';
import { v4 } from 'uuid';
import {
    medsPopYesNoToggle,
    blankQuestionChange,
} from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';
import '../hpi/knowledgegraph/src/css/Button.css';
import { YesNoResponse } from 'constants/enums';

interface OwnProps {
    mobile: boolean;
    isPreview?: boolean;
    values?: string[];
    responseType?: ResponseTypes;
    node?: string;
}
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

interface State {
    sideEffectsOptions: OptionMapping;
    medicationOptions: OptionMapping;
    diseaseOptions: OptionMapping;
    currentYear: number;
    windowWidth: number;
    windowHeight: number;
}

export enum DropdownType {
    SideEffects = 'sideEffectsOptions',
    Medications = 'medicationOptions',
    Diseases = 'diseaseOptions',
}

export class MedicationsContent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            sideEffectsOptions: sideEffects,
            medicationOptions: drugNames,
            diseaseOptions: diseases,
            currentYear: new Date(Date.now()).getFullYear(),
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    handleDropdownOptionAddition = (
        optionType: DropdownType,
        value: string
    ) => {
        this.setState((prevState) => ({
            ...prevState,
            [optionType]: {
                ...prevState[optionType],
                [value]: { value, label: value },
            },
        }));
    };

    addRow = () => {
        const {
            responseType,
            node,
            addMedsPopOption,
            blankQuestionChange,
            addMedication,
        } = this.props;
        if (responseType == ResponseTypes.MEDS_BLANK && node) {
            const newKey = v4();
            addMedsPopOption(newKey, '');
            blankQuestionChange(node, newKey);
        } else addMedication();
    };

    makeHeader() {
        return (
            <Table.Row>
                <Table.HeaderCell>Medication Name</Table.HeaderCell>
                <Table.HeaderCell>Dose</Table.HeaderCell>
                <Table.HeaderCell>Schedule</Table.HeaderCell>
                <Table.HeaderCell>Reason For Taking</Table.HeaderCell>
            </Table.Row>
        );
    }

    deleteRow = (e: any, index: string) => {
        e.preventDefault();
        this.props.deleteMedication(index);
    };

    render() {
        const {
            values,
            isPreview,
            medications,
            mobile,
            responseType,
            node,
            addMedsPopOption,
            hpi,
            updateCurrentlyTaking,
            medsPopYesNoToggle,
        } = this.props;

        const header = this.makeHeader(),
            panels = [],
            medicationsIndexMap: {
                [medication: string]: string;
            } = {},
            medsEntries = Object.entries(medications);
        for (let i = 0; i < medsEntries.length; i++) {
            const medicationName = medsEntries[i][1].drugName;
            medicationsIndexMap[medicationName] = medsEntries[i][0];
        }
        if (values) {
            values.map((medication) => {
                if (!(medication in medicationsIndexMap)) {
                    const medKey = v4();
                    addMedsPopOption(medKey, medication);
                    medicationsIndexMap[medication] = medKey;
                }
            });
        }

        if (isPreview) {
            if (values != null) {
                for (let i = 0; i < values.length; i++) {
                    panels.push(
                        <MedicationsPanel
                            mobile={mobile}
                            isPreview={true}
                            previewValue={values[i]}
                            medIndex={medsEntries[i][0]}
                            rowIndex={i}
                            sideEffectsOptions={this.state.sideEffectsOptions}
                            medicationOptions={this.state.medicationOptions}
                            diseaseOptions={this.state.diseaseOptions}
                            currentYear={this.state.currentYear}
                            handleAddition={this.handleDropdownOptionAddition}
                            deleteRow={this.deleteRow}
                        />
                    );
                }
            }
        } else {
            // create map of condition: index to look for existing conditions in medications
            let medIndices = [...Array(medications.length).keys()];
            if (responseType == ResponseTypes.MEDS_BLANK && node) {
                const response = hpi.nodes[node].response as string[];
                medIndices = response.map((key) =>
                    medsEntries.findIndex((medItem) => medItem[0] == key)
                );
            }
            for (let i = 0; i < medIndices.length; i++) {
                panels.push(
                    <MedicationsPanel
                        mobile={mobile}
                        isPreview={false}
                        rowIndex={medIndices[i]}
                        medIndex={medsEntries[i][0]}
                        sideEffectsOptions={this.state.sideEffectsOptions}
                        medicationOptions={this.state.medicationOptions}
                        diseaseOptions={this.state.diseaseOptions}
                        currentYear={this.state.currentYear}
                        handleAddition={this.handleDropdownOptionAddition}
                        deleteRow={this.deleteRow}
                    />
                );
            }
        }
        const content =
            panels.length && responseType != ResponseTypes.MEDS_POP ? (
                <Accordion panels={panels} exclusive={false} fluid styled />
            ) : (
                []
            );
        return (
            <>
                <Grid columns={2} key={node}>
                    {node &&
                        responseType == ResponseTypes.MEDS_POP &&
                        values &&
                        values.map((medication: string) => {
                            const medKey = medicationsIndexMap[medication];
                            const yesActive =
                                    medKey in medications &&
                                    medications[medKey].isCurrentlyTaking ==
                                        YesNoResponse.Yes,
                                noActive =
                                    medKey in medications &&
                                    medications[medKey].isCurrentlyTaking ==
                                        YesNoResponse.No;
                            return (
                                <Grid.Row key={medication}>
                                    <Grid.Column width={3}>
                                        {medication}
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <ToggleButton
                                            active={yesActive}
                                            title='Yes'
                                            onToggleButtonClick={(): void => {
                                                updateCurrentlyTaking(
                                                    medKey,
                                                    yesActive
                                                        ? YesNoResponse.None
                                                        : YesNoResponse.Yes
                                                );
                                                medsPopYesNoToggle(
                                                    node,
                                                    medication,
                                                    YesNoResponse.Yes
                                                );
                                            }}
                                        />
                                        <ToggleButton
                                            active={noActive}
                                            title='No'
                                            onToggleButtonClick={(): void => {
                                                updateCurrentlyTaking(
                                                    medKey,
                                                    noActive
                                                        ? YesNoResponse.None
                                                        : YesNoResponse.No
                                                );
                                                medsPopYesNoToggle(
                                                    node,
                                                    medication,
                                                    YesNoResponse.No
                                                );
                                            }}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            );
                        })}
                </Grid>
                {content}
                {!this.props.isPreview &&
                    responseType != ResponseTypes.MEDS_POP && (
                        <AddRowButton
                            onClick={this.addRow}
                            ariaLabel='Add-Medication-Row-Button'
                            name='medication'
                        />
                    )}
            </>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    medications: selectMedicationsState(state),
    hpi: selectHpiState(state),
});

const mapDispatchToProps = {
    addMedication,
    deleteMedication,
    updateCurrentlyTaking,
    addMedsPopOption,
    medsPopYesNoToggle,
    blankQuestionChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(MedicationsContent);
