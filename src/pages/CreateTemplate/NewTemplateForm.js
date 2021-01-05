import React, { Component, createRef } from 'react';
import { Button, Form, Header, Segment, Input, Grid, Dropdown, Message, Icon, Portal } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import './NewTemplate.css';
import TemplateQuestion from './TemplateQuestion';
import { graphClient } from 'constants/api.js';
import diseaseAbbrevs from 'constants/diseaseAbbrevs.json';
import diseaseCodes from 'constants/diseaseCodes';
import Nestable from 'react-nestable';
import { createNodeId, updateParent } from './util';

const OTHER_TEXT = 'Other (specify below)';
const MAX_NUM_QUESTIONS = 50;

// TODO: replace all hardcoded roots with a more unique id

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
            showLoader: false,
            createMessage: null,
        }
        this.saveTitle = this.saveTitle.bind(this);
        this.saveBodySystem = this.saveBodySystem.bind(this);
        this.saveDisease = this.saveDisease.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.flattenGraph = this.flattenGraph.bind(this);
        this.createTreeData = this.createTreeData.bind(this);
    }

    componentDidMount() {
        /**
         * Fetches the existing knowledge graphs from the backend to prepopulate the
         * available body systems and diseases. 
         */
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
        
                // Maintain a mapping of body systems to the associated diseases 
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

            // Merge all body system diseases into one cummulative list of diseases
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

    /**
     * Updates the value of the title of the template in the context
     */
    saveTitle(event, { value }) {
        this.context.onContextChange('title', value);
    }

    /**
     * Updates the selected body system and display an input field for
     * the user to type in their own if OTHER was selected.
     * 
     * If the value is left empty, raise an error message that prevents
     * the user from adding questions.
     */
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

    /**
     * Updates the selected disease and display an input field for
     * the user to type in their own if OTHER was selected
     * 
     * If the value is left empty, raise an error message that prevents
     * the user from adding questions.
     */
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

    /**
     * Adds a blank question to the form if a disease and body system was selected.
     * Display an error message otherwise.
     */
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
        let nextEdgeID = this.context.state.nextEdgeID;
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        const qId = createNodeId(diseaseCode, numQuestions);
        
        // Create a default node with the parent being the root
        this.context.state.nodes[qId] = {
            id: qId,
            text: '',
            responseType: '',
            answerInfo: {},
            parent: '0000',
            hasChanged: true,
        };

        this.context.state.edges[nextEdgeID] = {
            from: '0000',
            to: qId,
        };
        this.context.state.graph[qId] = [];
        this.context.state.graph['0000'].push(nextEdgeID);
        
        this.context.onContextChange('nodes', this.context.state.nodes);
        this.context.onContextChange('graph', this.context.state.graph);
        this.context.onContextChange('edges', this.context.state.edges);
        this.context.onContextChange('numQuestions', numQuestions + 1);
        this.context.onContextChange('nextEdgeID', nextEdgeID + 1);
    }

    /**
     * Processes the graph data in the template by filtering out unchanged imported nodes 
     * and ensuring all new nodes start with the correct disease code, and send a request
     * to the backend
     */
    createTemplate = async () => {
        const { title, disease, edges, nodes, graph, bodySystem } = this.context.state;
        const { doctorID } = this.context;
        this.setState({ showLoader: true });

        const updatedEdges = {};
        const updatedNodes = {};
        const updatedGraph = {};
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        // update all edge to/from to match current disease
        for (let [key, edge] of Object.entries(edges)) {
            // If both nodes are unchanged imported nodes, then no need to create an edge
            if (!nodes[edge.from].hasChanged && !nodes[edge.to].hasChanged) {
                continue;
            }
            let to;
            // Otherwise, if the sink node has not changed, make sure to use the old ID.
            // There'll never exist an edge from an old to new because adding a new child
            // is considered altering the original, leading to `hasChanged = false`.
            if (edge.from !== '0000' && !nodes[edge.to].hasChanged) {
                to  = nodes[edge.to].originalId;
            } else {
                to = edge.to === '0000' || edge.to.startsWith(diseaseCode) ? edge.to : diseaseCode + edge.to.slice(3);
            }
            const from = edge.from === '0000' || edge.from.startsWith(diseaseCode) ? edge.from : diseaseCode + edge.from.slice(3);
            updatedEdges[key] = { from, to };
        }

        // update all graph keys
        let fromOrder = {'0000': 1};
        for (let [key, children] of Object.entries(graph)) {
            // Skip over unchanged nodes
            if (key !== "0000" && !nodes[key].hasChanged) {
                continue;
            }
            const id = key === '0000' || key.startsWith(diseaseCode) ? key : diseaseCode + key.slice(3);
            updatedGraph[id] = children; 
            
            // TODO (AL): Figure out if edges connecting different knowledge graphs should affect the count
            // aka skip over its index or fill in the gaps
            let skipped = 0;
            children.forEach((edgeID, idx) => {
                let edge = edges[edgeID];
                if (edge.from !== '0000' && !nodes[edge.to].hasChanged) {
                    skipped++;
                    updatedEdges[edgeID].toQuestionOrder = -1;
                    updatedEdges[edgeID].fromQuestionOrder = -1;
                } else {
                    updatedEdges[edgeID].toQuestionOrder = idx - skipped + 1;
                    fromOrder[updatedEdges[edgeID].to] = idx - skipped + 1;
                }
            });
        }
        // Set `fromOrderQuestion` of each node
        Object.values(updatedEdges).forEach(edge => {
            if (edge.toQuestionOrder !== -1) {
                edge.fromOrderQuestion = fromOrder[edge.from];
            }
        });

        // update all node key and object values
        for (let [key, data] of Object.entries(nodes)) {
            if (key !== '0000' && !data.hasChanged) {
                continue;
            }
            data = {...data};
            
            // Encode answerInfo according to backend
            if (data.responseType === 'CLICK-BOXES') {
                data.text += ` CLICK[${data.answerInfo.options.join(', ')}]`;
            } else if (data?.answerInfo?.startResponse) {
                // TODO: When backend permits encode the fill in the blanks
            }

            // Update node object to have only the required attributes
            delete data.answerInfo;
            delete data.hasChanged;
            delete data.originalId;
            delete data.parent;

            if (key !== '0000' && !key.startsWith(diseaseCode)) {
                key = diseaseCode + key.slice(3);
            }
            updatedNodes[key] = { 
                ...data, 
                bodySystem,
                noteSection: 'HPI',
                medID: key,
                category: disease,
                doctorView: disease,
                patientView: disease,
                doctorCreated: doctorID,
            };
            delete updatedNodes[key].id;
        }

        // Send updated data to the backend
        let createMessage, res;
        try {
            // // Dummy endpoint for testing successes until backend is fixed
            // res = await fetch('https://httpbin.org/post', {
            //     method:'POST',
            //     headers: {'Content-Type': 'application/json'}
            // });
            res = await graphClient.post(`/doctor/${doctorID}`, {
                graphName: title,
                root: '0000', // TODO: do not hardcode the root ID
                graph: updatedGraph,
                nodes: updatedNodes,
                edges: updatedEdges,
            });
            createMessage = 'Successfully created template!';
        } catch (e) {
            console.log(e);
            createMessage = res?.data?.Message || 'Unable to create template';
        } finally {
            console.log(updatedNodes);
            console.log(updatedEdges);
            console.log(updatedGraph);
            this.setState({ createMessage, showLoader:false });
        }
    }

    /**
     * Condense the tree structured graph (made up of nodes) into a single JSON object
     * for react-nestable to read
     */
    createTreeData = () => {
        const { graph, edges, nodes } = this.context.state;
        return graph['0000'].map(edge => {
            // create treeNode for every root level question
            const qId = edges[edge].to;
            return this.flattenGraph(qId, '0000', edge);
        });
    }
    
    /**
     * Helper function for condensing a tree into a JSON. Returns the condensed JSON object.
     * 
     * @param {String} root: The ID of the root of the subtree being condensed
     * @param {*} parent: The parent of the root
     * @param {*} edge: The ID of the edge connecting the parent to the root
     */
    flattenGraph = (root, parent, edge) => {
        const { graph, edges, nodes } = this.context.state;
        
        // create the children recursively
        const children = graph[root].map(edge => {
            const childId = edges[edge].to;
            return this.flattenGraph(childId, root, edge);
        });
        return {
            children,
            parent,
            edge,
            id: root,
        };
    }

    /**
     * Returns the Component representation of a question
     * 
     * @param {Object} item: the question being rendered
     * @param {React.Component} collapseIcon: the icon for collapsing children nodes
     * @param {React.Component} handler: the icon for dragging the node around
     */
    renderItem = ({ item, collapseIcon, handler }) => {
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

    /**
     * Returns the Component responsible for toggling between collapsed/shown children nodes
     * 
     * @param {Boolean} isCollapsed 
     */
    renderCollapseIcon = ({ isCollapsed }) => {
        return <Icon 
            className='collapse-icon' 
            name={`${isCollapsed ? "plus" : "minus"}`}
        />
    }

    /**
     * Updates the graph data with the new question orders after a drag and drop is performed
     * 
     * @param {*} items: the updated JSON representation of the knowledge graph
     * @param {*} item: the item that was dragged
     */
    updateOrder = (items, item) => {
        const { graph, edges, nodes } = this.context.state;

        const [newParent, subtree] = this.findParent(items, "0000", item.id);
        if (!newParent) {
            return; // Couldn't find parent, something went wrong
        }
        // Update ordering within a level if the parent IDs match
        if (item.parent === newParent) {
            const nodesToEdge = {};
            const newEdges = [];
            graph[newParent].forEach(edge => nodesToEdge[edges[edge].to] = edge);
            for(let i = 0; i < subtree.length; i++) {
                let nodeId = subtree[i].id;
                newEdges.push(nodesToEdge[nodeId]);
            }
            graph[newParent] = newEdges;
            updateParent(nodes, newParent);
        } else {
            // Level changed, so remove edge from old parent
            graph[item.parent] = graph[item.parent].filter(edge => edge != item.edge);

            // Update the parent and the graph with new edge
            edges[item.edge].from = newParent;
            const nodesToEdge = {};
            const newEdges = [];
            graph[newParent].forEach(edge => nodesToEdge[edges[edge].to] = edge);
            for(let i = 0; i < subtree.length; i++) {
                let nodeId = subtree[i].id;
                if (nodeId == item.id) {
                    newEdges.push(item.edge);
                } else {
                    newEdges.push(nodesToEdge[nodeId]);
                }
            }
            graph[newParent] = newEdges;            
            updateParent(nodes, newParent);
            updateParent(nodes, item.parent);

        }
        this.context.onContextChange("graph", graph);
        this.context.onContextChange("edges", edges);
    }

    /**
     * Searches the treeData in Depth-first search manner and returns the parent 
     * of the target (null if unsuccessful) and the subtree itself
     * 
     * @param {Array<Object>} children: list of children to search through
     * @param {String} parent: ID of the direct parent of the children
     * @param {String} target: ID to look for 
     */
    findParent = (children, parent, target) => {
        for (let i = 0; i < children.length; i++) {
            let childId = children[i].id;
            if (childId == target) {
                return [parent, children];
            }
            let [guess, data] = this.findParent(children[i].children, childId, target);
            if (guess) {
                return [guess, data];
            }
        }
        return [null, {}];
    }


    render() {
        const { 
            bodySystems, 
            diseases, 
            showOtherBodySystem, 
            showOtherDisease, 
            showLoader,
            createMessage, 
        } = this.state;

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
                <Nestable
                    items={this.createTreeData()}
                    handler={<Icon name='bars'/>}
                    renderItem={this.renderItem}
                    renderCollapseIcon={this.renderCollapseIcon}
                    onChange={this.updateOrder}
                    threshold={50}
                />
                <Button
                    circular
                    icon='add'
                    onClick={this.addQuestion}
                    content='Add question'
                    className='add-question-button'
                    disabled={this.context.state.numQuestions >= MAX_NUM_QUESTIONS + 1}
                />
                <Button
                    circular
                    floated='right'
                    content='Create Template'
                    className='create-tmpl-button'
                    onClick={this.createTemplate}
                    disabled={this.context.state.numQuestions === 1}
                    loading={showLoader}
                />
                { this.context.state.numQuestions >= MAX_NUM_QUESTIONS + 1 && (
                    <p className='add-question-msg'>
                        * Reached maximum number of questions ({MAX_NUM_QUESTIONS})
                    </p>
                )}
                <Portal
                    open={createMessage != null}
                    onClose={() => this.setState({ createMessage: null })}
                >
                    <div className='create-tmpl-msg'>{createMessage}</div>
                </Portal>
            </Segment>
        );
    }
}

export default NewTemplateForm;