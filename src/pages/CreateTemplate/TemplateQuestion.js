import React, { Component, Fragment } from 'react';
import { Input, Icon, Dropdown, Accordion, Button, Message } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import TemplateAnswer from './TemplateAnswer';
import questionTypes from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import { getAnswerInfo, sortEdges, addChildrenNodes, updateParent } from './util';
import './NewTemplate.css';

let DELETED_IDS = [];

class TemplateQuestion extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);

        // Default to showing advanced options if node itself uses one
        const {nodes} = this.context.state;
        const responseType = nodes[this.props.qId].responseType;
        const selectedMore = responseType !== '' && !(responseType in questionTypes.basic);
        
        this.state = {
            selectedMore,
            showDeleteQuestion: false,
            showChangeQuestion: false,
            active: false,
        };
        this.changeActive = this.changeActive.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveQuestionType = this.saveQuestionType.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.deleteQuestionWithChildren = this.deleteQuestionWithChildren.bind(this);
        this.deleteUnrenderedChildren = this.deleteUnrenderedChildren.bind(this);
        this.keepUnrenderedChildren = this.keepUnrenderedChildren.bind(this);
        this.hideDeleteQuestion = this.hideDeleteQuestion.bind(this);
        this.editChildren = this.editChildren.bind(this);
        this.getQuestionTypes = this.getQuestionTypes.bind(this);
        this.getAdvancedDropdown = this.getAdvancedDropdown.bind(this);
        this.removeAdvancedDropdown = this.removeAdvancedDropdown.bind(this);
    }

    /**
     * Toggles the accordion from collapsed -> expanded and vice versa
     */
    changeActive = () => {
        this.setState((prevState) => ({
            active: !(prevState.active)
        }));
    }

    /**
     * Updates the question text of the node with the given `qid`.
     * @param {String} value: new question text
     * @param {String} qid: id of the question being changed
     */
    saveQuestion = (event, { value, qid }) => {
        const { nodes } = this.context.state;
        nodes[qid].text = value;
        if (!nodes[qid].hasChanged) {
            updateParent(nodes, qid);
            this.setState({ active: true });
        }
        this.context.onContextChange('nodes', nodes);
    }

    /**
     * Updates the response type of the question with given id.
     * @param {String} value: new response type
     * @param {String} qid: id of the question being changed
     */
    saveQuestionType = (event, { value, qid }) => {
        const { graph, nodes } = this.context.state;
        
        // questions with children questions can NOT be converted to something other than yes/no
        if (value !== 'YES-NO' && graph[qid].length > 0) {
            this.setState({ showChangeQuestion: true });
            return;
        }

        nodes[qid].responseType = value;
        nodes[qid].answerInfo = getAnswerInfo(value);
        
        // advanced response types default to BLANK
        if (value === 'FH'
            || value === 'PMH'
            || value === 'PSH'
            || value === 'MEDS'
        ) {
            nodes[qid].responseType = value + '-BLANK';
        }
        updateParent(nodes, qid);
        this.context.onContextChange('nodes', nodes);
    }

    /**
     * Removes question of given id from the context if it has no children. Otherwise, update the state
     * to trigger a message
     * @param {String} qid: id of question being deleted
     */
    deleteQuestion = (event, { qid }) => {
        const nodes = this.context.state.nodes;
        const graph = this.context.state.graph;
        const edges = this.context.state.edges;

        if ((nodes[qid].responseType !== 'YES-NO' && nodes[qid].responseType !== 'NO-YES') || graph[qid].length === 0) {
            // not Y/N question or Y/N question with no children
            for (let edge in edges) {
                const eInfo = edges[edge];
                if (eInfo.to === qid) {                   
                    graph[eInfo.from] = graph[eInfo.from].filter(e => e !== parseInt(edge));
                    delete this.context.state.edges[edge];
                }
            }
            updateParent(nodes, qid);
            delete graph[qid];
            delete nodes[qid];
        } else {
            // Y/N question with children
            this.setState({ showDeleteQuestion: true, active: true });
        }

        this.context.onContextChange('nodes', nodes);
        this.context.onContextChange('graph', graph);
        this.context.onContextChange('edges', this.context.state.edges);
    }

    /**
     * Deletes the target question and all of the children in its subtree if the user decides on `Delete`.
     * Otherwise, deletes the target question and reattaches its children with the target's parent node.
     * @param {String} content: the decision on whether to keep or delete the children
     * @param {String} qid: id of the question being deleted
     */
    deleteQuestionWithChildren = (event, { content, qid }) => {
        const nodes = this.context.state.nodes;
        const graph = this.context.state.graph;
        const edges = this.context.state.edges;
        let numEdges = this.context.state.numEdges;

        updateParent(nodes, qid);
        switch (content) {
            case 'Keep': {
                this.hideDeleteQuestion();
                const parents = [];
                const parentRelatedIndexes = [];
                // Find the index of the edge connecting to the target question
                for (let edge in edges) {
                    if (edges[edge].to === qid) {
                        const parent = edges[edge].from;
                        const index = graph[parent].indexOf(parseInt(edge));

                        parents.push(parent);
                        parentRelatedIndexes.push(index);
                        graph[parent].splice(index, 1);
                        delete edges[edge];
                    }
                }
                // Create a new edge for every direct child of the deleted question
                // connecting to the deleted question's parent
                for (let edge in edges) {
                    if (edges[edge].from === qid) {
                        for (let i = 0; i < parents.length; i++) {
                            const parent = parents[i];
                            edges[numEdges] = {
                                from: parent,
                                to: edges[edge].to
                            }
                            graph[parent].splice(parentRelatedIndexes[i], 0, numEdges);
                            numEdges++;
                        }
                        delete edges[edge];
                    }
                }

                delete graph[qid];
                delete nodes[qid];
                break;
            }
            case 'Delete': {
                // Delete children from the nodes and graph object
                this.hideDeleteQuestion();
                this.deleteChildren(qid);

                // Delete all edges incident to a node in the DELETED_IDS array
                for (let edge in edges) {
                    if (DELETED_IDS.includes(edges[edge].from)) {
                        for (let question in graph) {
                            const index = graph[question].indexOf(parseInt(edge));
                            if (index > -1) {
                                graph[question].splice(index, 1);
                            }
                        }
                        delete graph[edges[edge].from];
                        delete nodes[edges[edge].from];
                        delete edges[edge];
                    } else if (DELETED_IDS.includes(edges[edge].to)) {
                        for (let question in graph) {
                            const index = graph[question].indexOf(parseInt(edge));
                            if (index > -1) {
                                graph[question].splice(index, 1);
                            }
                        }
                        delete graph[edges[edge].to];
                        delete nodes[edges[edge].to];
                        delete edges[edge];
                    }
                }
                DELETED_IDS = [];
                break;
            }
            default: {
                break;
            }
        }
        
        this.context.onContextChange('nodes', nodes);
        this.context.onContextChange('graph', graph);
        this.context.onContextChange('edges', edges);
        this.context.onContextChange('numEdges', numEdges);
    }

    /**
     * Deletes all children in the target subtree from the graph object and nodes object,
     * and accumulates the qids in a `DELETED_IDS` array
     * @param {String} qid: id of the root of the subtree to delete
     */
    deleteChildren(qid) {
        const edges = this.context.state.edges;
        const graph = this.context.state.graph;

        while(graph[qid].length > 0) {
            const e = graph[qid].shift();
            DELETED_IDS.push(qid);
            this.deleteChild(edges[e].to, edges, graph);
        }
    }

    /**
     * Helper function for all deleting chidren in the subtree associated with the given qid from
     * the nodes and graph object in the context. Accumulate these qids in a `DELETED_IDS` array
     * @param {String} qid: id of the root of the subtree to delete
     * @param {Object} edges: the edges object from the context
     * @param {Object} graph: the graph object from the context
     */
    deleteChild(qid, edges, graph) {
        const nodes = this.context.state.nodes;

        while (graph[qid].length > 0) {
            const e = graph[qid].shift();
            DELETED_IDS.push(qid);
            this.deleteChild(edges[e].to, edges, graph);
        }

        delete graph[qid];
        delete nodes[qid];

        this.context.onContextChange('nodes', nodes);
        this.context.onContextChange('graph', graph);
        this.context.onContextChange('edges', edges);
    }

    /**
     * Remove the flag that indicates an imported question has children and import the
     * direct children of the target question
     */
    keepUnrenderedChildren = () => {
        const { nodes } = this.context.state;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.editChildren(qId, nodes);
        this.context.onContextChange('nodes', nodes);
    }

    /**
     * Remove the flag that indicates an imported question has children
     */
    deleteUnrenderedChildren = () => {
        const { nodes } = this.context.state;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.context.onContextChange('nodes', nodes);
    }

    /**
     * Import all direct children of node with qId from the knowledge graph 
     * (The graph fetched from the backend, not the context).
     * @param {String} qId: the parent of the questions to import
     * @param {Object} contextNodes: the nodes object (not necessarily in sync with the context)
     */
    editChildren = (qId, contextNodes) => {
        let { numQuestions, numEdges } = this.context.state;
        const { graphData } = this.props;
        const { edges, nodes, graph } = graphData;
        
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        const contextEdges = { ...this.context.state.edges };
        const contextGraph = { ...this.context.state.graph };

        const originalId = contextNodes[qId].originalId;
        if (originalId in graph) {
            sortEdges(graph[originalId], edges, nodes);
            // create edges and nodes for every new question
            let newCount = addChildrenNodes(
                qId,
                graph[originalId],
                "",
                diseaseCode,
                graphData,
                { numQuestions, numEdges, contextNodes, contextGraph, contextEdges },
            );
            numQuestions = newCount.numQuestions;
            numEdges = newCount.numEdges;

            this.context.onContextChange('edges', contextEdges);
            this.context.onContextChange('graph', contextGraph);
            this.context.onContextChange('numEdges', numEdges);
            this.context.onContextChange('numQuestions', numQuestions);
        }
        delete contextNodes[qId].hasChildren;
        this.context.onContextChange('nodes', contextNodes);
    }

    hideDeleteQuestion = () => {
        this.setState({ showDeleteQuestion: false });
    }

    /**
     * Returns the Dropdown component for selecting a response type
     */
    getQuestionTypes() {
        const { qId } = this.props;

        let options = [];

        for (let qType in questionTypes.basic) {
            options.push({
                key: questionTypes.basic[qType],
                text: questionTypes.basic[qType],
                value: qType,
            });
        }

        for (let qType in questionTypes.advanced) {
            options.push({
                key: questionTypes.advanced[qType],
                text: questionTypes.advanced[qType],
                value: qType,
            });
        }

        // Process the current response type since the value will not necessarily
        // match the option in the dropdown (i.e. NO-YES questions should be displayed
        // as YES-NO and advanced types should be stripped of POP and BLANK)
        let responseType = this.context.state.nodes[qId].responseType;
        if (responseType === 'NO-YES') {
            responseType = 'YES-NO';
        } else if (responseType.endsWith('POP') || responseType.endsWith('BLANK')) {
            responseType = responseType.split('-')[0];
        }

        return (
            <Dropdown
                search
                selection
                placeholder='Question Type'
                qid={qId}
                direction='left'
                options={options}
                value={responseType}
                onChange={this.saveQuestionType}
            />
        );
    }

    getAdvancedDropdown() {
        this.setState({
            selectedMore: true,
        });
    }

    removeAdvancedDropdown() {
        this.setState({
            selectedMore: false,
        });
    }

    /**
     * Returns the number of followup questions associates with the target qid in the 
     * knowledge graph from the backend (not the context).
     * @param {String} qId: id of the question 
     */ 
    getNumberFollowup = (qId) => {
        const { nodes } = this.context.state;
        const { graph } = this.props.graphData;
        
        const originalId = nodes[qId].originalId;
        return graph[originalId].length;
    }

    render() {
        const { qId } = this.props;
        const { nodes } = this.context.state;
        const { showChangeQuestion, showDeleteQuestion, active } = this.state;

        // Due to JS's asynchronous nature, render a Fragment in case the current node was
        // deleted in a previous action
        if (!(qId in nodes)) {
            return <Fragment></Fragment>
        }

        const questionTypeOptions = this.getQuestionTypes();
        const curIcon = active ? 'chevron down' : 'chevron right';

        const panels = [{
            key: qId,
            title: {
                icon: '',
                content: (
                    <Fragment>
                        <div
                            className='question-title'
                            onClick={this.changeActive}
                        >
                            <Icon name={curIcon} />
                            <Input
                                qid={qId}
                                placeholder='Question'
                                value={this.context.state.nodes[qId].text}
                                onChange={this.saveQuestion}
                                transparent
                                size='large'
                                className='question-input'
                            />
                        </div>
                        <Button
                            basic
                            icon='remove'
                            qid={qId}
                            onClick={this.deleteQuestion}
                            className='minus-button remove-question'
                        />
                    </Fragment>
                ),
            },
            content: {
                active: active,
                content: (
                    <div className='question-content'>
                        {showDeleteQuestion &&
                            <Fragment>
                                <Message
                                    compact
                                    onDismiss={this.hideDeleteQuestion}
                                    content={
                                        <div className='delete-message'>
                                            <div>
                                                Do you want to keep or delete follow-up questions?
                                            </div>
                                            <div>
                                                <Button
                                                    compact
                                                    qid={qId}
                                                    content='Keep'
                                                    onClick={this.deleteQuestionWithChildren}
                                                    className='keep-button'
                                                />
                                                <Button
                                                    compact
                                                    qid={qId}
                                                    content='Delete'
                                                    onClick={this.deleteQuestionWithChildren}
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                                <br />
                            </Fragment>
                        } 
                        {nodes[qId].hasChildren && nodes[qId].hasChanged &&
                            <Fragment>
                                <Message
                                    compact
                                    content={
                                        <Fragment>
                                            <div>
                                            {`The original question had ${this.getNumberFollowup(qId)} follow-up question(s). Do you want to keep these follow-up questions?`}
                                            </div>
                                            <div>
                                                <Button
                                                    compact
                                                    qid={qId}
                                                    content='Keep'
                                                    onClick={this.keepUnrenderedChildren}
                                                    className='keep-button'
                                                />
                                                <Button
                                                    compact
                                                    qid={qId}
                                                    content='Delete'
                                                    onClick={this.deleteUnrenderedChildren}
                                                />
                                            </div>
                                        </Fragment>
                                    }
                                />
                                <br />
                            </Fragment>
                        } 
                        {showChangeQuestion &&
                            <Fragment>
                            <Message
                                compact
                                negative
                                header="Only Yes/No and No/Yes questions can have follow-up questions."
                                onDismiss={() => this.setState({ showChangeQuestion: false })}
                                content="Alternatively, you may
                                        delete this question and create a new question of the desired type,
                                        or move the follow-up questions to a different level before proceeding."
                            />
                            <br />
                        </Fragment>
                        }
                        {questionTypeOptions}
                        <TemplateAnswer 
                            qId={qId} 
                            type={this.context.state.nodes[qId].responseType} 
                            editChildren={this.editChildren}
                            graphData={this.props.graphData}
                            allDiseases={this.props.allDiseases}
                        />
                    </div>
                ),
            }
        }];

        return (
            <Fragment>
                <Accordion
                    fluid
                    key={qId}
                    panels={panels}
                    className='question-container'
                />
            </Fragment>
        );
    }
}

export default TemplateQuestion;