import React from 'react';
import './BodySystemDropdown';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ToggleButton from 'components/tools/ToggleButton';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import { ChiefComplaintsProps, HpiHeadersProps } from '../../HPIContent';
import { GraphData } from 'constants/hpiEnums';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from 'redux/actions/hpiActions';
import axios from 'axios';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import {
    addDisplayedNodes,
    AddDisplayedNodesAction,
    removeAllNodes,
    RemoveAllNodesAction,
} from 'redux/actions/displayedNodesActions';

interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    getData = async (chiefComplaint: string) => {
        const response = await axios.get(
            'https://cydocgraph.herokuapp.com/graph/category/' +
                chiefComplaint +
                '/4'
        );
        const { data } = response,
            { graph, nodes, edges, order } = data as GraphData,
            firstOrderNodes = graph[order['1']].reduce((prevVal, edge) => {
                const node = edges[edge.toString()].to;
                let childNodes = [node];
                if (['GENERAL', 'PAIN'].includes(nodes[node].category))
                    childNodes = [
                        ...childNodes,
                        ...graph[node].map((edge) => edges[edge.toString()].to),
                    ];
                return [...prevVal, ...childNodes];
            }, [] as string[]);
        this.props.processKnowledgeGraph(data);
        this.props.addDisplayedNodes(chiefComplaint, firstOrderNodes);
    };
    render() {
        const {
            selectChiefComplaint,
            name,
            chiefComplaints,
            hpiHeaders,
            patientView,
            removeAllNodes,
        } = this.props;
        return (
            <ToggleButton
                className='tag_text'
                active={name in chiefComplaints}
                condition={name}
                title={
                    patientView && name in hpiHeaders.parentNodes
                        ? hpiHeaders.parentNodes[name].patientView
                        : name
                }
                onToggleButtonClick={() => {
                    selectChiefComplaint(name);
                    if (name in chiefComplaints)
                        removeAllNodes(
                            Object.keys(hpiHeaders.parentNodes[name])[0]
                        );
                    this.getData(Object.keys(hpiHeaders.parentNodes[name])[0]);
                }}
            />
        );
    }
}

interface DispatchProps {
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
    addDisplayedNodes: (
        category: string,
        nodes: string[]
    ) => AddDisplayedNodesAction;
    removeAllNodes: (category: string) => RemoveAllNodesAction;
}

export interface PatientViewProps {
    patientView: boolean;
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & HpiHeadersProps & PatientViewProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
    patientView: selectPatientViewState(state),
});

type Props = DispatchProps &
    ChiefComplaintsButtonProps &
    ChiefComplaintsProps &
    HpiHeadersProps &
    PatientViewProps;

const mapDispatchToProps = {
    selectChiefComplaint,
    processKnowledgeGraph,
    addDisplayedNodes,
    removeAllNodes,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
