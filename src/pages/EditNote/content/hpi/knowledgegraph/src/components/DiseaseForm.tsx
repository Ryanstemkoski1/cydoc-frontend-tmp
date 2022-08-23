import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import {
    GraphData,
    HpiStateProps,
    EdgeInterface,
    NodeInterface,
    OrderInterface,
    ResponseTypes,
} from 'constants/hpiEnums';
import axios from 'axios';
import { connect } from 'react-redux';
import { HpiState } from 'redux/reducers/hpiReducer';
import { CurrentNoteState } from 'redux/reducers';
import {
    addNode,
    AddNodeAction,
    addOrder,
    AddOrderAction,
} from 'redux/actions/hpiActions';
import { YesNoResponse } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import CreateResponse from './CreateResponse';

//The order goes DiseaseForm -> CreateResponse -> ButtonTag

interface DiseaseFormProps {
    nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    prevStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    categoryCode: string;
    category: string;
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
            graphData: { graph: {}, nodes: {}, edges: {}, order: {} },
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
            'https://cydocgraph.herokuapp.com/graph/category/' +
                this.props.categoryCode +
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
            Uses a stack to go through each node, record their child nodes,
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
        const { addNode, addOrder } = this.props,
            { graphData } = this.state,
            { graph, nodes, edges, order } = graphData,
            parentToChildNodes: { [parentNode: string]: string[] } = {};
        let stack = [order['1']];
        addOrder(order['1'], order);
        while (stack.length) {
            const currNode = stack.shift();
            if (!currNode || !(currNode in graph)) continue;
            const currEdges = graph[currNode],
                childNodes = currEdges
                    .map((edge: number) => [
                        edges[edge.toString()].toQuestionOrder.toString(),
                        edges[edge.toString()].to,
                    ])
                    .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
                    .map(([_questionOrder, medId]) => medId);
            parentToChildNodes[currNode] = childNodes;
            stack = [...childNodes, ...stack];
            addNode(
                currNode,
                nodes[currNode],
                currEdges.map((edge: number) => edges[edge.toString()])
            );
        }
        this.setState({
            parentToChildNodes: parentToChildNodes,
            isGraphProcessed: true,
        });
    }

    traverseChildNodes(): JSX.Element[] {
        const { parentToChildNodes, graphData } = this.state,
            { category, hpi } = this.props;
        const values: HpiState = hpi,
            nodeToElementDict: { [node: string]: JSX.Element } = {};
        let questionArr: JSX.Element[] = [];
        let stack = parentToChildNodes[graphData.order['1']].slice().reverse(); // add child nodes in reverse bc using stack
        while (stack.length) {
            const currNode = stack.pop();
            if (!currNode) continue;
            if (values.nodes[currNode].text != 'nan') {
                nodeToElementDict[currNode] = (
                    <CreateResponse
                        key={
                            Object.keys(values.nodes).length > 0
                                ? values.nodes[currNode].uid
                                : graphData.nodes[currNode].uid
                        }
                        node={currNode}
                        category={category}
                    />
                );
                questionArr = [...questionArr, nodeToElementDict[currNode]];
            }
            const childEdges =
                (values.nodes[currNode].responseType == ResponseTypes.YES_NO &&
                    values.nodes[currNode].response == YesNoResponse.Yes) ||
                (values.nodes[currNode].responseType == ResponseTypes.NO_YES &&
                    values.nodes[currNode].response == YesNoResponse.No) ||
                values.nodes[currNode].text == 'nan'
                    ? parentToChildNodes[currNode].slice().reverse()
                    : [];
            stack = [...stack, ...childEdges];
        }
        return questionArr;
    }

    render() {
        return this.state.isGraphProcessed ? (
            <div> {this.traverseChildNodes()} </div>
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
    addOrder: (medId: string, order: OrderInterface) => AddOrderAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & DiseaseFormProps;

const mapDispatchToProps = {
    addNode,
    addOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiseaseForm);
