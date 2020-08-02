import React, { Component, Fragment } from 'react';
import { Input, Icon, Dropdown, Accordion, Button, Message } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import TemplateAnswer from './TemplateAnswer';
import questionTypes from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import { getAnswerInfo, sortEdges, addChildrenNodes, updateParent } from './util';
import './NewTemplate.css';
import { node } from 'prop-types';

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

    changeActive = () => {
        this.setState((prevState) => ({
            active: !(prevState.active)
        }));
    }

    saveQuestion = (event, { value, qid }) => {
        const { nodes } = this.context.state;
        nodes[qid].text = value;
        if (!nodes[qid].hasChanged) {
            updateParent(nodes, qid);
            this.setState({ active: true });
        }
        this.context.onContextChange('nodes', nodes);
    }

    saveQuestionType = (event, { value, qid }) => {
        const { graph, nodes } = this.context.state;
        
        // questions with children questions can NOT be converted
        // to something other than yes/no.  Raise a message instead.
        if (value !== 'YES-NO' && graph[qid].length > 0) {
            this.setState({ showChangeQuestion: true });
            return;
        }

        nodes[qid].responseType = value;
        nodes[qid].answerInfo = getAnswerInfo(value);
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

    deleteQuestion = (event, { qid }) => {
        const nodes = this.context.state.nodes;
        const graph = this.context.state.graph;
        const edges = this.context.state.edges;

        if ((nodes[qid].responseType !== 'YES-NO' && nodes[qid].responseType !== 'NO-YES') || graph[qid].length === 0) {
            // not Y/N question || Y/N question with no children
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
                this.hideDeleteQuestion();
                this.deleteChildren(qid);
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

    deleteChildren(qid) {
        const edges = this.context.state.edges;
        const graph = this.context.state.graph;

        while(graph[qid].length > 0) {
            const e = graph[qid].shift();
            DELETED_IDS.push(qid);
            this.deleteChild(edges[e].to, edges, graph);
        }
    }

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

    keepUnrenderedChildren = () => {
        const { nodes } = this.context.state;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.editChildren(qId, nodes);
        this.context.onContextChange('nodes', nodes);
    }

    deleteUnrenderedChildren = () => {
        const { nodes } = this.context.state;
        const { qId } = this.props;

        delete nodes[qId].hasChildren;
        this.context.onContextChange('nodes', nodes);
    }

    /**
     * Import all direct children of node with qId from the knowledge graph 
     * (The graph fetched from the backend, not the context).
     * 
     * @param {String} qId 
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

    getQuestionTypes() {
        const { qId } = this.props;

        const basicTypes = [];
        const allTypes = [];
        let options = [];

        for (let qType in questionTypes.basic) {
            basicTypes.push({
                key: questionTypes.basic[qType],
                text: questionTypes.basic[qType],
                value: qType,
            });
            allTypes.push({
                key: questionTypes.basic[qType],
                text: questionTypes.basic[qType],
                value: qType,
            });
        }

        for (let qType in questionTypes.advanced) {
            allTypes.push({
                key: questionTypes.advanced[qType],
                text: questionTypes.advanced[qType],
                value: qType,
            });
        }

        basicTypes.push({
            key: 'Advanced',
            text: 'Advanced...',
            value: 'Advanced...',
            onClick: this.getAdvancedDropdown,
        })

        allTypes.push({
            key: 'Less',
            text: 'Less...',
            value: 'Less...',
            onClick: this.removeAdvancedDropdown,
        })

        options = this.state.selectedMore ? allTypes : basicTypes;
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