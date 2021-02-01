import React, { Component } from 'react';
import HPITemplateContext from '../../../contexts/HPITemplateContext';
import diseaseCodes from 'constants/diseaseCodes';
import {
    sortEdges,
    getAnswerInfo,
    createNodeId,
    parseQuestionText,
    parsePlaceholder,
} from '../util';
import { Button, Modal, List, Checkbox } from 'semantic-ui-react';
class ImportQuestionForm extends Component {
    static contextType = HPITemplateContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            graph: [],
            checked: new Set(),
            error: false,
        };
    }

    /**
     * Preprocess the question nodes (sort, process text, format options)
     */
    componentDidMount() {
        const { otherGraph, graphData } = this.props;
        const { graph, edges, nodes } = graphData;

        const id = diseaseCodes[otherGraph] + '0001';
        if (id in graph) {
            sortEdges(graph[id], edges, nodes);
            const editedGraph = graph[id].map((edge) => {
                const nodeId = edges[edge].from;
                const responseType = nodes[nodeId].responseType;
                let text = nodes[nodeId].text;
                let answerInfo = getAnswerInfo(responseType);

                text = parsePlaceholder(text, otherGraph);
                text = parseQuestionText(
                    responseType,
                    text,
                    answerInfo,
                    nodes[nodeId].category
                );

                return {
                    id: nodeId,
                    text,
                    responseType,
                    answerInfo,
                    hasChildren: graph[nodeId].length > 0,
                };
            });
            this.setState({ graph: editedGraph });
        }
    }

    /**
     * Toggles checked state of question with id=nodeId
     */
    toggleCheck = (e, { nodeid }) => {
        const { checked } = this.state;
        if (checked.has(nodeid)) {
            checked.delete(nodeid);
        } else {
            checked.add(nodeid);
        }

        this.setState({ checked });
    };

    /**
     * Adds all of the selected questions to the context as a direct child of the parent
     */
    importQuestions = () => {
        let { numQuestions, nextEdgeId } = this.context.template;
        const { graph, nodes, edges, disease } = this.context.template;
        const { parent } = this.props;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        let childId;
        this.state.graph
            .filter((question) => this.state.checked.has(question.id))
            .forEach((question) => {
                childId = createNodeId(diseaseCode, numQuestions);
                nodes[childId] = {
                    id: childId,
                    text: question.text,
                    answerInfo: question.answerInfo,
                    responseType: question.responseType,
                    hasChildren: question.hasChildren,
                    originalId: question.id,
                    order: numQuestions,
                    hasChanged: false,
                };
                edges[nextEdgeId] = {
                    from: parent,
                    to: childId,
                };
                graph[childId] = [];
                graph[parent].push(nextEdgeId);
                nextEdgeId++;
                numQuestions++;
            });
        this.context.updateTemplate({
            nodes,
            edges,
            graph,
            nextEdgeId,
            numQuestions,
        });
        this.props.closeModal();
    };

    /**
     * Return a list of children of the selected graph to import
     */
    getQuestions = () => {
        return this.state.graph.map((question, i) => {
            let text = question.text;
            if (
                question.responseType === 'CLICK-BOXES' ||
                question.responseType === 'nan' ||
                question.responseType.endsWith('POP')
            ) {
                text = text + question.answerInfo.options.join(', ');
            }
            return (
                <List.Item key={i} className='connect-graph-option'>
                    <Checkbox
                        label={text}
                        nodeid={question.id}
                        onChange={this.toggleCheck}
                        checked={this.state.checked.has(question.id)}
                    />
                </List.Item>
            );
        });
    };

    render() {
        return (
            <Modal size='tiny' open={true} onClose={this.props.closeModal}>
                <Modal.Header>Select questions to import</Modal.Header>
                <Modal.Content>
                    <div className='options-container'>
                        <List divided relaxed>
                            {this.getQuestions()}
                        </List>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.closeModal}>Cancel</Button>
                    <Button color='violet' onClick={this.importQuestions}>
                        Import questions
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ImportQuestionForm;
