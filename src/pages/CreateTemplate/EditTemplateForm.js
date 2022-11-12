import React, { Component, createRef } from 'react';
import {
    Button,
    Form,
    Header,
    Segment,
    Input,
    Grid,
    Dropdown,
    Icon,
    Dimmer,
    Loader,
    Message,
} from 'semantic-ui-react';
import HPITemplateContext from '../../contexts/HPITemplateContext';
import './TemplateForm.css';
import TemplateQuestion from './TemplateQuestion';
import { graphClient } from 'constants/api.js';
import diseaseCodes from 'constants/diseaseCodes';
import Nestable from 'react-nestable';
import { createNodeId, updateParent, NAN_QUESTION_TEXT } from './util';
import ProTips from './modules/ProTips';
import { questionTypes } from 'constants/questionTypes';

const MAX_NUM_QUESTIONS = 50;
const INIT_NUM_QUESTIONS = 6;
const ERROR_MESSAGES = {
    bodySystemEmpty: 'A body system must be specified.',
    diseaseEmpty: 'A disease must be specified.',
    emptyQuestion: 'All questions must have a response type.',
};

class EditTemplateForm extends Component {
    static contextType = HPITemplateContext;
    titleRef = createRef();

    constructor(props, context) {
        super(props, context);
        this.state = {
            bodySystems: {},
            categoryMap: {},
            parentNodes: {},
            graphData: {},
            fetching: true,
            templateErrors: {
                bodySystemEmpty: false,
                diseaseEmpty: false,
                emptyQuestion: false,
            },
            showDimmer: false,
            requestResult: null,
            invalidUpdates: new Set(),
        };
        this.saveTitle = this.saveTitle.bind(this);
        this.saveBodySystem = this.saveBodySystem.bind(this);
        this.saveDisease = this.saveDisease.bind(this);
        this.flattenGraph = this.flattenGraph.bind(this);
        this.createTreeData = this.createTreeData.bind(this);
    }

    componentDidMount = async () => {
        this.addNQuestions(INIT_NUM_QUESTIONS);
        try {
            const res = await graphClient.get('/hpi/CYDOC');
            const { bodySystems, parentNodes } = res.data;

            const categoryMap = {};
            Object.entries(parentNodes).forEach(([doctorView, mapping]) => {
                let category = Object.keys(mapping)[0];
                categoryMap[doctorView] = category;
            });

            this.setState((prevState) => ({
                bodySystems: { ...prevState.bodySystems, ...bodySystems },
                categoryMap: { ...prevState.categoryMap, ...categoryMap },
            }));
            this.context.onTemplateChange('parentNodes', parentNodes);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        } finally {
            this.setState({ fetching: false });
        }
    };

    /**
     * Updates the value of the title of the template in the context
     */
    saveTitle(event, { value }) {
        this.context.onTemplateChange('title', value);
    }

    addInvalidUpdate = (qId) => {
        const invalidUpdates = new Set(this.state.invalidUpdates);
        invalidUpdates.add(qId);
        this.setState({ invalidUpdates });
    };

    removeInvalidUpdate = (qId) => {
        const invalidUpdates = new Set(this.state.invalidUpdates);
        invalidUpdates.delete(qId);
        this.setState({ invalidUpdates });
    };

    saveBodySystem(_e, { value }) {
        let { disease } = this.context.template;
        const { bodySystems } = this.state;
        if (!bodySystems[value] || !bodySystems[value].includes(disease)) {
            disease = '';
        }
        this.context.onTemplateChange('bodySystem', value);
        this.context.onTemplateChange('disease', disease);
    }

    saveDisease(_e, { value }) {
        this.context.onTemplateChange('disease', value);
    }

    handleDiseaseAddition = (_e, { value }) => {
        const bodySystems = { ...this.state.bodySystems };
        const categoryMap = { ...this.state.categoryMap };
        const { bodySystem } = this.context.template;

        bodySystems[bodySystem] = bodySystems[bodySystem].concat(value);
        if (!(value in categoryMap)) {
            categoryMap[value] = value;
        }

        this.setState({ categoryMap, bodySystems });
    };

    // Add N blank questions as direct children of the root
    addNQuestions = (n) => {
        let { numQuestions, nextEdgeID } = this.context.template;
        const { disease, nodes, edges, graph, root } = this.context.template;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        for (let i = 0; i < n; i++) {
            let qId = createNodeId(diseaseCode, numQuestions);
            nodes[qId] = {
                id: qId,
                text: '',
                responseType: '',
                answerInfo: {},
                parent: root,
                hasChanged: true,
            };
            edges[nextEdgeID] = {
                from: root,
                to: qId,
            };
            graph[qId] = [];
            graph[root].push(nextEdgeID);
            numQuestions++;
            nextEdgeID++;
        }
        this.context.updateTemplate({
            nodes,
            graph,
            edges,
            numQuestions,
            nextEdgeID,
        });
    };

