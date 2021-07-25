import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Accordion } from 'semantic-ui-react';
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
import { multipleChoiceHandleClick } from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

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
            sideEffectsOptions: sideEffects,
            medicationOptions: drugNames,
            diseaseOptions: diseases,
            currentYear: new Date(Date.now()).getFullYear(),
        };
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
            console.log(responseType)
        return (
            <>
                {node &&
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
                            <button
                                key={medication}
                                className='button_question'
                                style={{
                                    backgroundColor: containsKey
                                        ? 'lightslategrey'
                                        : 'whitesmoke',
                                }}
                                onClick={(): void => {
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
                            >
                                {medication}
                            </button>
                        );
                    })}
                {content}
                {!this.props.isPreview &&
                    responseType == ResponseTypes.MEDS_BLANK && (
                        <AddRowButton
                            onClick={() => this.props.addMedication()}
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(MedicationsContent);
