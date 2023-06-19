import ToggleButton from 'components/tools/ToggleButton';
import React from 'react';
import {
    initialSurveyYesNo,
    InitialSurveyYesNoAction,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import { connect } from 'react-redux';
import { YesNoResponse } from 'constants/enums';
import { userSurveyState } from 'redux/reducers/userViewReducer';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from '../hpi/knowledgegraph/HPIContent';
import axios from 'axios';
import { GraphData } from 'constants/hpiEnums';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from 'redux/actions/hpiActions';

interface SurveyYesNoResponseProps {
    id: string;
}

class SurveyYesNoResponse extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    getData = async (chiefComplaint: string) => {
        const response = await axios.get(
            'https://cydocgraph.herokuapp.com/graph/category/' +
                chiefComplaint +
                '/4'
        );
        this.props.processKnowledgeGraph(response.data);
    };

    addChiefComplaint(action: YesNoResponse) {
        const {
                userSurveyState,
                id,
                hpiHeaders,
                selectChiefComplaint,
            } = this.props,
            category = userSurveyState.nodes[id].category,
            prevVal = userSurveyState.nodes[id].response;
        if (category.length) {
            const key = Object.keys(hpiHeaders.parentNodes).find(
                (k) => Object.keys(hpiHeaders.parentNodes[k])[0] == category
            );
            if (
                key &&
                !(prevVal == YesNoResponse.No && action == YesNoResponse.No) &&
                !(prevVal == YesNoResponse.None && action == YesNoResponse.No)
            ) {
                selectChiefComplaint(key);
            }
        }
    }

    render() {
        const { userSurveyState, id, initialSurveyYesNo } = this.props;
        return (
            <div className='qa-button'>
                <ToggleButton
                    className='button_yesno'
                    active={
                        userSurveyState.nodes[id].response == YesNoResponse.Yes
                    }
                    title='Yes'
                    onToggleButtonClick={() => {
                        this.addChiefComplaint(YesNoResponse.Yes);
                        initialSurveyYesNo(id, YesNoResponse.Yes);
                        const category = userSurveyState.nodes[id].category;
                        if (category.length) this.getData(category);
                    }}
                />
                <ToggleButton
                    className='button_yesno'
                    active={
                        userSurveyState.nodes[id].response == YesNoResponse.No
                    }
                    title='No'
                    onToggleButtonClick={() => {
                        this.addChiefComplaint(YesNoResponse.No);
                        initialSurveyYesNo(id, YesNoResponse.No);
                    }}
                />
            </div>
        );
    }
}

export interface initialSurveyProps {
    userSurveyState: userSurveyState;
}

const mapStateToProps = (
    state: CurrentNoteState
): initialSurveyProps & ChiefComplaintsProps & HpiHeadersProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
        chiefComplaints: selectChiefComplaintsState(state),
        hpiHeaders: state.hpiHeaders,
    };
};

interface DispatchProps {
    initialSurveyYesNo: (
        uid: string,
        response: YesNoResponse
    ) => InitialSurveyYesNoAction;
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
}

type Props = initialSurveyProps &
    SurveyYesNoResponseProps &
    DispatchProps &
    ChiefComplaintsProps &
    HpiHeadersProps;

const mapDispatchToProps = {
    initialSurveyYesNo,
    selectChiefComplaint,
    processKnowledgeGraph,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyYesNoResponse);
