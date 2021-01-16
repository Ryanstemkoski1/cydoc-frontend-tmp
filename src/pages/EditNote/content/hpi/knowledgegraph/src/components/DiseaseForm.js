import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import DiseaseFormQuestions from './DiseaseFormQuestions';
import '../css/App.css';
import HPIContext from 'contexts/HPIContext.js';
import {
    DISEASE_TABS_MED_BP,
    DISEASE_TABS_SMALL_BP,
} from 'constants/breakpoints';
import '../../HPI.css';
import axios from 'axios';

//The order goes DiseaseForm -> DiseaseFormQuestions -> QuestionAnswer -> ButtonTag

export class DiseaseForm extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            isGraphProcessed: false, // true when knowledge graph is processed
            graphData: {},
            responseTypes: {
                'CLICK-BOXES': [],
                'MEDS-POP': [],
                TIME: ['', ''],
                'LIST-TEXT': [{ name: '' }],
            }, // can we improve upon this
            parentToChildNodes: {},
            nodeToComponent: {},
        };
    }

    componentDidMount() {
        let data = axios.get(
            'https://cydocgraph.herokuapp.com/graph/subgraph/' +
                this.props.parentNode
        );
        data.then((graphData) => {
            this.setState({ graphData: graphData.data });
            this.processKnowledgeGraph();
        });
    }

    // processes knowledge graph to determine order of questions in HPI based on questionOrder attribute of nodes
    processKnowledgeGraph() {
        // TODO: does this also need a set to keep track of nodes like for traversal()
        const { parentNode, category } = this.props;
        const { graphData, responseTypes } = this.state;
        const graph = graphData.graph;
        const nodes = graphData.nodes;
        const edges = graphData.edges;
        let values = this.context.hpi;
        let parentToChildNodes = {};
        let nodeToComponent = {};
        let queue = [parentNode];
        while (queue.length) {
            let currNode = queue.shift();
            if (currNode in graph) {
                let currEdges = graph[currNode];
                let questionOrderList = currEdges.map((edge) => {
                    // list of tuples (to node, toQuestionOrder)
                    let to = edges[edge].to;
                    let toQuestionOrder = edges[edge].toQuestionOrder;
                    return [
                        to,
                        toQuestionOrder !== -1
                            ? toQuestionOrder
                            : edge + currEdges.length,
                    ];
                });
                questionOrderList = questionOrderList.sort(
                    (tup1, tup2) => tup1[1] - tup2[1]
                ); // sort by questionOrder
                let childNodes = questionOrderList.map((tup) => tup[0]); // child nodes in order
                parentToChildNodes[currNode] = childNodes;
                queue = queue.concat(childNodes);
                if (!(currNode in values)) {
                    // use saved response if available
                    values[currNode] = nodes[currNode];
                    let responseType = values[currNode].responseType;
                    values[currNode].response =
                        responseType in responseTypes
                            ? responseTypes[responseType]
                            : '';
                }
                nodeToComponent[currNode] = (
                    <DiseaseFormQuestions
                        key={nodes[currNode].uid}
                        node={currNode}
                        category={category}
                    />
                );
            }
        }
        this.context.onContextChange('hpi', values);
        this.setState({
            nodeToComponent: nodeToComponent,
            parentToChildNodes: parentToChildNodes,
            isGraphProcessed: true,
        });
    }

    // iterates through question components in order of their questionOrder to be displayed on the HPI interview page
    traversal() {
        const { parentToChildNodes, nodeToComponent } = this.state;
        let values = this.context.hpi;
        let questionArr = [];
        let stack = parentToChildNodes[this.props.parentNode].slice().reverse(); // add child nodes in reverse
        while (stack.length) {
            let currNode = stack.pop();
            if (!currNode) continue;
            if (values[currNode].text != 'nan')
                questionArr.push(nodeToComponent[currNode]);
            let childEdges =
                values[currNode].response == 'Yes' ||
                values[currNode].text == 'nan'
                    ? parentToChildNodes[currNode]
                    : [];
            stack.concat(childEdges);
        }
        return questionArr;
    }

    render() {
        const { diseaseTabs, windowWidth, category } = this.props;
        const collapseTabs =
            diseaseTabs.length >= 10 ||
            (diseaseTabs.length >= 5 && windowWidth < DISEASE_TABS_MED_BP) ||
            windowWidth < DISEASE_TABS_SMALL_BP;
        let questionArr = [];
        if (this.state.isGraphProcessed) {
            questionArr = this.traversal();
        }

        return (
            <div>
                {collapseTabs ? (
                    <Dropdown
                        text={category}
                        options={diseaseTabs}
                        selection
                        fluid
                        scrolling={false}
                        id='disease-menu'
                    />
                ) : (
                    <Menu pointing items={diseaseTabs} id='disease-menu' />
                )}
                <div className='ui segment'>
                    <div className='question-map'>{questionArr} </div>
                </div>
            </div>
        );
    }
}

export default DiseaseForm;
