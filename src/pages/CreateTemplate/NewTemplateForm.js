import React, { Component, createRef } from 'react';
import { Button, Form, Header, Segment, Input, Grid, Dropdown, Message, Icon } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import './NewTemplate.css';
import 'components/navigation/NavMenu.css';
import TemplateQuestion from './TemplateQuestion';
import { graphClient } from 'constants/api.js';
import diseaseAbbrevs from 'constants/diseaseAbbrevs.json';
import diseaseCodes from 'constants/diseaseCodes';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SortableTree from 'react-sortable-tree';
import Nestable from 'react-nestable';
import 'react-sortable-tree/style.css';
import './react-sortable-tree.css';

const OTHER_TEXT = 'Other (specify below)';

class NewTemplateForm extends Component {
    static contextType = CreateTemplateContext;
    titleRef = createRef();

    constructor(props, context) {
        super(props, context);
        this.state = {
            bodySystems: [],
            diseases: [],
            graphData: {},
            showOtherBodySystem: false,
            showOtherDisease: false,
            diseaseEmpty: true,
            bodySystemEmpty: true,
        }
        this.saveTitle = this.saveTitle.bind(this);
        this.saveBodySystem = this.saveBodySystem.bind(this);
        this.saveDisease = this.saveDisease.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.flattenGraph = this.flattenGraph.bind(this);
        this.createTreeData = this.createTreeData.bind(this);
    }

    componentDidMount() {
        graphClient.get('/graph').then(value => {
            const nodes = value.data.nodes;
            const allBodySystems = [];
            const allDiseases = [];
            const allQuestionTypes = [];
            let categories = new Set();
            let bodySystems = {};
            for (const node in nodes) {
                const category = nodes[node].category;
                const questionType = nodes[node].responseType;
        
                if (!(categories.has(category))) {
                    const bodySys = nodes[node].bodySystem;
                    let key = (((category.split('_')).join(' ')).toLowerCase()).replace(/^\w| \w/gim, c => c.toUpperCase());
                    
                    categories.add(category);
                    if (key === 'Shortbreath') {
                        key = 'Shortness of Breath';
                    } else if (key === 'Nausea-vomiting') {
                        key = 'Nausea/Vomiting';
                    }
                    if (!(bodySys in bodySystems)) {
                        bodySystems[bodySys] = {
                            name: diseaseAbbrevs[bodySys],
                            diseases: [],
                        };
                    }
                    bodySystems[bodySys].diseases.push(key);
                }

                if (! allQuestionTypes.includes(questionType)) {
                    allQuestionTypes.push(questionType);
                }
            }

            for (let i = 0; i < Object.values(bodySystems).length; i++) {
                const bodySys = Object.values(bodySystems)[i];
                allBodySystems.push(bodySys.name);
                for (let j = 0; j < bodySys.diseases.length; j++) {
                    allDiseases.push(bodySys.diseases[j]);
                }
            }

            this.setState({
                bodySystems: allBodySystems,
                diseases: allDiseases,
                graphData: value.data,
            });
        });
    }

    saveTitle(event, { value }) {
        this.context.onContextChange('title', value);
    }

    saveBodySystem(event, { value }) {
        const otherInput = document.getElementById('other-body-system');
        const errorMessage = document.getElementById('body-error-message');

        if (value === OTHER_TEXT) {
            otherInput.style.display = 'inline-block';
            this.setState({
                showOtherBodySystem: true,
                bodySystemEmpty: true,
            })
            this.context.onContextChange('bodySystem', '');
        } else if (this.state.bodySystems.includes(value)) {
            otherInput.style.display = 'none';
            errorMessage.style.display = 'none';
            this.setState({
                showOtherBodySystem: false,
                bodySystemEmpty: false,
            })
            this.context.onContextChange('bodySystem', value);
        } else {
            if (value === '') {
                this.setState({ bodySystemEmpty: true });
            } else {
                errorMessage.style.display = 'none';
                this.setState({ bodySystemEmpty: false });
            }
            this.context.onContextChange('bodySystem', value);
        }
    }

    saveDisease(event, { value }) {
        const otherInput = document.getElementById('other-disease');
        const errorMessage = document.getElementById('disease-error-message');

        if (value === OTHER_TEXT) {
            otherInput.style.display = 'inline-block';
            this.setState({
                showOtherDisease: true,
                diseaseEmpty: true,
            })
            this.context.onContextChange('disease', '');
        } else if (this.state.diseases.includes(value)) {
            otherInput.style.display = 'none';
            errorMessage.style.display = 'none';
            this.setState({
                showOtherDisease: false,
                diseaseEmpty: false,
            })
            this.context.onContextChange('disease', value);
        } else {
            if (value === '') {
                this.setState({ diseaseEmpty: true });
            } else {
                errorMessage.style.display = 'none';
                this.setState({ diseaseEmpty: false });
            }
            this.context.onContextChange('disease', value);
        }
    }

