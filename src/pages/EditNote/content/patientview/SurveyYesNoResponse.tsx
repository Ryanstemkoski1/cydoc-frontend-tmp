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
import { GraphData, NodeInterface } from 'constants/hpiEnums';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from 'redux/actions/hpiActions';
import {
    addDisplayedNodes,
    AddDisplayedNodesAction,
    removeAllNodes,
    RemoveAllNodesAction,
} from 'redux/actions/displayedNodesActions';

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
        const { data } = response,
            { graph, nodes, edges } = data as GraphData,
            name = this.props.userSurveyState.nodes[this.props.id].doctorView,
            parentNode = this.props.hpiHeaders.parentNodes[name][
                chiefComplaint
            ];
        this.props.processKnowledgeGraph(data);
        const childNodes = graph[parentNode]
            .map((edge: number) => [
                edges[edge.toString()].toQuestionOrder.toString(),
                edges[edge.toString()].to,
            ])
            .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
            .map(([_questionOrder, medId]) => medId);
        this.props.addDisplayedNodes(chiefComplaint, childNodes, nodes);
    };

    addChiefComplaint(action: YesNoResponse) {
        const {
                userSurveyState,
                id,
                hpiHeaders,
                selectChiefComplaint,
                chiefComplaints,
                removeAllNodes,
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
                if (key in chiefComplaints)
                    removeAllNodes(Object.keys(hpiHeaders.parentNodes[key])[0]);
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
    addDisplayedNodes: (
        category: string,
        nodesArr: string[],
        nodes: {
            [node: string]: NodeInterface;
        }
    ) => AddDisplayedNodesAction;
    removeAllNodes: (category: string) => RemoveAllNodesAction;
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
    addDisplayedNodes,
    removeAllNodes,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyYesNoResponse);
