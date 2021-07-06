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
} from 'redux/actions/medicationsActions';
import { selectMedicationsEntries } from 'redux/selectors/medicationsSelectors';
import './Medications.css';
import { CurrentNoteState } from 'redux/reducers';
import MedicationsPanel from './MedicationsPanel';

interface OwnProps {
    mobile: boolean;
    isPreview?: boolean;
    values?: string[];
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
        const { values, isPreview, medications, mobile } = this.props;

        const panels = [];

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
            for (let i = 0; i < medications.length; i++) {
                panels.push(
                    <MedicationsPanel
                        mobile={mobile}
                        isPreview={false}
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

        const content = (
            <Accordion panels={panels} exclusive={false} fluid styled />
        );

        return (
            <>
                {content}
                {!this.props.isPreview && (
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
});

const mapDispatchToProps = {
    addMedication,
    deleteMedication,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(MedicationsContent);
