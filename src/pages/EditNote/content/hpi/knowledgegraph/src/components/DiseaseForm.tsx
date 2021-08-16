import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import {
    DoctorView,
    GraphData,
    HpiStateProps,
    EdgeInterface,
    NodeInterface,
} from 'constants/hpiEnums';
import axios from 'axios';
import { connect } from 'react-redux';
import { HpiState } from 'redux/reducers/hpiReducer';
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
        /*
            Uses a queue to go through each node, record their child nodes,
            and put them in order of: GENERAL type questions, PAIN type 
            questions, same category questions (in question order edge 
            attribute order) and different category questions (in 
            lexicographic order). A depth dictionary is also used to record
            the parent node and depth of each child node. If a child node 
            has already been processed, if its depth is less than that of 
            the previously processed version of itself (if it's shallower),
            then the shallower child node will replace the previously recorded
            version and it will be removed from its previous parent's record.
        */
        const { parentNode, addNode } = this.props,
            { graphData } = this.state,
            { graph, nodes, edges } = graphData,
            parentToChildNodes: { [parentNode: string]: string[] } = {},
            depthDict: {
                [node: string]: { parent: string; depth: number };
            } = {};
        let queue = [parentNode],
            queueDepth = [1];
        while (queue.length) {
            const currNode = queue.shift(),
                currDepth = queueDepth.shift();
            if (!currNode || !(currNode in graph)) continue;
            const currEdges = graph[currNode],
                currCategory = nodes[currNode].category,
                arrayDict: {
                    [category: string]: [string, number, EdgeInterface][];
                } = {
                    GENERAL: [],
                    PAIN: [],
                    [currCategory]: [],
                    ELSE: [],
                };
            currEdges.map((edge: number) => {
                const edgeInfo = edges[edge.toString()],
                    to = edgeInfo.to,
                    toQuestionOrder = edgeInfo.toQuestionOrder,
                    category =
                        nodes[to].category in arrayDict
                            ? nodes[to].category
                            : 'ELSE';
                arrayDict[category] = [
                    ...arrayDict[category],
                    [to, toQuestionOrder, edgeInfo],
                ];
                if (
                    to in depthDict &&
                    !['GEN', 'PAI'].includes(to.slice(0, 3)) // GENERAL and PAIN questions may repeat for different subgraphs
                ) {
                    if (currDepth && depthDict[to].depth > currDepth) {
                        // if the current node is shallower than the previously recorded one
                        parentToChildNodes[
                            depthDict[to].parent
                        ] = parentToChildNodes[depthDict[to].parent].filter(
                            (child) => child != to
                        );
                        depthDict[to] = {
                            parent: currNode,
                            depth: currDepth,
                        };
                    }
                } else
                    depthDict[to] = {
                        parent: currNode,
                        depth: currDepth || -1,
                    };
            });
            Object.keys(arrayDict).map((key) => {
                arrayDict[key] = arrayDict[key]
                    .sort()
                    .sort((tup1, tup2) => tup1[1] - tup2[1]);
            }); // sort by lexicographic order and questionOrder
            // child questions are in order of GENERAL, PAIN, current category, and other categories
            let edgesList: EdgeInterface[] = [];
            const childNodes = [
                ...arrayDict.GENERAL,
                ...arrayDict.PAIN,
                ...arrayDict[currCategory],
                ...arrayDict.ELSE,
            ].map((tup) => {
                edgesList = [...edgesList, tup[2]];
                return tup[0];
            }); // child nodes in order
            parentToChildNodes[currNode] = childNodes;
            queue = [...queue, ...childNodes];
            queueDepth = [
                ...queueDepth,
                ...Array(childNodes.length).fill(currDepth),
            ];
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
        const values: HpiState = hpi,
            nodeToElementDict: { [node: string]: JSX.Element } = {};
        let questionArr: JSX.Element[] = [];
        let stack = parentToChildNodes[parentNode].slice().reverse(); // add child nodes in reverse bc using stack
        while (stack.length) {
            const currNode = stack.pop();
            if (!currNode) continue;
            if (values.nodes[currNode].text != 'nan') {
                nodeToElementDict[currNode] = (
                    <CreateResponse
                        key={graphData.nodes[currNode].uid}
                        node={currNode}
                        category={category}
                    />
                );
                questionArr = [...questionArr, nodeToElementDict[currNode]];
            }
            const childEdges =
                values.nodes[currNode].response == YesNoResponse.Yes ||
                values.nodes[currNode].text == 'nan'
                    ? parentToChildNodes[currNode].slice().reverse()
                    : [];
            stack = [...stack, ...childEdges];
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
