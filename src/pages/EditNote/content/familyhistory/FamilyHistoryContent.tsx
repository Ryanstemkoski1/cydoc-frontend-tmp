import React, { Component } from 'react';
import GridContent from 'components/tools/GridContent.js';
import FamilyHistoryContentHeader from './FamilyHistoryContentHeader';
import ConditionInput from 'components/tools/ConditionInput';
import { FAMILY_HISTORY_MOBILE_BP } from 'constants/breakpoints.js';
import FamilyHistoryBlock from './FamilyHistoryBlock';
import AddRowButton from 'components/tools/AddRowButton.js';
import { connect } from 'react-redux';
import {
    toggleConditionOption,
    addFamilyMember,
    deleteFamilyMember,
    updateMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
    updateCondition,
    AddFhPopOptionsAction,
    addFhPopOptions,
    deleteCondition,
} from 'redux/actions/familyHistoryActions';
import { selectFamilyHistoryState } from 'redux/selectors/familyHistorySelectors';
import { CurrentNoteState } from 'redux/reducers';
import {
    FamilyHistoryCondition,
    FamilyHistoryState,
} from 'redux/reducers/familyHistoryReducer';
import { adjustValue } from '../medicalhistory/util';
import { medicalMapping } from 'constants/word-mappings';
import { v4 } from 'uuid';
import { ResponseTypes } from 'constants/hpiEnums';
import {
    blankQuestionChange,
    BlankQuestionChangeAction,
    PopResponseAction,
    popResponse,
} from 'redux/actions/hpiActions';
import { standardizeDiseaseNames } from 'constants/standardizeDiseaseNames';
import diseaseSynonyms from 'constants/diseaseSynonyms';
import '../hpi/knowledgegraph/src/css/Button.css';
import { YesNoResponse } from 'constants/enums';
import constants from 'constants/constants.json';

