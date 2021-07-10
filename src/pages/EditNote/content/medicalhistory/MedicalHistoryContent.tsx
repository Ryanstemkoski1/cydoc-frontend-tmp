import MedicalHistoryNoteRow from './MedicalHistoryNoteRow';
import MedicalHistoryNoteItem from './MedicalHistoryNoteItem';
import React from 'react';
import MedicalHistoryContentHeader from './MedicalHistoryContentHeader';
import GridContent from 'components/tools/GridContent.js';
import { CONDITIONS } from 'constants/constants.json';
import ConditionInput from 'components/tools/ConditionInput';
import { adjustValue } from './util';
import { medicalMapping } from 'constants/word-mappings';
import { connect } from 'react-redux';
import {
    addDefaultCondition,
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
    addPmhPopOptions,
    AddPmhPopOptionsAction,
} from 'redux/actions/medicalHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { YesNoResponse } from 'constants/enums';
import { TextAreaProps, ButtonProps } from 'semantic-ui-react';
import { selectMedicalHistoryState } from 'redux/selectors/medicalHistorySelector';
import { ResponseTypes } from 'constants/hpiEnums';
import { v4 } from 'uuid';
import {
    blankQuestionChange,
    BlankQuestionChangeAction,
    PopResponseAction,
    popResponse,
} from 'redux/actions/hpiActions';
import AddRowButton from 'components/tools/AddRowButton';

