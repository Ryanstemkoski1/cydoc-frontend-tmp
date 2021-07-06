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
    BlankQuestionChange,
    BlankQuestionChangeAction,
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
        if (
            this.props.responseType == ResponseTypes.FH_BLANK &&
            this.props.node
        ) {
            const newKey = v4();
            this.props.addFhPopOptions(newKey, '');
            this.props.BlankQuestionChange(this.props.node, newKey);
        }
        this.props.addCondition();
    }

    addSeenCond = (value: string, index: string) => {
        const seenConditions = this.state.seenConditions;
        seenConditions[value] = index;
        this.setState({ seenConditions });
    };

    render() {
        const { windowWidth } = this.state;
        const { responseChoice, addFhPopOptions, responseType } = this.props;
        const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
        //Create collection of rows
        // Use second OR statement so that the information may be auto-populated in the Family History tab
        let listValues = Object.keys(this.props.familyHistory);
        if (responseType == ResponseTypes.FH_POP) {
            // create map of condition: key to look for existing conditions
            const conditionKeyMap: { [condition: string]: string } = {};
            for (const key in this.props.familyHistory) {
                const conditionName = this.props.familyHistory[key].condition;
                conditionKeyMap[conditionName] = key;
            }
            const fhPopKeys = [];
            for (const conditionKey in responseChoice) {
                const conditionName = responseChoice[conditionKey];
                if (responseChoice[conditionKey] in conditionKeyMap)
                    fhPopKeys.push(conditionKeyMap[conditionName]);
                else {
                    const newKey = v4();
                    addFhPopOptions(newKey, conditionName);
                    fhPopKeys.push(newKey);
                }
            }
            listValues = fhPopKeys;
        } else if (responseType == ResponseTypes.FH_BLANK) {
            listValues = responseChoice;
        }
        const listItems = listValues.map((condition, index) => {
            let conditionName = '';
            if (condition in this.props.familyHistory)
                conditionName = this.props.familyHistory[condition].condition;
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
            this.props.responseType == ResponseTypes.FH_BLANK &&
            !this.props.responseChoice.length
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
    responseChoice: string[];
    responseType: ResponseTypes;
    node?: string;
}

interface DispatchProps {
    addCondition: () => void;
    addFhPopOptions: (
        conditionIndex: string,
        conditionName: string
    ) => AddFhPopOptionsAction;
    BlankQuestionChange: (
        medId: string,
        conditionId: string
    ) => BlankQuestionChangeAction;
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
    BlankQuestionChange,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FamilyHistoryContent);