    getTemplateErrors = () => {
        const errors = [];
        for (const err in ERROR_MESSAGES) {
            if (this.state.templateErrors[err]) {
                errors.push(
                    <Message.Item key={err} content={ERROR_MESSAGES[err]} />
                );
            }
        }
        return errors;
    };

    /**
     * Processes the graph data in the template by filtering out unchanged imported nodes
     * and ensuring all new nodes start with the correct disease code, and send a request
     * to the backend
     */
    saveTemplate = async () => {
        const {
            title,
            disease,
            edges,
            nodes,
            graph,
            bodySystem,
            graphID,
        } = this.context.template;
        let { root } = this.context.template;
        const { doctorID } = this.context;
        this.setState({ showDimmer: true });

        const updatedEdges = {};
        const updatedNodes = {};
        const updatedGraph = {};
        const rootSuffix = root.slice(3);
        const templateErrors = {
            bodySystemEmpty: bodySystem.length === 0,
            diseaseEmpty: disease.length === 0,
            emptyQuestion: false,
        };
        let diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        root = diseaseCode + rootSuffix;

        // Update all edge's `to`/`from` keys to match current disease
        for (let [key, edge] of Object.entries(edges)) {
            // If both nodes are unchanged imported nodes, then no need to create an edge
            if (!nodes[edge.from].hasChanged && !nodes[edge.to].hasChanged) {
                continue;
            }
            let to;
            // Otherwise, if the sink node has not changed, make sure to use the old ID.
            // There'll never exist an edge from an old to new because adding a new child
            // is considered altering the original, leading to `hasChanged = false`.
            if (!edge.from.endsWith(rootSuffix) && !nodes[edge.to].hasChanged) {
                to = nodes[edge.to].originalId;
            } else {
                to = edge.to.startsWith(diseaseCode)
                    ? edge.to
                    : diseaseCode + edge.to.slice(edge.to.indexOf('-'));
            }
            const from = edge.from.startsWith(diseaseCode)
                ? edge.from
                : diseaseCode + edge.from.slice(edge.from.indexOf('-'));
            updatedEdges[key] = { from, to };
        }

        // Update graph keys and assign order to edges
        let fromOrder = { [root]: 1 };
        for (let [key, children] of Object.entries(graph)) {
            // Skip over unchanged nodes
            if (!key.endsWith(rootSuffix) && !nodes[key].hasChanged) {
                continue;
            }
            const id = key.startsWith(diseaseCode)
                ? key
                : diseaseCode + key.slice(key.indexOf('-'));

            updatedGraph[id] = children;

            // TODO (AL): Figure out if edges connecting different knowledge graphs should
            // affect the count aka skip over its index or fill in the gaps
            let skipped = 0;
            children.forEach((edgeID, idx) => {
                let edge = edges[edgeID];
                if (
                    !edge.from.endsWith(rootSuffix) &&
                    !nodes[edge.to].hasChanged
                ) {
                    skipped++;
                    updatedEdges[edgeID].toQuestionOrder = -1;
                    updatedEdges[edgeID].fromQuestionOrder = -1;
                } else {
                    const absoluteIndex = idx - skipped + 1;
                    updatedEdges[edgeID].toQuestionOrder = absoluteIndex;
                    fromOrder[updatedEdges[edgeID].to] = absoluteIndex;
                }
            });
        }
        Object.values(updatedEdges).forEach((edge) => {
            if (edge.toQuestionOrder !== -1) {
                edge.fromQuestionOrder = fromOrder[edge.from];
            }
        });

        // Filter out unchanged nodes and update its attributes accordingly
        for (let [key, data] of Object.entries(nodes)) {
            if (!key.endsWith(rootSuffix) && !data.hasChanged) {
                continue;
            }
            data = { ...data };
            if (data.responseType.length === 0) {
                templateErrors.emptyQuestion = true;
                break;
            }

            if (
                data.text.startsWith('Root') &&
                data.text.endsWith(NAN_QUESTION_TEXT)
            ) {
                data.text = 'nan';
            }

            if (
                data.responseType === 'CLICK-BOXES' ||
                data.responseType.endsWith('-POP')
            ) {
                data.text += ` CLICK[${data.answerInfo.options.join(', ')}]`;
            } /* else if (data.answerInfo?.startResponse) {
                // TODO: When backend permits encode the fill in the blanks
            } */

            const doctorCreated = data.hasChanged
                ? doctorID
                : data.doctorCreated;

            if (data.category) {
                diseaseCode =
                    diseaseCodes[data.category] || data.category.slice(0, 3);
            }

            if (!key.startsWith(diseaseCode)) {
                key = diseaseCode + key.slice(key.indexOf('-'));
            }

            delete data.answerInfo;
            delete data.hasChanged;
            delete data.originalId;
            delete data.parent;

            updatedNodes[key] = {
                bodySystem,
                noteSection: 'HPI',
                category: this.state.categoryMap[disease] || disease,
                doctorView: disease,
                patientView: disease,
                blankTemplate: '',
                blankYes: '',
                blankNo: '',
                ...data, // original values of the above keys hold higher precedence
                doctorCreated,
                medID: key,
            };
            delete updatedNodes[key].id;
        }

        if (Object.values(templateErrors).some((bool) => bool)) {
            this.setState({
                templateErrors,
                showDimmer: false,
            });
            return;
        }

        // Send updated data to the backend
        let requestResult, resMessage, resIcon;
        try {
            const body = {
                root,
                graphName: title,
                graph: updatedGraph,
                nodes: updatedNodes,
                edges: updatedEdges,
            };
            const url = `/doctor/${doctorID}`;

            if (graphID) {
                await graphClient.put(`${url}/${graphID}`, body);
            } else {
                await graphClient.post(url, body);
            }

            resMessage = 'Successfully saved template!';
            resIcon = 'circle check outline';
        } catch (err) {
            resMessage =
                err?.response?.data?.Message || 'Unable to create template';
            resIcon = 'warning sign';
        } finally {
            requestResult = (
                <div className='create-tmpl-msg'>
                    <Icon name={resIcon} size='big' />
                    <p>{resMessage}</p>
                </div>
            );
            this.setState({ requestResult });
        }
    };

