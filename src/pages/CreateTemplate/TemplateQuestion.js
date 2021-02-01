import React, { Component } from 'react';
import {
    Input,
    Icon,
    Dropdown,
    Accordion,
    Button,
    Message,
} from 'semantic-ui-react';
import HPITemplateContext from '../../contexts/HPITemplateContext';
import TemplateAnswer from './TemplateAnswer';
import { questionTypeMapping, questionTypes } from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import {
    getAnswerInfo,
    sortEdges,
    addChildrenNodes,
    updateParent,
} from './util';
import { QUESTION_PLACEHOLDER } from './placeholders';
import './TemplateForm.css';

let DELETED_IDS = [];

class TemplateQuestion extends Component {
    static contextType = HPITemplateContext;

    constructor(props, context) {
        super(props, context);

        this.state = {
            showDeleteQuestion: false,
            showChangeQuestion: false,
            active: false,
        };
        this.changeActive = this.changeActive.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveQuestionType = this.saveQuestionType.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.deleteQuestionWithChildren = this.deleteQuestionWithChildren.bind(
            this
        );
        this.deleteUnrenderedChildren = this.deleteUnrenderedChildren.bind(
            this
        );
        this.keepUnrenderedChildren = this.keepUnrenderedChildren.bind(this);
        this.hideDeleteQuestion = this.hideDeleteQuestion.bind(this);
        this.editChildren = this.editChildren.bind(this);
        this.getQuestionTypes = this.getQuestionTypes.bind(this);
    }

    /**
     * Toggles the accordion from collapsed -> expanded and vice versa
     */
    changeActive = () => {
        this.setState((prevState) => ({
            active: !prevState.active,
        }));
    };

    componentDidUpdate(prevProps) {
        const { qId, invalidUpdates } = this.props;
        if (!prevProps.invalidUpdates.has(qId) && invalidUpdates.has(qId)) {
            this.setState({ active: true });
        }
    }

    /**
     * Updates the question text of the node with the given `qid`.
     * @param {String} value: new question text
     * @param {String} qid: id of the question being changed
     */
    saveQuestion = (event, { value, qid }) => {
        const { nodes } = this.context.template;
        nodes[qid].text = value;
        if (!nodes[qid].hasChanged) {
            updateParent(nodes, qid);
            this.setState({ active: true });
        }
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Updates the response type of the question with given id.
     * @param {String} value: new response type
     * @param {String} qid: id of the question being changed
     */
    saveQuestionType = (event, { value, qid }) => {
        const { graph, nodes } = this.context.template;

        // questions with children questions can NOT be converted to something other than yes/no
        if (value !== questionTypes.YES_NO && graph[qid].length > 0) {
            this.setState({ showChangeQuestion: true });
            return;
        }

        nodes[qid].responseType = value;
        nodes[qid].answerInfo = getAnswerInfo(value);

        // advanced response types default to BLANK
        if (
            value === questionTypes.FH ||
            value === questionTypes.PMH ||
            value === questionTypes.PSH ||
            value === questionTypes.MEDS
        ) {
            nodes[qid].responseType = value + '-BLANK';
        }
        updateParent(nodes, qid);
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Removes question of given id from the context if it has no children. Otherwise, update the state
     * to trigger a message
     * @param {String} qid: id of question being deleted
     */
    deleteQuestion = (event, { qid }) => {
        const { nodes, graph, edges } = this.context.template;
        let { numQuestions } = this.context.template;

        if (
            (nodes[qid].responseType !== questionTypes.YES_NO &&
                nodes[qid].responseType !== questionTypes.NO_YES) ||
            graph[qid].length === 0
        ) {
            // not Y/N question or Y/N question with no children
            for (let edge in edges) {
                const eInfo = edges[edge];
                if (eInfo.to === qid) {
                    graph[eInfo.from] = graph[eInfo.from].filter(
                        (e) => e !== parseInt(edge)
                    );
                    delete edges[edge];
                }
            }
            updateParent(nodes, qid);
            delete graph[qid];
            delete nodes[qid];
            numQuestions--;
        } else {
            // Y/N question with children
            this.setState({ showDeleteQuestion: true, active: true });
        }

        this.context.updateTemplate({
            nodes,
            graph,
            edges,
            numQuestions,
        });
    };

    /**
     * Deletes the target question and all of the children in its subtree if the user decides on `Delete`.
     * Otherwise, deletes the target question and reattaches its children with the target's parent node.
     * @param {String} content: the decision on whether to keep or delete the children
     * @param {String} qid: id of the question being deleted
     */
    deleteQuestionWithChildren = (event, { content, qid }) => {
        const { nodes, graph, edges } = this.context.template;
        let { nextEdgeID, numQuestions } = this.context.template;

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
                            edges[nextEdgeID] = {
                                from: parent,
                                to: edges[edge].to,
                            };
                            graph[parent].splice(
                                parentRelatedIndexes[i],
                                0,
                                nextEdgeID
                            );
                            nextEdgeID++;
                        }
                        delete edges[edge];
                    }
                }