    addQuestion() {
        if (this.state.diseaseEmpty) {
            document.getElementById('disease-error-message').style.display = 'inline-block';
            return;
        }

        if (this.state.bodySystemEmpty) {
            document.getElementById('body-error-message').style.display = 'inline-block';
            return;
        }

        let numQuestions = this.context.state.numQuestions;
        let numEdges = this.context.state.numEdges;
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        const randomId = Math.floor(Math.random() * 9000000000) + 1000000000;

        const numZeros = 4 - numQuestions.toString().length;
        const qId = diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();
        
        this.context.state.nodes[qId] = {
            id: qId,
            text: '',
            type: '',
            order: numQuestions,
            answerInfo: {},
        };

        this.context.state.edges[numEdges] = {
            from: '0000',
            to: qId,
        };
        this.context.state.graph[qId] = [];
        this.context.state.graph['0000'].push(numEdges);
        
        this.context.onContextChange('nodes', this.context.state.nodes);
        this.context.onContextChange('graph', this.context.state.graph);
        this.context.onContextChange('edges', this.context.state.edges);
        this.context.onContextChange('numQuestions', numQuestions + 1);
        this.context.onContextChange('numEdges', numEdges + 1);
    }

    createTemplate = () => {
        const { disease, edges, nodes, graph } = this.context.state;

        const updatedEdges = {};
        const updatedNodes = {};
        const updatedGraph = {};
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        // update all edge to/from to match current disease
        for (let [key, edge] of Object.entries(edges)) {
            const from = edge.from === '0000' || edge.from.startsWith(diseaseCode) ? edge.from : diseaseCode + edge.from.slice(3);
            const to = edge.to === '0000' || edge.to.startsWith(diseaseCode) ? edge.to : diseaseCode + edge.to.slice(3);
            updatedEdges[key] = { from, to };
        }

        // update all graph keys
        for (let [key, children] of Object.entries(graph)) {
            const id = key === '0000' || key.startsWith(diseaseCode) ? key : diseaseCode + key.slice(3);
            updatedGraph[id] = children; 
        }

        // update all node keys and object values
        for (let [key, data] of Object.entries(nodes)) {
            if (key === '0000' || key.startsWith(diseaseCode)) {
                updatedNodes[key] = data;
            } else {
                const id = diseaseCode + key.slice(3);
                updatedNodes[id] = { ...data, id };
            }
        }

        this.context.onContextChange('nodes', updatedNodes);
        this.context.onContextChange('graph', updatedGraph);
        this.context.onContextChange('edges', updatedEdges);

        alert('Template created'); // for dev purposes 
    }

    onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return; // dropped outside, so do nothing
        }
        if (destination.index == source.index) {
            return; // did not move
        }
        const graph = { ...this.context.state.graph };
        const rootEdges = graph['0000'];
        const newOrderedEdges = Array.from(rootEdges);
        newOrderedEdges.splice(source.index, 1);
        newOrderedEdges.splice(destination.index, 0, rootEdges[source.index]);
        
        // update question order
        const nodes = { ...this.context.state.nodes };
        const edges = { ...this.context.state.edges };
        nodes[draggableId].order = nodes[edges[rootEdges[destination.index]].to].order;
        if (source.index > destination.index) {
            for (let i = destination.index + 1; i <= source.index; i++) {
                const nodeId = edges[newOrderedEdges[i]].to;
                nodes[nodeId].order += 1;
            }
        } else {
            for (let i = source.index; i < destination.index; i++) {
                const nodeId = edges[newOrderedEdges[i]].to;
                nodes[nodeId].order -= 1;
            }
        }

        graph['0000'] = newOrderedEdges;
        this.context.onContextChange('graph', graph);
        this.context.onContextChange('nodes', nodes);
    }

    createTreeData = () => {
        const { graph, edges, nodes } = this.context.state;
        return graph['0000'].map(edge => {
            // create treeNode for every root level question
            const qId = edges[edge].to;
            return this.flattenGraph(qId);
        });
    }
    
    createTreeData2 = () => {
        const { graph, edges, nodes } = this.context.state;
        return graph['0000'].map(edge => {
            // create treeNode for every root level question
            const qId = edges[edge].to;
            return this.flattenGraph2(qId);
        });
    }

    flattenGraph = (root) => {
        const { graph, edges, nodes } = this.context.state;
        
        // create the children recursively
        const children = graph[root].map(edge => {
            const childId = edges[edge].to;
            return this.flattenGraph(childId);
        });
        return {
            children,
            id: root,
        };
    }
    flattenGraph2 = (root) => {
        const { graph, edges, nodes } = this.context.state;
        
        // create the children recursively
        const children = graph[root].map(edge => {
            const childId = edges[edge].to;
            return this.flattenGraph2(childId);
        });
        const title = (
            <TemplateQuestion
                key={root}
                qId={root}
                allDiseases={this.state.diseases}
                graphData={this.state.graphData}
            />
        );
        const item = {
            title,
            children,
            expanded: false,
        };
        return item
    }

    renderItem = ({ item, collapseIcon, handler }) => {
        console.log(item);
        return (
            <div className="root-question">
                {handler}
                {collapseIcon}
                <TemplateQuestion
                    key={item.id}
                    qId={item.id}
                    allDiseases={this.state.diseases}
                    graphData={this.state.graphData}
                />
            </div>
        )
    }

    render() {
        const { bodySystems, diseases, showOtherBodySystem, showOtherDisease, graphData } = this.state;
        // console.log(this.context.state)
        const bodySystemOptions = [{
            value: OTHER_TEXT,
            text: OTHER_TEXT,
        }];
        bodySystems.forEach(bodySystem => {
            bodySystemOptions.push({
                value: bodySystem,
                text: bodySystem,
            });
        });

        const diseaseOptions = [{
            value: OTHER_TEXT,
            text: OTHER_TEXT,
        }];
        diseases.forEach(disease => {
            diseaseOptions.push({
                value: disease,
                text: disease,
            });
        });

        const rootEdges = this.context.state.graph['0000'];
        const questionsDisplay = rootEdges.map((edge, idx) => {
            const qId = this.context.state.edges[edge.toString()].to;
            return (
                <Draggable key={qId} draggableId={qId} index={idx}>
                    {(provided, snapshot) => (
                        <div
                            key={qId}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className='root-question'
                        >
                            <Icon 
                                name='bars'
                                {...provided.dragHandleProps}
                            />
                            <TemplateQuestion 
                                key={qId} 
                                qId={qId} 
                                allDiseases={diseases}
                                graphData={graphData}
                            />
                        </div>
                    )}
                </Draggable>
            );
        });

        return (
            <Segment className='container'>
                <Form>
                    <Header as='h2'>
                        <Input
                            placeholder='Template Title'
                            ref={this.titleRef}
                            id='input-title'
                            value={this.context.state.title}
                            onChange={this.saveTitle}
                            transparent
                            fluid
                        />
                    </Header>
                    <Grid>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <div>Body System</div>
                            <Dropdown
                                fluid
                                search
                                selection
                                clearable
                                placeholder='e.g. Endocrine'
                                value={showOtherBodySystem ? OTHER_TEXT : this.context.state.bodySystem}
                                options={bodySystemOptions}
                                onChange={this.saveBodySystem}
                                className='info-dropdown'
                            />
                            <Input
                                fluid
                                placeholder='Other Body System'
                                value={this.context.state.bodySystem}
                                onChange={this.saveBodySystem}
                                id='other-body-system'
                            />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <div>Disease</div>
                            <Dropdown
                                fluid
                                search
                                selection
                                clearable
                                placeholder='e.g. Diabetes'
                                value={showOtherDisease ? OTHER_TEXT : this.context.state.disease}
                                options={diseaseOptions}
                                onChange={this.saveDisease}
                                className='info-dropdown'
                            />
                            <Input
                                fluid
                                placeholder='Other Disease'
                                value={this.context.state.disease}
                                onChange={this.saveDisease}
                                id='other-disease'
                            />
                        </Grid.Column>
                    </Grid>
                </Form>
                <Message
                    compact
                    negative
                    content='Please choose a disease before adding questions.'
                    id='disease-error-message'
                />
                <Message
                    compact
                    negative
                    content='Please choose a body system before adding questions.'
                    id='body-error-message'
                />
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="questions">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="root-question-list"
                            >
                                {questionsDisplay}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div style={{ height: 70 * this.context.state.numQuestions }}>
                    <SortableTree 
                        treeData={this.createTreeData2()}
                        onChange={treeData => console.log(treeData)}
                    />
                </div>
                <Nestable
                    items={this.createTreeData()}
                    renderItem={this.renderItem}
                    handler={<Icon name='bars'/>}
                />
                <Button
                    circular
                    icon='add'
                    onClick={this.addQuestion}
                    content='Add question'
                    className='add-question-button'
                />
                <Button
                    circular
                    floated='right'
                    content='Create Template'
                    className='create-tmpl-button'
                    onClick={this.createTemplate}
                    disabled={this.context.state.numQuestions === 1}
                />
            </Segment>
        );
    }
}

export default NewTemplateForm;