    /**
     * Condense the tree structured graph (made up of nodes) into a single JSON object
     * for react-nestable to read
     */
    createTreeData = () => {
        const { graph, edges, root } = this.context.template;
        return graph[root].map((edge) => {
            // create treeNode for every root level question
            const qId = edges[edge].to;
            return this.flattenGraph(qId, root, edge);
        });
    };

    /**
     * Helper function for condensing a tree into a JSON. Returns the condensed JSON object.
     *
     * @param {String} root: The ID of the root of the subtree being condensed
     * @param {*} parent: The parent of the root
     * @param {*} edge: The ID of the edge connecting the parent to the root
     */
    flattenGraph = (root, parent, edge) => {
        const { graph, edges } = this.context.template;

        // create the children recursively
        const children = graph[root].map((edge) => {
            const childId = edges[edge].to;
            return this.flattenGraph(childId, root, edge);
        });
        return {
            children,
            parent,
            edge,
            id: root,
        };
    };

    /**
     * Returns the Component representation of a question
     *
     * @param {Object} item: the question being rendered
     * @param {React.Component} collapseIcon: the icon for collapsing children nodes
     * @param {React.Component} handler: the icon for dragging the node around
     */
    renderItem = ({ item, collapseIcon, handler }) => {
        return (
            <div className='root-question'>
                {handler}
                {collapseIcon}
                <TemplateQuestion
                    key={item.id}
                    qId={item.id}
                    invalidUpdates={this.state.invalidUpdates}
                    removeInvalidUpdate={this.removeInvalidUpdate}
                />
            </div>
        );
    };

    /**
     * Returns the Component responsible for toggling between collapsed/shown children nodes
     *
     * @param {Boolean} isCollapsed
     */
    renderCollapseIcon = ({ isCollapsed }) => {
        return (
            <Icon
                className='collapse-icon'
                name={`${isCollapsed ? 'plus' : 'minus'}`}
            />
        );
    };

