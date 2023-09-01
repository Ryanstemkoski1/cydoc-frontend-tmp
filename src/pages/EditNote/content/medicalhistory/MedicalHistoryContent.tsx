import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import ConditionInput from 'components/tools/ConditionInput/ConditionInput';
import GridContent from 'components/tools/GridContent/GridContent';
import constants from 'constants/constants.json';
import diseaseSynonyms from 'constants/diseaseSynonyms';
import { YesNoResponse } from 'constants/enums';
import { ResponseTypes } from 'constants/hpiEnums';
import { standardizeDiseaseNames } from 'constants/standardizeDiseaseNames';
import React from 'react';
import { connect } from 'react-redux';
import {
    BlankQuestionChangeAction,
    PopResponseAction,
    blankQuestionChange,
    popResponse,
} from 'redux/actions/hpiActions';
import {
    AddPmhPopOptionsAction,
    addPmhPopOptions,
    deleteCondition,
    toggleOption,
    updateComments,
    updateConditionResolved,
    updateEndYear,
    updateStartYear,
} from 'redux/actions/medicalHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import {
    MedicalHistoryItem,
    MedicalHistoryState,
} from 'redux/reducers/medicalHistoryReducer';
import { selectMedicalHistoryState } from 'redux/selectors/medicalHistorySelector';
import { ButtonProps, TextAreaProps } from 'semantic-ui-react';
import { v4 } from 'uuid';
import style from './MedicalHistoryContent.module.scss';
import MedicalHistoryNoteRow from './MedicalHistoryNoteRow';

