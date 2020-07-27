import React, { Component, createRef } from 'react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import diseaseCodes from 'constants/diseaseCodes';
import { sortEdges, getAnswerInfo, createNodeId } from './util';
import { 
    Button, 
    Segment,
    Modal,
    List,
    Checkbox,
} from 'semantic-ui-react';
class ImportQuestionForm extends Component {
    static contextType = CreateTemplateContext;
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
            // TODO: Account for "nan"s?
            const editedGraph = graph[id]
                .filter(edge => nodes[edges[edge].from].text !== 'nan')
                .map((edge, i) => {
                    const nodeId = edges[edge].from;
                    const responseType = nodes[nodeId].responseType;
                    let text = nodes[nodeId].text;
                    let answerInfo = getAnswerInfo(responseType);
                    let placeholder = text.search(/SYMPTOM|DISEASE/);
                    if (placeholder > -1) {
                        text = text.substring(0, placeholder) + otherGraph.toLowerCase() + text.substring(placeholder +7)
                    } 
                    if (
                        responseType === 'CLICK-BOXES' 
                        || responseType.endsWith('POP')
                        || responseType === 'nan'
                    ) {
                        let click = text.search('CLICK');
                        let selectStart = text.search('\\[');
                        let selectEnd = text.search('\\]');
                        let choices;
                        if (click > -1) { // options are indicated by CLICK[...]
                            choices = text.slice(click + 6, selectEnd);
                            text = text.slice(0, click);
                        } else { // options are indicated by [...]
                            if (selectStart > 0) {
                                choices = text.slice(selectStart + 1, selectEnd);
                                text = text.slice(0, selectStart);
                            }
                        }
                        choices = choices.split(",").map(response => response.trim());
                        answerInfo.options = choices;
                    }
                    return {
                        id: nodeId,
                        text,
                        responseType,
                        answerInfo,
                    }
                });
            this.setState({ graph: editedGraph });
            }
    }

    /**
     * Toggles checked state of question with id=nodeId
     */
    toggleCheck = (e, { nodeId }) => {
        const { checked } = this.state;
        if (checked.has(nodeId)) {
            checked.delete(nodeId);
        } else {
            checked.add(nodeId);
        }

        this.setState({ checked });
    }

    importQuestions = () => {
        let { numQuestions, numEdges } = this.context.state;
        const { graph, nodes, edges } = this.context.state;
        const { parent } = this.props;
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        
        let childId;
        this.state.graph
            .filter(question => this.state.checked.has(question.id))
            .forEach(question => {
                childId = createNodeId(diseaseCode, numQuestions);
                nodes[childId] = {
                    id: childId,
                    text: question.text,
                    answerInfo: question.answerInfo,
                    responseType: question.responseType,
                    order: numQuestions,
                }
                edges[numEdges] = {
                    from: parent,
                    to: childId,
                }
                graph[childId] = [];
                graph[parent].push(numEdges);
                numEdges++;
                numQuestions++;
            });
        this.context.onContextChange('nodes', nodes);
        this.context.onContextChange('edges', edges);
        this.context.onContextChange('graph', graph);
        this.context.onContextChange('numEdges', numEdges);
        this.context.onContextChange('numQuestions', numQuestions);
        this.props.closeModal();
    }

    /**
     * Return a list of children of the selected graph to import
     */
    getQuestions = () => {
        return this.state.graph.map((question, i) => {
            let text = question.text;
            if (
                question.responseType === 'CLICK-BOXES' 
                || question.responseType === 'nan'
                || question.responseType.endsWith('POP') 
            ) {
                text = text + question.answerInfo.options.join(', ');
            }
            return (
                <List.Item 
                    key={i}
                    className='connect-graph-option'
                >
                    <Checkbox
                        label={text}
                        nodeId={question.id}
                        onChange={this.toggleCheck}
                        checked={this.state.checked.has(question.id)}
                    />
                </List.Item>
            )
        })
    }

    render() {
        return (
            <Modal
                size='tiny'
                open={true}
                onClose={this.props.closeModal}
            >
                <Modal.Header>Select questions to import</Modal.Header>
                <Modal.Content>
                    <div className='options-container'>
                        <List divided relaxed>
                            {this.getQuestions()}
                        </List>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.props.closeModal}
                    >
                        Cancel
                    </Button>
                    <Button 
                        icon='plus' 
                        color='violet'
                        onClick={this.importQuestions}
                    >
                        Import questions
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ImportQuestionForm;