//Component that manages the layout of the medical history tab content
class MedicalHistoryContent extends React.Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            seenConditions: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleConditionToggleButtonClick = this.handleConditionToggleButtonClick.bind(
            this
        );
        this.handleResolvedToggleButtonClick = this.handleResolvedToggleButtonClick.bind(
            this
        );
        this.generateListItems = this.generateListItems.bind(this);
        this.addSeenCondition = this.addSeenCondition.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    componentDidMount() {
        const values = this.props.medicalHistory;
        const seenConditions: SeenCondition = {};
        Object.keys(values).forEach((val: string) => {
            const name: string = values[val]['condition'];
            seenConditions[adjustValue(name, medicalMapping)] = val;
        });
        this.setState({ seenConditions });
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
        Object.entries(this.props.medicalHistory).forEach((disease) => {
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
        Object.entries(this.props.medicalHistory).forEach((disease) => {
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
        if (
            this.props.responseType == ResponseTypes.PMH_BLANK &&
            this.props.node
        ) {
            const newKey = v4();
            this.props.addPmhPopOptions(newKey, '');
            this.props.blankQuestionChange(this.props.node, newKey);
        }
        this.props.addDefaultCondition();
    }

    render() {
        const {
            mobile,
            responseChoice,
            responseType,
            addPmhPopOptions,
            popResponse,
            node,
            medicalHistory,
        } = this.props;
        let listValues = Object.keys(medicalHistory) || CONDITIONS;
        // The second OR statement gets the list of Conditions in the "Medical History" context
        if (responseType == ResponseTypes.PMH_POP && responseChoice) {
            const conditionKeyMap: { [condition: string]: string } = {};
            for (const key in medicalHistory) {
                const conditionName = medicalHistory[key].condition;
                conditionKeyMap[conditionName] = key;
            }
            const MhPopKeys = [];
            for (const conditionKey in responseChoice) {
                const conditionName = responseChoice[conditionKey];
                if (conditionName in conditionKeyMap)
                    MhPopKeys.push(conditionKeyMap[conditionName]);
                else {
                    const newKey = v4();
                    addPmhPopOptions(newKey, conditionName);
                    MhPopKeys.push(newKey);
                }
            }
            listValues = MhPopKeys;
            if (node) popResponse(node, listValues);
        }
        if (responseType == ResponseTypes.PMH_BLANK && responseChoice) {
            if (!responseChoice.length)
                return <AddRowButton onClick={this.addRow} name={'disease'} />;
            listValues = responseChoice;
        }
        const rows = this.generateListItems(listValues as string[], mobile);

        return (
            <GridContent
                isPreview={this.props.isPreview}
                numColumns={6}
                contentHeader={<MedicalHistoryContentHeader />}
                rows={rows}
                //TODO: hpi?
                value_type='Medical History'
                mobile={mobile}
                addRow={this.addRow}
                name={'medical history'}
                pop={this.props.responseType == ResponseTypes.PMH_POP}
            />
        );
    }

    generateListItems(conditions: string[], mobile: boolean) {
        const { isPreview } = this.props;
        const { seenConditions } = this.state;
        return mobile
            ? conditions.map((condition: string, index: number) => {
                  if (isPreview) {
                      return (
                          <MedicalHistoryNoteItem
                              key={index}
                              index={condition}
                              conditionInput={
                                  <ConditionInput
                                      key={index}
                                      index={condition}
                                      category={'Medical History'}
                                      isPreview={isPreview}
                                      seenConditions={seenConditions}
                                      addSeenCondition={this.addSeenCondition}
                                      condition={condition}
                                  />
                              }
                              currentYear={this.props.currentYear}
                          />
                      );
                  } else if (condition in this.props.medicalHistory) {
                      return (
                          <MedicalHistoryNoteItem
                              key={index}
                              index={condition}
                              currentYear={this.props.currentYear}
                              conditionInput={
                                  <ConditionInput
                                      key={index}
                                      isPreview={isPreview}
                                      index={condition}
                                      category={'Medical History'}
                                      seenConditions={seenConditions}
                                      addSeenCondition={this.addSeenCondition}
                                      condition={
                                          this.props.medicalHistory[condition]
                                              .condition
                                      }
                                  />
                              }
                          />
                      );
                  }
              })
            : conditions.map((conditionIndex: string, index: number) => {
                  if (isPreview) {
                      return (
                          <MedicalHistoryNoteRow
                              key={index}
                              index={conditionIndex}
                              isPreview={isPreview}
                              currentYear={this.props.currentYear}
                              conditionInput={
                                  <ConditionInput
                                      key={index}
                                      isPreview={isPreview}
                                      index={conditionIndex}
                                      category={'Medical History'}
                                      condition={conditionIndex}
                                      seenConditions={seenConditions}
                                      addSeenCondition={this.addSeenCondition}
                                  />
                              }
                          />
                      );
                  } else if (conditionIndex in this.props.medicalHistory) {
                      return (
                          <MedicalHistoryNoteRow
                              key={index}
                              index={conditionIndex}
                              isPreview={isPreview}
                              currentYear={this.props.currentYear}
                              conditionInput={
                                  <ConditionInput
                                      key={index}
                                      index={conditionIndex}
                                      category={'Medical History'}
                                      seenConditions={seenConditions}
                                      addSeenCondition={this.addSeenCondition}
                                      condition={
                                          this.props.medicalHistory[
                                              conditionIndex
                                          ].condition
                                      }
                                      isPreview={isPreview}
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
}

export type SeenCondition = {
    [index: string]: string;
};

interface ContentProps {
    isPreview: boolean;
    mobile: boolean;
    currentYear: number;
    responseChoice?: string[];
    responseType?: ResponseTypes;
    node?: string;
}

interface MedicalHistoryProps {
    medicalHistory: MedicalHistoryState;
}

interface DispatchProps {
    addDefaultCondition: () => void;
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
}

type Props = MedicalHistoryProps & DispatchProps & ContentProps;

const mapStateToProps = (state: CurrentNoteState): MedicalHistoryProps => {
    return {
        medicalHistory: selectMedicalHistoryState(state),
    };
};

const mapDispatchToProps = {
    addDefaultCondition,
    toggleOption,
    updateStartYear,
    updateEndYear,
    updateComments,
    updateConditionResolved,
    addPmhPopOptions,
    blankQuestionChange,
    popResponse,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MedicalHistoryContent);
