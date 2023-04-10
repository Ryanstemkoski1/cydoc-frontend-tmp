import React, { Component } from 'react';
import HPITemplateContext from '../../../contexts/HPITemplateContext';
import diseaseCodes from 'constants/diseaseCodes';
import {
    sortEdges,
    getAnswerInfo,
    createNodeId,
    parseQuestionText,
    parsePlaceholder,
    setAnswerInfo,
} from '../util';
import { Button, Modal, List, Checkbox, Loader } from 'semantic-ui-react';
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

    /* Fetch and process children nodes of the selected root */
    componentDidMount = async () => {
        const { otherGraph, fetchCydocGraph } = this.props;
        const medID = await fetchCydocGraph(otherGraph);
        const { graph, edges, nodes } = this.context.template.cydocGraphs;

        sortEdges(graph[medID], edges);
        const editedGraph = graph[medID].map((edge) => {
            const nodeId = edges[edge].to;

            let node = { ...nodes[nodeId] };
            delete node.doctorView;
            delete node.patientView;
            delete node.medID;

            const { responseType, category } = node;
            let { text } = node;
            let answerInfo = getAnswerInfo(responseType);
            text = parsePlaceholder(text, otherGraph);
            text = parseQuestionText(responseType, text, answerInfo, category);
            answerInfo = setAnswerInfo(answerInfo, node);

            return {
                ...node,
                text,
                answerInfo,
                id: nodeId,
                hasChildren: graph[nodeId].length > 0,
            };
        });
        this.setState({ graph: editedGraph });
    };

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
        let { numQuestions, nextEdgeID } = this.context.template;
        const { graph, nodes, edges, disease } = this.context.template;
        const { parent } = this.props;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        let childId;
        this.state.graph
            .filter((question) => this.state.checked.has(question.id))
            .forEach((question) => {
                childId = createNodeId(diseaseCode, numQuestions);
                nodes[childId] = {
                    ...question,
                    id: childId,
                    originalId: question.id,
                    hasChanged: false,
                };
                edges[nextEdgeID] = {
                    from: parent,
                    to: childId,
                };
                graph[childId] = [];
                graph[parent].push(nextEdgeID);
                nextEdgeID++;
                numQuestions++;
            });
        this.context.updateTemplate({
            nodes,
            edges,
            graph,
            nextEdgeID,
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
                question.responseType === 'SELECTONE' ||
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
                        {this.state.graph.length === 0 ? (
                            <Loader />
                        ) : (
                            <List divided relaxed>
                                {this.getQuestions()}
                            </List>
                        )}
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