    /**
     * Updates the graph data with the new question orders after a drag and drop is performed
     *
     * @param {*} items: the updated JSON representation of the knowledge graph
     * @param {*} item: the item that was dragged
     */
    updateOrder = (items, item) => {
        const { graph, edges, nodes, root } = this.context.template;

        const [newParent, subtree] = this.findParent(items, root, item.id);
        if (!newParent) {
            return; // Couldn't find parent, something went wrong
        }
        // Update ordering within a level if the parent IDs match
        if (item.parent === newParent) {
            const nodesToEdge = {};
            const newEdges = [];
            graph[newParent].forEach(
                (edge) => (nodesToEdge[edges[edge].to] = edge)
            );
            for (let i = 0; i < subtree.length; i++) {
                let nodeId = subtree[i].id;
                newEdges.push(nodesToEdge[nodeId]);
            }
            graph[newParent] = newEdges;
            updateParent(nodes, newParent);
        } else {
            // Otherwise, level/parent has changed. Enforce that only YES-NO
            // questions are allowed followups.
            if (
                nodes[newParent].responseType !== questionTypes.YES_NO &&
                nodes[newParent].responseType !== questionTypes.NO_YES
            ) {
                this.addInvalidUpdate(newParent);
                return;
            }

            // Update the parent and the graph with new edge
            edges[item.edge].from = newParent;
            const nodesToEdge = {};
            const newEdges = [];
            graph[newParent].forEach(
                (edge) => (nodesToEdge[edges[edge].to] = edge)
            );
            for (let i = 0; i < subtree.length; i++) {
                let nodeId = subtree[i].id;
                if (nodeId === item.id) {
                    newEdges.push(item.edge);
                } else {
                    newEdges.push(nodesToEdge[nodeId]);
                }
            }

            // Remove old edge from old parent
            graph[item.parent] = graph[item.parent].filter(
                (edge) => edge !== item.edge
            );

            graph[newParent] = newEdges;
            updateParent(nodes, newParent);
            updateParent(nodes, item.parent);
        }
        this.context.onTemplateChange('graph', graph);
        this.context.onTemplateChange('edges', edges);
    };

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
            if (childId === target) {
                return [parent, children];
            }
            let [guess, data] = this.findParent(
                children[i].children,
                childId,
                target
            );
            if (guess) {
                return [guess, data];
            }
        }
        return [null, {}];
    };

    render() {
        const { bodySystems, showDimmer, requestResult, fetching } = this.state;

        const {
            numQuestions,
            title,
            bodySystem,
            disease,
        } = this.context.template;

        const bodySystemOptions = Object.keys(bodySystems).map((bodySys) => ({
            key: bodySys,
            value: bodySys,
            text: bodySys,
        }));
        const diseaseOptions = (bodySystems[bodySystem] || []).map(
            (category) => ({
                key: category,
                value: category,
                text: category,
            })
        );

        const reachedMax = numQuestions >= MAX_NUM_QUESTIONS + 1;
        const errors = this.getTemplateErrors();
        return (
            <>
                <ProTips />
                <Dimmer.Dimmable
                    as={Segment}
                    className='container template-form'
                    dimmed={showDimmer}
                >
                    <Dimmer active={showDimmer} inverted>
                        {!requestResult ? (
                            <Loader>Saving...</Loader>
                        ) : (
                            <>
                                {requestResult}
                                <Button
                                    icon='close'
                                    content='Dismiss'
                                    onClick={() =>
                                        this.setState({
                                            requestResult: null,
                                            showDimmer: false,
                                        })
                                    }
                                />
                            </>
                        )}
                    </Dimmer>
                    <Header
                        dividing
                        as='h2'
                        textAlign='center'
                        content='History of Present Illness Template'
                        subheader='Create your own dynamic, interactive HPI questionnaire
                        to generate an HPI your way.'
                    />
                    <Form>
                        <Header as='h3'>
                            <Input
                                placeholder='Template Title'
                                ref={this.titleRef}
                                id='input-title'
                                value={title}
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
                                    loading={fetching}
                                    value={bodySystem}
                                    options={bodySystemOptions}
                                    onChange={this.saveBodySystem}
                                    className='info-dropdown'
                                />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div>Disease</div>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    clearable
                                    allowAdditions
                                    placeholder='e.g. Diabetes'
                                    value={disease}
                                    options={diseaseOptions}
                                    disabled={bodySystem === ''}
                                    onChange={this.saveDisease}
                                    onAddItem={this.handleDiseaseAddition}
                                    className='info-dropdown'
                                />
                            </Grid.Column>
                        </Grid>
                    </Form>
                    <Nestable
                        items={this.createTreeData()}
                        handler={<Icon name='arrows alternate' />}
                        renderItem={this.renderItem}
                        renderCollapseIcon={this.renderCollapseIcon}
                        onChange={this.updateOrder}
                        threshold={50}
                    />
                    <Message
                        hidden={!reachedMax}
                        content={`You have reached the ${MAX_NUM_QUESTIONS} question limit. To expand this questionnaire further, you can connect it to another questionnaire.`}
                    />
                    {errors.length > 0 && (
                        <Message
                            error
                            header='The template must meet the following requirements'
                            list={errors}
                        />
                    )}
                    <Button
                        circular
                        icon='add'
                        onClick={() => this.addNQuestions(1)}
                        content='Add question'
                        className='add-question-button'
                        disabled={reachedMax}
                    />
                    <Button
                        circular
                        icon='save'
                        floated='right'
                        content='Save'
                        className='create-tmpl-button'
                        onClick={this.saveTemplate}
                        disabled={numQuestions === 1}
                    />
                </Dimmer.Dimmable>
            </>
        );
    }
}

export default EditTemplateForm;
