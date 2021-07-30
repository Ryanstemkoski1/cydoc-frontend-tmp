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
    addCondition,
    updateCondition,
    AddFhPopOptionsAction,
    addFhPopOptions,
} from 'redux/actions/familyHistoryActions';
import { selectFamilyHistoryState } from 'redux/selectors/familyHistorySelectors';
import { CurrentNoteState } from 'redux/reducers';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
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
            addCondition,
        } = this.props;
        if (responseType == ResponseTypes.FH_BLANK && node) {
            const newKey = v4();
            addFhPopOptions(newKey, '');
            blankQuestionChange(node, newKey);
        } else addCondition();
    }

    addSeenCond = (value: string, index: string) => {
        const seenConditions = this.state.seenConditions;
        seenConditions[value] = index;
        this.setState({ seenConditions });
    };

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
        const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
        //Create collection of rows
        // Use second OR statement so that the information may be auto-populated in the Family History tab
        let listValues = Object.keys(familyHistory);
        if (responseType == ResponseTypes.FH_POP && responseChoice) {
            // create map of condition: key to look for existing conditions in family history
            const conditionKeyMap: { [condition: string]: string } = {};
            for (const key in familyHistory) {
                const conditionName = familyHistory[key].condition;
                conditionKeyMap[conditionName] = key;
            }
            const fhPopKeys = [];
            for (const conditionKey in responseChoice) {
                const conditionName = responseChoice[conditionKey];
                if (conditionName in conditionKeyMap)
                    fhPopKeys.push(conditionKeyMap[conditionName]);
                else {
                    const newKey = v4();
                    addFhPopOptions(newKey, conditionName);
                    fhPopKeys.push(newKey);
                }
            }
            listValues = fhPopKeys;
            if (node) popResponse(node, listValues);
        } else if (responseType == ResponseTypes.FH_BLANK && responseChoice)
            listValues = responseChoice;
        const listItems = listValues.map((condition, index) => {
            let conditionName = '';
            if (condition in familyHistory)
                conditionName = familyHistory[condition].condition;
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
                            />
                        }
                        index={''}
                        pop={false}
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
                            />
                        }
                        index={condition}
                        pop={this.props.responseType == ResponseTypes.FH_POP}
                    />
                );
            }
        });
        // if FH-BLANK with no response-choice
        if (
            responseType == ResponseTypes.FH_BLANK &&
            responseChoice &&
            !responseChoice.length
        ) {
            return <AddRowButton onClick={this.addRow} name={'disease'} />;
        }

        return mobile ? (
            <>
                <GridContent
                    isPreview={this.props.isPreview}
                    numColumns={4}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    pop={this.props.responseType == ResponseTypes.FH_POP}
                    value_type='Family History'
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
    addCondition: () => void;
    addFhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddFhPopOptionsAction;
    blankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
    popResponse: (medId: string, conditionIds: string[]) => PopResponseAction;
}

interface State {
    seenConditions: SeenCondition;
    windowWidth: number;
    windowHeight: number;
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
    addCondition,
    updateCondition,
    addFhPopOptions,
    blankQuestionChange,
    popResponse,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FamilyHistoryContent);
