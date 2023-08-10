import { OptionMapping } from '_processOptions';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import { ResponseTypes } from 'constants/hpiEnums';
import drugNames from 'constants/medications';
import diseases from 'constants/oldDiagnoses';
import sideEffects from 'constants/sideEffects';
import { withDimensionsHook } from 'hooks/useDimensions';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    blankQuestionChange,
    medsPopYesNoToggle,
} from 'redux/actions/hpiActions';
import {
    addMedsPopOption,
    deleteMedication,
    updateCurrentlyTaking,
} from 'redux/actions/medicationsActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import { selectMedicationsState } from 'redux/selectors/medicationsSelectors';
import { Table } from 'semantic-ui-react';
import { v4 } from 'uuid';
import '../hpi/knowledgegraph/src/css/Button.css';
import './Medications.css';
import style from './MedicationsContentV2.module.scss';
import MedicationsPanelV2 from './MedicationsPanelV2';

interface OwnProps {
    mobile: boolean;
    isPreview?: boolean;
    values?: string[];
    responseType?: ResponseTypes;
    node?: string;
    singleType?: boolean;
    isNote?: boolean;
}
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps &
    OwnProps & {
        dimensions?: any;
    };

interface State {
    sideEffectsOptions: OptionMapping;
    medicationOptions: OptionMapping;
    diseaseOptions: OptionMapping;
    currentYear: number;
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
        const { responseType, node, addMedsPopOption, blankQuestionChange } =
            this.props;
        const newKey = v4();
        addMedsPopOption(newKey, '');
        if (responseType == ResponseTypes.MEDS_BLANK && node) {
            blankQuestionChange(node, newKey);
            this.forceUpdate();
        } else this.setState({ currMeds: [...this.state.currMeds, newKey] });
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
            isNote = false,
        } = this.props;

        const panels = [],
            medsEntries = Object.entries(medications);

        if (isPreview) {
            if (values != null) {
                for (let i = 0; i < values.length; i++) {
                    panels.push(
                        <MedicationsPanelV2
                            key={`med-panel1-${medsEntries[i][0]}`}
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
                            singleType={this.props.singleType}
                            isNote={isNote}
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
                    medsEntries?.findIndex((medItem) => medItem[0] == key)
                );
                medIndices = medIndices.filter((data) => data != -1);
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
                    medIndices[i] !== undefined &&
                    medIndices[i] !== null &&
                    (responseType ||
                        this.state.currMeds.includes(
                            medsEntries[medIndices[i]][0]
                        ) ||
                        medsEntries[medIndices[i]][1].isCurrentlyTaking ==
                            YesNoResponse.Yes)
                )
                    panels.push(
                        <MedicationsPanelV2
                            key={`med-panel2-${medsEntries[medIndices[i]][0]}`}
                            isNote={isNote}
                            mobile={mobile}
                            isPreview={false}
                            medIndex={medsEntries[medIndices[i]][0]}
                            sideEffectsOptions={this.state.sideEffectsOptions}
                            medicationOptions={this.state.medicationOptions}
                            diseaseOptions={this.state.diseaseOptions}
                            currentYear={this.state.currentYear}
                            handleAddition={this.handleDropdownOptionAddition}
                            deleteRow={this.deleteRow}
                            singleType={this.props.singleType}
                        />
                    );
            }
        }
        const content =
            panels.length && responseType != ResponseTypes.MEDS_POP
                ? panels
                : [];
        return (
            <div>
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
                            <div
                                className={`${style.medication__row} flex-wrap align-center justify-between`}
                                key={medication}
                            >
                                <p>{medication}</p>
                                <aside>
                                    <YesAndNo
                                        yesButtonActive={yesActive}
                                        handleYesButtonClick={(): void => {
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
                                        noButtonActive={noActive}
                                        handleNoButtonClick={(): void => {
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
                                </aside>
                            </div>,
                        ];
                    }, [])}

                {content}
                {!this.props.isPreview &&
                    responseType != ResponseTypes.MEDS_POP && (
                        <>
                            <AddRowButton
                                name={'Medication'}
                                onClick={this.addRow}
                            />
                        </>
                    )}
            </div>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    medications: selectMedicationsState(state),
    hpi: selectHpiState(state),
});

const mapDispatchToProps = {
    deleteMedication,
    updateCurrentlyTaking,
    addMedsPopOption,
    medsPopYesNoToggle,
    blankQuestionChange,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withDimensionsHook(
    connect(mapStateToProps, mapDispatchToProps)(MedicationsContent)
);
