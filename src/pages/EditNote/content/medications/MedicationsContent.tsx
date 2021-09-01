import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Accordion, Table } from 'semantic-ui-react';
import sideEffects from 'constants/sideEffects';
import drugNames from 'constants/medications';
import diseases from 'constants/diagnoses';
import AddRowButton from 'components/tools/AddRowButton.js';
import { OptionMapping } from '_processOptions';
import {
    addMedication,
    deleteMedication,
    addMedsPopOption,
} from 'redux/actions/medicationsActions';
import { selectMedicationsEntries } from 'redux/selectors/medicationsSelectors';
import './Medications.css';
import { CurrentNoteState } from 'redux/reducers';
import MedicationsPanel from './MedicationsPanel';
import { ResponseTypes } from 'constants/hpiEnums';
import { v4 } from 'uuid';
import {
    multipleChoiceHandleClick,
    blankQuestionChange,
} from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';

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

    render() {
        const {
            values,
            isPreview,
            medications,
            mobile,
            responseType,
            node,
            deleteMedication,
            addMedsPopOption,
            hpi,
            multipleChoiceHandleClick,
        } = this.props;

        const header = this.makeHeader();
        const panels = [];
        const medicationsIndexMap: {
            [medication: string]: { key: string; index: number };
        } = {};
        for (let i = 0; i < medications.length; i++) {
            const medicationName = medications[i][1].drugName;
            medicationsIndexMap[medicationName] = {
                key: medications[i][0],
                index: i,
            };
        }

        if (isPreview) {
            if (values != null) {
                for (let i = 0; i < values.length; i++) {
                    panels.push(
                        <MedicationsPanel
                            mobile={mobile}
                            isPreview={true}
                            previewValue={values[i]}
                            rowIndex={i}
                            sideEffectsOptions={this.state.sideEffectsOptions}
                            medicationOptions={this.state.medicationOptions}
                            diseaseOptions={this.state.diseaseOptions}
                            currentYear={this.state.currentYear}
                            handleAddition={this.handleDropdownOptionAddition}
                        />
                    );
                }
            }
        } else {
            // create map of condition: index to look for existing conditions in medications
            let medIndices = [...Array(medications.length).keys()];
            if (responseType == ResponseTypes.MEDS_POP && values) {
                medIndices = values
                    .filter((medName) => medName in medicationsIndexMap)
                    .map((medName) => medicationsIndexMap[medName].index);
            } else if (responseType == ResponseTypes.MEDS_BLANK && values)
                medIndices = values.map((key) =>
                    medications.findIndex((medItem) => medItem[0] == key)
                );
            for (let i = 0; i < medIndices.length; i++) {
                panels.push(
                    <MedicationsPanel
                        mobile={mobile}
                        isPreview={false}
                        rowIndex={medIndices[i]}
                        sideEffectsOptions={this.state.sideEffectsOptions}
                        medicationOptions={this.state.medicationOptions}
                        diseaseOptions={this.state.diseaseOptions}
                        currentYear={this.state.currentYear}
                        handleAddition={this.handleDropdownOptionAddition}
                    />
                );
            }
        }

        const content = (
            <Accordion panels={panels} exclusive={false} fluid styled />
        );
        return (
            <>
                {node &&
                    responseType == ResponseTypes.MEDS_POP &&
                    values &&
                    values.map((medication: string) => {
                        const response = hpi.nodes[node].response;
                        const containsKey =
                            Array.isArray(response) &&
                            medication in medicationsIndexMap &&
                            response.includes(
                                medicationsIndexMap[medication].key
                            );
                        return (
                            <ToggleButton
                                key={medication}
                                className='button_question'
                                active={containsKey}
                                condition={medication}
                                title={medication}
                                onToggleButtonClick={(): void => {
                                    if (containsKey) {
                                        deleteMedication(
                                            medicationsIndexMap[medication].key
                                        );
                                        multipleChoiceHandleClick(
                                            node,
                                            medicationsIndexMap[medication].key
                                        );
                                    } else {
                                        const newKey = v4();
                                        addMedsPopOption(newKey, medication);
                                        multipleChoiceHandleClick(node, newKey);
                                    }
                                }}
                            />
                        );
                    })}
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
    medications: selectMedicationsEntries(state),
    hpi: selectHpiState(state),
});

const mapDispatchToProps = {
    addMedication,
    deleteMedication,
    addMedsPopOption,
    multipleChoiceHandleClick,
    blankQuestionChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(MedicationsContent);