//TODO: finish the styling for this page
//Component that manages the layout for the Family History page.
class FamilyHistoryContent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.addRow = this.addRow.bind(this);
        this.addSeenCond = this.addSeenCond.bind(this);
        //Checks if all response choices exist and adds new ones
        const values = this.props.familyHistory;
        const conditions: SeenCondition = {};
        Object.keys(values).forEach((val: string) => {
            const name: string = values[val]['condition'];
            conditions[adjustValue(name, medicalMapping)] = val;
        });
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            seenConditions: conditions,
            currConditions: Object.keys(this.props.familyHistory).filter(
                (condition) =>
                    this.props.familyHistory[condition].condition.length &&
                    this.props.familyHistory[condition].hasAfflictedFamilyMember
            ),
        };
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

    addRow() {
        const {
            responseType,
            node,
            addFhPopOptions,
            blankQuestionChange,
        } = this.props;
        const newKey = v4();
        addFhPopOptions(newKey, '');
        if (responseType == ResponseTypes.FH_BLANK && node)
            blankQuestionChange(node, newKey);
        else
            this.setState({
                currConditions: [...this.state.currConditions, newKey],
            });
    }

    deleteRow = (index: string) => {
        this.props.deleteCondition(index);
    };

    addSeenCond = (value: string, index: string) => {
        const seenConditions = this.state.seenConditions;
        seenConditions[this.standardizeMedicalName(value)] = index;
        this.setState({ seenConditions });
    };

    standardizeMedicalName(name: string) {
        const standardName = standardizeDiseaseNames(name);
        let standardReplacedName = standardName;
        if (standardName in diseaseSynonyms) {
            standardReplacedName = diseaseSynonyms[standardName];
        }
        return standardReplacedName;
    }

    standardizeFamilyHistory(famHistState: FamilyHistoryState) {
        const standardFamilyHistory = famHistState;

        Object.entries(standardFamilyHistory).map(
            (value: [string, FamilyHistoryCondition], index: number) => {
                const disease = value[1]['condition'];
                const standardDisease = standardizeDiseaseNames(disease);
                let standardReplacedDisease = standardDisease;
                if (standardDisease in diseaseSynonyms) {
                    standardReplacedDisease = diseaseSynonyms[standardDisease];
                }
                value[1]['condition'] = standardReplacedDisease;
            }
        );

        return standardFamilyHistory;
    }

    render() {
        const { windowWidth } = this.state;
        const {
            responseChoice,
            addFhPopOptions,
            responseType,
            popResponse,
            node,
            familyHistory,
        } = this.props;
        const standardFamilyHistory = this.standardizeFamilyHistory(
            familyHistory
        );
        const defaultConditions = constants.CONDITIONS.map((condition) =>
            this.standardizeMedicalName(condition)
        );
        const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
        //Create collection of rows
        // Use second OR statement so that the information may be auto-populated in the Family History tab
        let listValues = Object.keys(standardFamilyHistory).filter(
            (condition) =>
                defaultConditions.includes(
                    standardFamilyHistory[condition].condition
                ) ||
                this.state.currConditions.includes(condition) ||
                standardFamilyHistory[condition].hasAfflictedFamilyMember ==
                    YesNoResponse.Yes
        );
        if (responseType == ResponseTypes.FH_POP && responseChoice && node) {
            // create map of condition: key to look for existing conditions in family history
            listValues = responseChoice.map((condition) => {
                const key = Object.keys(standardFamilyHistory).find(
                    (entry) =>
                        standardFamilyHistory[entry].condition == condition
                );
                let conditionKey = '';
                if (key) conditionKey = key;
                else {
                    conditionKey = v4();
                    addFhPopOptions(conditionKey, condition);
                }
                return conditionKey;
            });
            popResponse(node, listValues);
        } else if (responseType == ResponseTypes.FH_BLANK && responseChoice)
            listValues = responseChoice;

        const listItems = listValues.map((condition, index) => {
            let conditionName = '';
            if (condition in standardFamilyHistory)
                conditionName = standardFamilyHistory[condition].condition;
            if (this.props.isPreview) {
                return (
                    <FamilyHistoryBlock
                        isPreview={this.props.isPreview}
                        key={index}
                        mobile={mobile}
                        conditionInp={
                            <ConditionInput
                                seenConditions={this.state.seenConditions}
                                addSeenCondition={this.addSeenCond}
                                isPreview={this.props.isPreview}
                                condition={conditionName}
                                key={index}
                                index={condition}
                                category={'Family History'}
                                standardizeName={this.standardizeMedicalName}
                            />
                        }
                        index={''}
                        pop={false}
                        deleteRow={this.deleteRow}
                    />
                );
            } else {
                return (
                    <FamilyHistoryBlock
                        isPreview={this.props.isPreview}
                        key={index}
                        mobile={mobile}
                        conditionInp={
                            <ConditionInput
                                seenConditions={this.state.seenConditions}
                                addSeenCondition={this.addSeenCond}
                                isPreview={this.props.isPreview}
                                condition={conditionName}
                                key={index}
                                index={condition}
                                category={'Family History'}
                                standardizeName={this.standardizeMedicalName}
                            />
                        }
                        index={condition}
                        pop={true}
                        deleteRow={this.deleteRow}
                    />
                );
            }
        });

        return mobile ? (
            <>
                <GridContent
                    isPreview={this.props.isPreview}
                    numColumns={4}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    pop={this.props.responseType == ResponseTypes.FH_POP}
                    conditions={listValues}
                    mobile={mobile}
                    addRow={this.addRow}
                    name={'disease'}
                />
            </>
        ) : (
            <>
                <div style={{ marginTop: 25 }}> </div>
                {listItems}
                {this.props.responseType != ResponseTypes.FH_POP ? (
                    <AddRowButton onClick={this.addRow} name={'disease'} />
                ) : (
                    ''
                )}
            </>
        );
    }
}

type SeenCondition = {
    [index: string]: string;
};

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
}

interface ContentProps {
    isPreview: boolean;
    responseChoice?: string[];
    responseType?: ResponseTypes;
    node?: string;
}

interface DispatchProps {
    addFhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddFhPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
    popResponse: (medId: string, conditionIds: string[]) => PopResponseAction;
    deleteCondition: (index: string) => void;
}

interface State {
    seenConditions: SeenCondition;
    windowWidth: number;
    windowHeight: number;
    currConditions: string[];
}

type Props = FamilyHistoryProps & ContentProps & DispatchProps;

const mapStateToProps = (state: CurrentNoteState): FamilyHistoryProps => {
    return {
        familyHistory: selectFamilyHistoryState(state),
    };
};

const mapDispatchToProps = {
    toggleConditionOption,
    addFamilyMember,
    deleteFamilyMember,
    updateMember,
    toggleCauseOfDeathOption,
    toggleLivingOption,
    updateComments,
    updateCondition,
    addFhPopOptions,
    blankQuestionChange,
    popResponse,
    deleteCondition,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FamilyHistoryContent);