                delete graph[qid];
                delete nodes[qid];
                numQuestions--;
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
                            const index = graph[question].indexOf(
                                parseInt(edge)
                            );
                            if (index > -1) {
                                graph[question].splice(index, 1);
                            }
                        }
                        delete graph[edges[edge].from];
                        delete nodes[edges[edge].from];
                        delete edges[edge];
                        numQuestions--;
                    } else if (DELETED_IDS.includes(edges[edge].to)) {
                        for (let question in graph) {
                            const index = graph[question].indexOf(
                                parseInt(edge)
                            );
                            if (index > -1) {
                                graph[question].splice(index, 1);
                            }
                        }
                        delete graph[edges[edge].to];
                        delete nodes[edges[edge].to];
                        delete edges[edge];
                        numQuestions--;
                    }
                }
                DELETED_IDS = [];
                break;
            }
            default: {
                break;
            }
        }

        this.context.updateContext({
            nodes,
            graph,
            edges,
            nextEdgeID,
            numQuestions,
        });
    };

    /**
     * Deletes all children in the target subtree from the graph object and nodes object,
     * and accumulates the qids in a `DELETED_IDS` array
     * @param {String} qid: id of the root of the subtree to delete
     */
    deleteChildren(qid) {
        const { edges, graph } = this.context.template;

        while (graph[qid].length > 0) {
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
        const { nodes } = this.context.template;

        while (graph[qid].length > 0) {
            const e = graph[qid].shift();
            DELETED_IDS.push(qid);
            this.deleteChild(edges[e].to, edges, graph);
        }

        delete graph[qid];
        delete nodes[qid];

        this.context.updateTemplate({ nodes, graph, edges });
    }

    /**
     * Remove the flag that indicates an imported question has children and import the
     * direct children of the target question
     */
    keepUnrenderedChildren = () => {
        const { nodes } = this.context.template;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.editChildren(qId, nodes);
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Remove the flag that indicates an imported question has children
     */
    deleteUnrenderedChildren = () => {
        const { nodes } = this.context.template;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Import all direct children of node with qId from the knowledge graph
     * (The graph fetched from the backend, not the context).
     * @param {String} qId: the parent of the questions to import
     * @param {Object} contextNodes: the nodes object (not necessarily in sync with the context)
     */
    editChildren = (qId, contextNodes) => {
        let { numQuestions, nextEdgeID } = this.context.template;
        const { graphData } = this.props;
        const { edges, nodes, graph } = graphData;

        const disease = this.context.template.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        const contextEdges = { ...this.context.template.edges };
        const contextGraph = { ...this.context.template.graph };

        const originalId = contextNodes[qId].originalId;
        if (originalId in graph) {
            sortEdges(graph[originalId], edges, nodes);
            // create edges and nodes for every new question
            let newCount = addChildrenNodes(
                qId,
                graph[originalId],
                '',
                diseaseCode,
                graphData,
                {
                    numQuestions,
                    nextEdgeID,
                    contextNodes,
                    contextGraph,
                    contextEdges,
                }
            );
            numQuestions = newCount.numQuestions;
            nextEdgeID = newCount.nextEdgeID;

            this.context.updateTemplate({
                edges,
                graph,
                nextEdgeID,
                numQuestions,
            });
        }
        delete contextNodes[qId].hasChildren;
        this.context.onTemplateChange('nodes', contextNodes);
    };

    hideDeleteQuestion = () => {
        this.setState({ showDeleteQuestion: false });
    };

    /**
     * Returns the Dropdown component for selecting a response type
     */
    getQuestionTypes() {
        const { qId } = this.props;

        const options = Object.values(questionTypes)
            .filter((qType) => qType !== questionTypes.NO_YES)
            .map((qType) => {
                const text =
                    questionTypeMapping.basic?.[qType] ||
                    questionTypeMapping.advanced?.[qType] + ' (sync)';
                return {
                    text,
                    key: qType,
                    value: qType,
                };
            });

        // Process the current response type since the value will not necessarily
        // match the option in the dropdown (i.e. NO-YES questions should be displayed
        // as YES-NO and advanced types should be stripped of POP and BLANK)
        let responseType = this.context.template.nodes[qId].responseType;
        if (responseType === questionTypes.NO_YES) {
            responseType = questionTypes.YES_NO;
        } else if (
            responseType.endsWith('POP') ||
            responseType.endsWith('BLANK')
        ) {
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

    /**
     * Returns the number of followup questions associates with the target qid in the
     * knowledge graph from the backend (not the context).
     * @param {String} qId: id of the question
     */
    getNumberFollowup = (qId) => {
        const { nodes } = this.context.template;
        const { graph } = this.props.graphData;

        const originalId = nodes[qId].originalId;
        return graph[originalId].length;
    };

    hideChangeQuestion = (_e, { qid }) => {
        this.setState({ showChangeQuestion: false });
        this.props.removeInvalidUpdate(qid);
    };

    render() {
        const { qId, invalidUpdates } = this.props;
        const { nodes } = this.context.template;
        const { showChangeQuestion, showDeleteQuestion, active } = this.state;

        // Due to JS's asynchronous nature, render a Fragment in case the current node was
        // deleted in a previous action
        if (!(qId in nodes)) {
            return <></>;
        }

        const questionTypeOptions = this.getQuestionTypes();
        const curIcon = active ? 'chevron down' : 'chevron right';
        const node = nodes[qId];

        const deleteWarning = showDeleteQuestion && (
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
        );

        const followupQuestionsWarning = nodes[qId].hasChildren &&
            nodes[qId].hasChanged && (
                <Message
                    compact
                    content={
                        <>
                            <div>
                                The original question had{' '}
                                {this.getNumberFollowup(qId)}
                                follow-up question(s). Do you want to keep these
                                follow-up questions?
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
                        </>
                    }
                />
            );

        const invalidTypeWarning = (showChangeQuestion ||
            invalidUpdates.has(qId)) && (
            <Message
                negative
                qid={qId}
                header='Only Yes/No questions can have follow-up questions.'
                onDismiss={this.hideChangeQuestion}
                content='Alternatively, you may
                    delete this question and create a new question of the desired type,
                    or move the follow-up questions to a different level before proceeding.'
            />
        );

        const panels = [
            {
                key: qId,
                title: {
                    icon: '',
                    content: (
                        <>
                            <div
                                className='question-title'
                                onClick={this.changeActive}
                            >
                                <Icon name={curIcon} />
                                <Input
                                    qid={qId}
                                    placeholder={
                                        QUESTION_PLACEHOLDER[
                                            node.responseType
                                        ] || 'Question'
                                    }
                                    value={node.text}
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
                        </>
                    ),
                },
                content: {
                    active,
                    content: (
                        <div className='question-content'>
                            {deleteWarning}
                            {followupQuestionsWarning}
                            {invalidTypeWarning}
                            {questionTypeOptions}
                            <TemplateAnswer
                                qId={qId}
                                type={node.responseType}
                                editChildren={this.editChildren}
                                graphData={this.props.graphData}
                                allDiseases={this.props.allDiseases}
                            />
                        </div>
                    ),
                },
            },
        ];

        return (
            <Accordion
                fluid
                key={qId}
                panels={panels}
                className='question-container'
            />
        );
    }
}

export default TemplateQuestion;
