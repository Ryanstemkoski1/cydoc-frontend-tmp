import React, { Component, Fragment } from 'react';
import { Input, Icon, Dropdown, Accordion, Button, Message } from 'semantic-ui-react';
import CreateTemplateContext from '../contexts/CreateTemplateContext';
import TemplateAnswer from './TemplateAnswer';
import questionTypes from '../constants/questionTypes';
import '../../css/components/newTemplate.css';

let DELETED_IDS = [];

class TemplateQuestion extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedMore: false,
            showDeleteQuestion: false,
            active: false,
        };
        this.changeActive = this.changeActive.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveQuestionType = this.saveQuestionType.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.deleteQuestionWithChildren = this.deleteQuestionWithChildren.bind(this);
        this.hideDeleteQuestion = this.hideDeleteQuestion.bind(this);
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
        this.context.state.nodes[qid].text = value;
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    saveQuestionType = (event, { value, qid }) => {
        let context = this.context.state;
        context.nodes[qid].type = value;
        context.nodes[qid].answerInfo = {};

        if (value === questionTypes.basic['YES-NO'] || value === questionTypes.basic['NO-YES']) {
            context.nodes[qid].answerInfo = {
                yesResponse: '',
                noResponse: '',
            };
        } else if (value === questionTypes.basic['SHORT-TEXT']
        || value === questionTypes.basic['NUMBER']
        || value === questionTypes.basic['TIME']
        || value === questionTypes.basic['LIST-TEXT']) {
            context.nodes[qid].answerInfo = {
                startResponse: '',
                endResponse: '',
            };
        } else if (value === questionTypes.basic['CLICK-BOXES']) {
            context.nodes[qid].answerInfo = {
                options: ['', '', ''],
                startResponse: '',
                endResponse: '',
            };
        } else if (value === questionTypes.advanced['FH-POP']
        || value === questionTypes.advanced['PMH-POP']
        || value === questionTypes.advanced['MEDS-POP']) {
            context.nodes[qid].answerInfo = {
                options: ['', '', ''],
            };
        }

        this.context.onContextChange('nodes', context.nodes);
    }

    deleteQuestion = (event, { qid }) => {
        const nodes = this.context.state.nodes;
        const graph = this.context.state.graph;
        const edges = this.context.state.edges;

        if ((nodes[qid].type !== 'Yes/No' && nodes[qid].type !== 'No/Yes') || graph[qid].length === 0) {
            // not Y/N question || Y/N question with no children
            for (let edge in edges) {
                const eInfo = edges[edge];
                if (eInfo.to === qid) {                   
                    graph[eInfo.from] = graph[eInfo.from].filter(e => e !== parseInt(edge));
                    delete this.context.state.edges[edge];
                }
            }
            delete graph[qid];
            delete nodes[qid];
        } else {
            // Y/N question with children
            this.setState({ showDeleteQuestion: true });
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
                value: questionTypes.basic[qType],
            });
            allTypes.push({
                key: questionTypes.basic[qType],
                text: questionTypes.basic[qType],
                value: questionTypes.basic[qType],
            });
        }

        for (let qType in questionTypes.advanced) {
            allTypes.push({
                key: questionTypes.advanced[qType],
                text: questionTypes.advanced[qType],
                value: questionTypes.advanced[qType],
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

        return (
            <Dropdown
                search
                selection
                placeholder='Question Type'
                qid={qId}
                direction='left'
                options={options}
                value={this.context.state.nodes[qId].type}
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

    render() {
        const { qId } = this.props;
        const { showDeleteQuestion, active } = this.state;

        const questionTypeOptions = this.getQuestionTypes();
        const curIcon = active ? 'caret down' : 'caret right';

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
                        {showDeleteQuestion ? 
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
                            :
                            <Fragment />
                        }
                        {questionTypeOptions}
                        <TemplateAnswer qId={qId} type={this.context.state.nodes[qId].type} />
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