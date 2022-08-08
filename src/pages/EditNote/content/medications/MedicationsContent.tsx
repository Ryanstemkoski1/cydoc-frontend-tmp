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
    currMeds: string[];
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
            currMeds: Object.keys(this.props.medications).filter(
                (med) =>
                    this.props.medications[med].drugName.length &&
                    this.props.medications[med].isCurrentlyTaking ==
                        YesNoResponse.Yes
            ),
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
        const newKey = v4();
        addMedsPopOption(newKey, '');
        if (responseType == ResponseTypes.MEDS_BLANK && node)
            blankQuestionChange(node, newKey);
        else this.setState({ currMeds: [...this.state.currMeds, newKey] });
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

        const panels = [],
            medsEntries = Object.entries(medications);

        if (isPreview) {
            if (values != null) {
                for (let i = 0; i < values.length; i++) {
                    panels.push(
                        <MedicationsPanel
                            mobile={mobile}
                            isPreview={true}
                            previewValue={values[i]}
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
        } else {
            // create map of condition: index to look for existing conditions in medications
            let medIndices = [...Array(Object.keys(medications).length).keys()];
            if (responseType == ResponseTypes.MEDS_BLANK && node) {
                const response = hpi.nodes[node].response as string[];
                medIndices = response.map((key) =>
                    medsEntries.findIndex((medItem) => medItem[0] == key)
                );
            }
            for (let i = 0; i < medIndices.length; i++) {
                /*
                If we're in the HPI and are generated a MEDS-POP or MEDS-BLANK table,
                we want all of the panels from medIndices to show.
                If we're in the Medications tab under Patient History, we only want
                panels corresponding to those in which the user clicked yes to show. 
                We use local state so that if the user clicks no within the medications
                table, the row isn't gotten rid of immediately but just displays on the table
                as no while the user is looking at the page.
                */
                if (
                    medIndices[i] &&
                    (responseType ||
                        this.state.currMeds.includes(
                            medsEntries[medIndices[i]][0]
                        ) ||
                        medsEntries[medIndices[i]][1].isCurrentlyTaking ==
                            YesNoResponse.Yes)
                )
                    panels.push(
                        <MedicationsPanel
                            mobile={mobile}
                            isPreview={false}
                            medIndex={medsEntries[medIndices[i]][0]}
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
                        values.reduce((acc: JSX.Element[], medication) => {
                            const key = medsEntries.find(
                                (entry) => entry[1].drugName == medication
                            );
                            let medKey = '';
                            if (key) medKey = key[0];
                            else {
                                medKey = v4();
                                addMedsPopOption(medKey, medication);
                            }
                            const yesActive =
                                    medKey in medications &&
                                    medications[medKey].isCurrentlyTaking ==
                                        YesNoResponse.Yes,
                                noActive =
                                    medKey in medications &&
                                    medications[medKey].isCurrentlyTaking ==
                                        YesNoResponse.No;
                            return [
                                ...acc,
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
                                </Grid.Row>,
                            ];

                            return acc;
                        }, [])}
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