//Component that manages the layout of the medical history tab content
class MedicalHistoryContent extends React.Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            seenConditions: {},
            currConditions: Object.keys(this.props.medicalHistory).filter(
                (condition) =>
                    this.props.medicalHistory[condition].condition.length &&
                    this.props.medicalHistory[condition].hasBeenAfflicted ==
                        YesNoResponse.Yes
            ),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleConditionToggleButtonClick =
            this.handleConditionToggleButtonClick.bind(this);
        this.handleResolvedToggleButtonClick =
            this.handleResolvedToggleButtonClick.bind(this);
        this.generateListItems = this.generateListItems.bind(this);
        this.addSeenCondition = this.addSeenCondition.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    componentDidMount() {
        const values = this.props.medicalHistory;
        const seenConditions: SeenCondition = {};
        Object.keys(values).forEach((val: string) => {
            const name: string = values[val]['condition'];
            const standardName = this.standardizeMedicalName(name);
            seenConditions[standardName] = val;
        });
        this.setState({ seenConditions });
    }

    standardizeMedicalName(name: string) {
        const standardName = standardizeDiseaseNames(name);
        let standardReplacedName = standardName;
        if (standardName in diseaseSynonyms) {
            standardReplacedName = diseaseSynonyms[standardName];
        }
        return standardReplacedName;
    }

    standardizeMedicalHistory(medHistState: MedicalHistoryState) {
        const standardMedicalHistory = medHistState;
        Object.entries(standardMedicalHistory).map(
            (value: [string, MedicalHistoryItem]) => {
                const disease = value[1]['condition'];
                const standardDisease = standardizeDiseaseNames(disease);
                let standardReplacedDisease = standardDisease;
                if (standardDisease in diseaseSynonyms) {
                    standardReplacedDisease = diseaseSynonyms[standardDisease];
                }
                value[1]['condition'] = standardReplacedDisease;
            }
        );

        return standardMedicalHistory;
    }

    //handles input field events
    handleChange(
        event: React.FormEvent<HTMLTextAreaElement>,
        data: TextAreaProps
    ) {
        let index = '';
        Object.entries(this.props.medicalHistory).forEach((disease) => {
            if (disease[1]['condition'] === data.condition) {
                index = disease[0];
            }
        });
        const placeholder = data.placeholder;
        const value = (event.target as HTMLTextAreaElement).value;
        switch (placeholder) {
            case 'Onset':
                this.props.updateStartYear(index, parseInt(value));
                break;
            case 'End Year':
                this.props.updateEndYear(index, parseInt(value));
                break;
            case 'Comments':
                this.props.updateComments(index, value);
                break;
            default:
                return;
        }
    }

    //handles condition toggle button events
    handleConditionToggleButtonClick = (
        event: React.MouseEvent,
        data: ButtonProps
    ) => {
        let index = '';
        Object.entries(
            this.standardizeMedicalHistory(this.props.medicalHistory)
        ).forEach((disease) => {
            if (disease[1]['condition'] === data.condition) {
                index = disease[0];
            }
        });
        this.props.toggleOption(index, data.title.toUpperCase());
    };
    // handles button events for "Has Condition Resolved?"
    handleResolvedToggleButtonClick = (
        _event: React.MouseEvent,
        data: ButtonProps
    ) => {
        let index = '';
        Object.entries(
            this.standardizeMedicalHistory(this.props.medicalHistory)
        ).forEach((disease) => {
            if (disease[1]['condition'] === data.condition) {
                index = disease[0];
            }
        });
        this.props.updateConditionResolved(index, data.title.toUpperCase());
    };

    addSeenCondition = (value: string, index: string) => {
        const { seenConditions } = this.state;
        this.setState({
            seenConditions: { ...seenConditions, [value]: index },
        });
    };

    addRow() {
        const newKey = v4();
        this.props.addPmhPopOptions(newKey, '');
        if (
            this.props.responseType == ResponseTypes.PMH_BLANK &&
            this.props.node
        ) {
            this.props.blankQuestionChange(this.props.node, newKey);
        } else
            this.setState({
                currConditions: [...this.state.currConditions, newKey],
            });
    }

    deleteRow = (index: string) => {
        this.props.deleteCondition(index);
    };

    render() {
        const {
            responseChoice,
            responseType,
            addPmhPopOptions,
            popResponse,
            node,
            medicalHistory,
        } = this.props;
        const standardMedicalHistory = this.standardizeMedicalHistory(
            this.props.medicalHistory
        );
        const standardConditions = constants.CONDITIONS.map((condition) =>
            this.standardizeMedicalName(condition)
        );
        let listValues =
            Object.keys(standardMedicalHistory).filter(
                (key) =>
                    standardConditions.includes(
                        standardMedicalHistory[key].condition
                    ) ||
                    this.state.currConditions.includes(key) ||
                    this.props.showNo ||
                    standardMedicalHistory[key].hasBeenAfflicted ==
                        YesNoResponse.Yes
            ) || constants.CONDITIONS;
        // The second OR statement gets the list of Conditions in the "Medical History" context
        if (responseType == ResponseTypes.PMH_POP && responseChoice && node) {
            listValues = responseChoice.map((condition) => {
                const key = Object.keys(medicalHistory).find(
                    (entry) => medicalHistory[entry].condition == condition
                );
                let conditionKey = '';
                if (key) conditionKey = key;
                else {
                    conditionKey = v4();
                    addPmhPopOptions(conditionKey, condition);
                }
                return conditionKey;
            });
            popResponse(node, listValues);
        }
        if (responseType == ResponseTypes.PMH_BLANK && responseChoice) {
            if (!responseChoice.length)
                return <AddRowButton onClick={this.addRow} name={'disease'} />;
            listValues = responseChoice;
        }
        const rows = this.generateListItems(listValues as string[]);
        const header = [
            {
                title: 'Condition',
                col: 3,
            },
        ];
        if (!this.props.hide) {
            header.push(
                {
                    title: '',
                    col: 9,
                },
                {
                    title: 'Start Year',
                    col: 3,
                },
                {
                    title: 'Has Condition Resolved?',
                    col: 9,
                },
                {
                    title: 'End Year',
                    col: 9,
                },
                {
                    title: 'Comments',
                    col: 9,
                },

                {
                    title: '',
                    col: 9,
                }
            );
        }
        return (
            <div className={style.historyTable}>
                <div className={`${style.historyTable__scroll} scrollbar`}>
                    <GridContent
                        header_titles={header}
                        rows={rows as React.JSX.Element[] | React.JSX.Element}
                        name='medical history'
                        onAddRow={this.addRow}
                        canAddNew={
                            !this.props.isPreview &&
                            !(this.props.responseType == ResponseTypes.PMH_POP)
                        }
                    />
                </div>
            </div>
        );
    }

    generateListItems(conditions: string[]) {
        const { isPreview } = this.props;
        const { seenConditions } = this.state;
        const standardMedicalHistory = this.standardizeMedicalHistory(
            this.props.medicalHistory
        );
        const inputStyle = {
            maxWidth: '500px',
            width: '100%',
        };
        return conditions.map((conditionIndex: string, index: number) => {
            if (isPreview) {
                return (
                    <MedicalHistoryNoteRow
                        key={index}
                        index={conditionIndex}
                        isPreview={isPreview}
                        currentYear={this.props.currentYear}
                        deleteRow={this.deleteRow}
                        conditionInput={
                            <ConditionInput
                                key={index}
                                isPreview={isPreview}
                                index={conditionIndex}
                                category={'Medical History'}
                                condition={conditionIndex}
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                                standardizeName={this.standardizeMedicalName}
                            />
                        }
                    />
                );
            } else if (conditionIndex in standardMedicalHistory) {
                return (
                    <MedicalHistoryNoteRow
                        key={index}
                        index={conditionIndex}
                        isPreview={isPreview}
                        currentYear={this.props.currentYear}
                        deleteRow={this.deleteRow}
                        hide={this.props.hide}
                        conditionInput={
                            <ConditionInput
                                key={index}
                                index={conditionIndex}
                                category={'Medical History'}
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                                condition={
                                    standardMedicalHistory[conditionIndex]
                                        .condition
                                }
                                isPreview={isPreview}
                                standardizeName={this.standardizeMedicalName}
                                style={inputStyle}
                            />
                        }
                    />
                );
            }
        });
    }
}

interface OwnState {
    seenConditions: SeenCondition;
    currConditions: string[];
}

export type SeenCondition = {
    [index: string]: string;
};

interface ContentProps {
    isPreview: boolean;
    currentYear: number;
    responseChoice?: string[];
    responseType?: ResponseTypes;
    node?: string;
    hide?: boolean;
    showNo?: boolean;
}

interface MedicalHistoryProps {
    medicalHistory: MedicalHistoryState;
}

interface DispatchProps {
    toggleOption: (index: string, optionSelected: YesNoResponse) => void;
    updateStartYear: (index: string, newStartYear: number) => void;
    updateEndYear: (index: string, newEndYear: number) => void;
    updateComments: (index: string, newComments: string) => void;
    updateConditionResolved: (
        index: string,
        optionSelected: YesNoResponse
    ) => void;
    addPmhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddPmhPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
    popResponse: (medId: string, conditionIds: string[]) => PopResponseAction;
    deleteCondition: (conditionIndex: string) => void;
}

type Props = MedicalHistoryProps & DispatchProps & ContentProps;

const mapStateToProps = (state: CurrentNoteState): MedicalHistoryProps => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
    };
};

const mapDispatchToProps = {
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
    addPmhPopOptions,
    blankQuestionChange,
    popResponse,
    deleteCondition,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MedicalHistoryContent);
