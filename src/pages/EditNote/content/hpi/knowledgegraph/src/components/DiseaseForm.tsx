import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import {
    DoctorView,
    GraphData,
    HpiStateProps,
    EdgeInterface,
} from 'constants/hpiEnums';
import axios from 'axios';
import { connect } from 'react-redux';
import { HpiState, NodeInterface } from 'redux/reducers/hpiReducer';
import { CurrentNoteState } from 'redux/reducers';
import { addNode, AddNodeAction } from 'redux/actions/hpiActions';
import { YesNoResponse } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import CreateResponse from './CreateResponse';

//The order goes DiseaseForm -> CreateResponse -> ButtonTag

interface DiseaseFormProps {
    nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    prevStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    parentNode: string;
    category: DoctorView;
}

interface DiseaseFormState {
    isGraphLoaded: boolean;
    isGraphProcessed: boolean;
    parentToChildNodes: { [parentNode: string]: string[] };
    graphData: GraphData;
}

export class DiseaseForm extends React.Component<Props, DiseaseFormState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isGraphLoaded: false,
            isGraphProcessed: false, // true when knowledge graph is processed
            parentToChildNodes: {},
            graphData: { graph: {}, nodes: {}, edges: {} },
        };
    }

    componentDidMount(): void {
        try {
            this.getData();
        } catch (err) {
            alert(err);
        }
    }

    async getData(): Promise<void> {
        const response = await axios.get(
            'https://cydocgraph.herokuapp.com/graph/subgraph/' +
                this.props.parentNode +
                '/4'
        );
        const { data } = response;
        this.setState({ graphData: data, isGraphLoaded: true });
        this.processKnowledgeGraph();
    }

    continue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        this.props.nextStep(e);
    };

    back = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        this.props.prevStep(e);
    };

    processKnowledgeGraph(): void {
        // TODO: does this also need a set to keep track of nodes like for traversal()
        const { parentNode, addNode } = this.props;
        const { graphData } = this.state;
        const { graph, nodes, edges } = graphData;
        const parentToChildNodes: { [parentNode: string]: string[] } = {};
        let queue = [parentNode];
        while (queue.length) {
            const currNode = queue.shift();
            if (!currNode || !(currNode in graph)) continue;
            const currEdges = graph[currNode]; // edges associated with current node
            let questionOrderList: [
                string,
                number,
                EdgeInterface
            ][] = currEdges.map((edge: number) => {
                // list of tuples (to node, toQuestionOrder)
                const edgeInfo = edges[edge.toString()];
                const to = edgeInfo.to;
                const toQuestionOrder = edgeInfo.toQuestionOrder;
                return [
                    to,
                    toQuestionOrder != -1
                        ? toQuestionOrder
                        : edge + currEdges.length,
                    edgeInfo,
                ];
            });
            questionOrderList = questionOrderList.sort(
                (tup1, tup2) => tup1[1] - tup2[1]
            ); // sort by questionOrder
            const childNodes = questionOrderList.map((tup) => tup[0]); // child nodes in order
            const edgesList = questionOrderList.map((tup) => tup[2]);
            parentToChildNodes[currNode] = childNodes;
            queue = [...queue, ...childNodes];
            addNode(currNode, nodes[currNode], edgesList);
        }
        this.setState({
            parentToChildNodes: parentToChildNodes,
            isGraphProcessed: true,
        });
    }

    traverseChildNodes(): JSX.Element[] {
        const { parentToChildNodes, graphData } = this.state;
        const { parentNode, category, hpi } = this.props;
        const values: HpiState = hpi;
        const nodeSet = new Set();
        let questionArr: JSX.Element[] = [];
        let stack = parentToChildNodes[parentNode].slice().reverse(); // add child nodes in reverse bc using stack
        while (stack.length) {
            const currNode = stack.pop();
            if (!currNode || nodeSet.has(currNode)) continue;
            if (values.nodes[currNode].text != 'nan')
                questionArr = [
                    ...questionArr,
                    <CreateResponse
                        key={graphData.nodes[currNode].uid}
                        node={currNode}
                        category={category}
                    />,
                ];

            const childEdges =
                values.nodes[currNode].response == YesNoResponse.Yes ||
                values.nodes[currNode].text == 'nan'
                    ? parentToChildNodes[currNode].slice().reverse()
                    : [];
            stack = [...stack, ...childEdges];
            nodeSet.add(currNode);
        }
        return questionArr;
    }

    render() {
        return this.state.isGraphProcessed ? (
            <div className='question-map'> {this.traverseChildNodes()} </div>
        ) : (
            <h1>Loading...</h1>
        );
    }
}

interface DispatchProps {
    addNode: (
        medId: string,
        node: NodeInterface,
        edges: EdgeInterface[]
    ) => AddNodeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & DiseaseFormProps;

const mapDispatchToProps = {
    addNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiseaseForm);
