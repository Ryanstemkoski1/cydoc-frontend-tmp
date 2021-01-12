import React, { Component, Fragment } from 'react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import questionTypes from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';
import MedicalHistoryContent from 'pages/EditNote/content/medicalhistory/MedicalHistoryContent';
import SurgicalHistoryContent from 'pages/EditNote/content/surgicalhistory/SurgicalHistoryContent';
import MedicationsContent from 'pages/EditNote/content/medications/MedicationsContent';
import FamilyHistoryContent from 'pages/EditNote/content/familyhistory/FamilyHistoryContent';
import ImportQuestionForm from './ImportQuestionForm';
import {
    getAnswerInfo,
    createNodeId,
    sortEdges,
    updateParent,
    addChildrenNodes,
} from './util';
import {
    Input,
    Segment,
    Button,
    Dropdown,
    Message,
    List,
} from 'semantic-ui-react';

class TemplateAnswer extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            showOtherGraphs: false,
            otherGraph: null,
            showPreview: false,
            showQuestionSelect: false,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.connectGraph = this.connectGraph.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.addChildQuestion = this.addChildQuestion.bind(this);
        this.saveButtonOption = this.saveButtonOption.bind(this);
        this.addButtonOption = this.addButtonOption.bind(this);
        this.removeButtonOption = this.removeButtonOption.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    };

    showGraphOptions = () => {
        this.setState({ showOtherGraphs: true });
    };

    hideGraphOptions = () => {
        this.setState({ showOtherGraphs: false, otherGraph: null });
    };

    /**
     * @param {String} value: graph to be imported
     */
    saveGraphType = (e, { value }) => {
        this.setState({ otherGraph: value });
    };

    togglePreviewTable = () => {
        this.setState({ showPreview: !this.state.showPreview });
    };

    /**
     * Import top level questions from the selected `otherGraph` and its root if its text is not `nan`
     * @param {String} parent: qid of the nodes to connect the questions to
     */
    connectGraph = (e, { parent }) => {
        let { numQuestions, nextEdgeID } = this.context.state;
        const { otherGraph } = this.state;
        const { graph, edges, nodes } = this.props.graphData;

        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        const contextNodes = this.context.state.nodes;
        const contextEdges = this.context.state.edges;
        const contextGraph = this.context.state.graph;

        const id = diseaseCodes[otherGraph] + '0001';
        let questionParent = parent;
        updateParent(contextNodes, parent);

        if (id in graph) {
            // add the original root if the text is not "nan"
            if (nodes[id].text !== 'nan') {
                const rootId = createNodeId(diseaseCode, numQuestions);

                contextNodes[rootId] = {
                    id: rootId,
                    parent,
                    text: nodes[id].text,
                    responseType: nodes[id].responseType,
                    answerInfo: getAnswerInfo(nodes[id].responseType),
                    hasChanged: false,
                    originalId: id,
                };
                contextEdges[nextEdgeID] = {
                    from: parent,
                    to: rootId,
                };
                contextGraph[rootId] = [];
                contextGraph[parent].push(nextEdgeID);
                numQuestions++;
                nextEdgeID++;
                questionParent = rootId;
            }

            // sort edges by the node's question order
            sortEdges(graph[id], edges, nodes);

            // create edges and nodes for every new question
            let newCount = addChildrenNodes(
                questionParent,
                graph[id],
                otherGraph,
                diseaseCode,
                this.props.graphData,
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

            this.context.onContextChange('nodes', contextNodes);
            this.context.onContextChange('edges', contextEdges);
            this.context.onContextChange('graph', contextGraph);
            this.context.onContextChange('nextEdgeID', nextEdgeID);
            this.context.onContextChange('numQuestions', numQuestions);

            this.setState({
                showOtherGraphs: false,
                otherGraph: null,
            });
        }
    };

    /**
     * Updates the answer info of the target question.
     * @param {String} value: new answer value
     * @param {String} answer: the type of answerInfo
     */
    saveAnswer = (event, { value, answer }) => {
        const { qId } = this.props;
        const { nodes } = this.context.state;
        nodes[qId].answerInfo[answer] = value;
        updateParent(nodes, qId);
        this.context.onContextChange('nodes', nodes);
    };

    /**
     * Add a followup question to the target question in the context.
     * @param {String} parent: qid of the node to add the questions to
     */
    addChildQuestion = (event, { parent }) => {
        let numQuestions = this.context.state.numQuestions;
        let nextEdgeID = this.context.state.nextEdgeID;
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        const childId = createNodeId(diseaseCode, numQuestions);

        updateParent(this.context.state.nodes, parent);

        this.context.state.nodes[childId] = {
            id: childId,
            text: '',
            responseType: '',
            answerInfo: {},
            hasChanged: true,
        };

        this.context.state.edges[nextEdgeID] = {
            from: parent,
            to: childId,
        };
        this.context.state.graph[childId] = [];
        this.context.state.graph[parent].push(nextEdgeID);

        this.context.onContextChange('nodes', this.context.state.nodes);
        this.context.onContextChange('graph', this.context.state.graph);
        this.context.onContextChange('edges', this.context.state.edges);
        this.context.onContextChange('numQuestions', numQuestions + 1);
        this.context.onContextChange('nextEdgeID', nextEdgeID + 1);
    };

    /**
     * Updates the value of the option at the given index
     * @param {String} value: text value of the option
     * @param {Number} index: index of the option
     */
    saveButtonOption = (event, { value, index }) => {
        const { qId } = this.props;
        const { nodes } = this.context.state;
        nodes[qId].answerInfo.options[index] = value;
        updateParent(nodes, qId);
        this.context.onContextChange('nodes', nodes);
    };

    /**
     * Adds an amoty option to the target question and changes the response type
     * to POP if previously BLANK
     */
    addButtonOption = () => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].answerInfo.options.push('');
        updateParent(nodes, qId);

        // update response type from BLANK -> POP
        if (nodes[qId].responseType.endsWith('BLANK')) {
            const prefix = nodes[qId].responseType.split('-')[0];
            nodes[qId].responseType = prefix + '-POP';
        }

        this.context.onContextChange('nodes', nodes);
    };

    /**
     * Deletes the target option from the node's `answerInfo` and updates the node's response
     * type to BLANK if it was the last remaining option
     * @param {Number} index: index of the option to remove
     */
    removeButtonOption = (event, { index }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].answerInfo.options.splice(index, 1);
        updateParent(nodes, qId);

        // update response type from POP -> BLANK
        if (
            nodes[qId].answerInfo.options.length === 0 &&
            nodes[qId].responseType.endsWith('POP')
        ) {
            const prefix = nodes[qId].responseType.split('-')[0];
            nodes[qId].responseType = prefix + '-BLANK';
        }

        this.context.onContextChange('nodes', nodes);
    };

    /**
     * Returns the placeholder text to be displayed in the answer info
     */
    getExampleTexts() {
        const { type } = this.props;

        let startEg;
        let endEg;

        switch (type) {
            case 'SHORT-TEXT': {
                startEg = 'e.g. The pain is located in the';
                break;
            }
            case 'NUMBER': {
                startEg = 'e.g. The patient rates the pain at';
                endEg = 'e.g. out of 10.';
                break;
            }
            case 'TIME': {
                startEg = 'e.g. The pain started';
                endEg = 'e.g. ago.';
                break;
            }
            case 'LIST-TEXT': {
                startEg = 'e.g. The patient visited';
                endEg = 'e.g. while traveling.';
                break;
            }
            case 'CLICK-BOXES': {
                startEg = 'e.g. The patient has had a(n)';
                endEg = 'e.g. exam this year.';
                break;
            }
            default: {
                startEg = '';
                endEg = '';
                break;
            }
        }

        return { startEg, endEg };
    }

    /**
     * Returns the label text for questions with options
     */
    getOptionsText() {
        const { type } = this.props;
        let optionsText;
        let responseType = type.split('-')[0];
        if (!(responseType in questionTypes.advanced)) {
            responseType = type;
        }

        switch (responseType) {
            case 'CLICK-BOXES': {
                optionsText = 'Button options:';
                break;
            }
            case 'FH': {
                optionsText = 'Family history options:';
                break;
            }
            case 'PMH': {
                optionsText = 'Past medical history options:';
                break;
            }
            case 'MEDS': {
                optionsText = 'Medications options:';
                break;
            }
            case 'PSH': {
                optionsText = 'Past surgical history options:';
                break;
            }
            default: {
                optionsText = '';
                break;
            }
        }

        return optionsText;
    }

    /**
     * Returns a preview component for advanced typed questions that cannot be editted.
     * Its purpose is to give the user an idea of how the options will be rendered.
     * @param {String} type: the response type
     */
    getPreviewComponent = (type) => {
        const { windowWidth } = this.state;
        const { nodes } = this.context.state;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        let preview;
        let responseType = type.split('-')[0];
        if (!(responseType in questionTypes.advanced)) {
            responseType = type;
        }

        const values = nodes[this.props.qId].answerInfo.options;
        switch (responseType) {
            case 'FH':
                preview = (
                    <FamilyHistoryContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case 'MEDS':
                preview = (
                    <MedicationsContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case 'PMH':
                preview = (
                    <MedicalHistoryContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case 'PSH':
                preview = (
                    <SurgicalHistoryContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            default:
                break;
        }
        return preview;
    };

    /**
     * Changes whether the followup questions should be asked when YES or when NO
     * @param {String} value: "YES" or "NO"
     */
    changeFollowupType = (e, { value }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].responseType = value;
        updateParent(nodes, qId);
        this.context.onContextChange('nodes', nodes);
    };

    /**
     * Import all direct children of node with qId from the knowledge graph
     * (The graph fetched from the backend, not the context).
     *
     * @param {String} qId
     */
    editChildren = (qId) => {
        let { numQuestions, nextEdgeID } = this.context.state;
        const { graphData } = this.props;
        const { edges, nodes, graph } = graphData;

        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        const contextNodes = { ...this.context.state.nodes };
        const contextEdges = { ...this.context.state.edges };
        const contextGraph = { ...this.context.state.graph };

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

            this.context.onContextChange('nodes', contextNodes);
            this.context.onContextChange('edges', contextEdges);
            this.context.onContextChange('graph', contextGraph);
            this.context.onContextChange('nextEdgeID', nextEdgeID);
            this.context.onContextChange('numQuestions', numQuestions);
        }
        delete contextNodes[qId].hasChildren;
        this.context.onContextChange('nodes', contextNodes);
    };

    /**
     * Returns the component for displaying the response information according to the type
     * @param {String} startEg
     * @param {String} endEg
     * @param {String} optionsText
     */
    getAnswerTemplate(startEg, endEg, optionsText) {
        const { qId, type } = this.props;
        const { graph, nodes } = this.context.state;
        let template;
        let otherGraphs;

        if (type === 'YES-NO' || type === 'NO-YES') {
            let editChildren;
            if (this.state.showOtherGraphs) {
                // List all possible graphs to import from
                const options = this.props.allDiseases.map((disease) => ({
                    key: disease,
                    text: disease,
                    value: disease,
                }));

                otherGraphs = (
                    <Message compact onDismiss={this.hideGraphOptions}>
                        <Dropdown
                            search
                            fluid
                            selection
                            placeholder='Other Diseases'
                            direction='left'
                            options={options}
                            onChange={this.saveGraphType}
                            value={this.state.otherGraph}
                            className='connect-graph-options'
                        />
                        <div className='connect-graph-btns'>
                            <Button
                                parent={qId}
                                disabled={this.state.otherGraph === null}
                                onClick={this.connectGraph}
                            >
                                Connect to root
                            </Button>
                            <Button
                                parent={qId}
                                disabled={this.state.otherGraph === null}
                                onClick={() =>
                                    this.setState({ showQuestionSelect: true })
                                }
                            >
                                Select questions
                            </Button>
                            {this.state.showQuestionSelect && (
                                <ImportQuestionForm
                                    parent={qId}
                                    closeModal={() => {
                                        this.setState({
                                            showQuestionSelect: false,
                                        });
                                        this.hideGraphOptions();
                                    }}
                                    graphData={this.props.graphData}
                                    otherGraph={this.state.otherGraph}
                                />
                            )}
                        </div>
                    </Message>
                );
            } else {
                otherGraphs = (
                    <Button
                        basic
                        icon='upload'
                        parent={qId}
                        content='Connect to other graphs'
                        className='add-child-button'
                        onClick={this.showGraphOptions}
                    />
                );
            }
            if (
                this.context.state.nodes[qId].hasChildren &&
                !this.context.state.nodes[qId].hasChanged
            ) {
                // If the question is an unchanged, imported question with children, display a button
                // rather than actually displaying all of the children
                editChildren = (
                    <List
                        className='edit-children'
                        onClick={() =>
                            this.props.editChildren(
                                qId,
                                this.context.state.nodes
                            )
                        }
                    >
                        <List.Item>
                            <List.Icon name='triangle right' />
                            Edit follow up questions
                        </List.Item>
                    </List>
                );
            }

            template = (
                <Segment className='yes-no-answer'>
                    {['yes', 'no'].map((type, idx) => {
                        const answer = type + 'Response';
                        const action = type === 'yes' ? 'has' : 'does not have';

                        return (
                            <Fragment key={idx}>
                                <span
                                    className={`answer-label answer-label-if-${type}`}
                                >
                                    IF {type.toUpperCase()}:
                                </span>
                                <Input
                                    placeholder={`e.g. The patient ${action} pain.`}
                                    answer={answer}
                                    value={
                                        this.context.state.nodes[qId]
                                            .answerInfo[answer]
                                    }
                                    onChange={this.saveAnswer}
                                    className='yes-no-input'
                                />
                                {idx === 0 && <br />}
                            </Fragment>
                        );
                    })}
                    <div className='add-child-question'>
                        <Button
                            basic
                            icon='add'
                            parent={qId}
                            content='Add follow-up question'
                            onClick={this.addChildQuestion}
                            className='add-child-button'
                        />
                    </div>
                    <div className='connect-graph'>{otherGraphs}</div>
                    {graph[qId].length > 0 && (
                        <div className='choose-yes-no'>
                            <p>
                                Ask the follow-up questions if the patient
                                answers
                            </p>
                            <Button
                                value='YES-NO'
                                className='yes-no-btn'
                                onClick={this.changeFollowupType}
                                content='YES'
                                color={
                                    nodes[qId].responseType === 'YES-NO'
                                        ? 'violet'
                                        : 'grey'
                                }
                            />
                            <Button
                                value='NO-YES'
                                content='NO'
                                className='yes-no-btn'
                                onClick={this.changeFollowupType}
                                color={
                                    nodes[qId].responseType === 'NO-YES'
                                        ? 'violet'
                                        : 'grey'
                                }
                            />
                        </div>
                    )}
                    {editChildren}
                </Segment>
            );
        } else if (
            type === 'SHORT-TEXT' ||
            type === 'NUMBER' ||
            type === 'TIME' ||
            type === 'LIST-TEXT'
        ) {
            template = (
                <Segment className='yes-no-answer'>
                    <Input
                        placeholder={startEg}
                        answer='startResponse'
                        value={
                            this.context.state.nodes[qId].answerInfo
                                .startResponse
                        }
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                    <span className='answer-label'>RESPONSE</span>
                    <Input
                        placeholder={endEg}
                        answer='endResponse'
                        value={
                            this.context.state.nodes[qId].answerInfo.endResponse
                        }
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                </Segment>
            );
        } else if (type === 'CLICK-BOXES') {
            const options = [];
            for (
                let i = 0;
                i < this.context.state.nodes[qId].answerInfo.options.length;
                i++
            ) {
                options.push(
                    <div className='button-option' key={i}>
                        <Button
                            basic
                            circular
                            icon='remove'
                            size='mini'
                            index={i}
                            onClick={this.removeButtonOption}
                            className='minus-button'
                        />
                        <Input
                            transparent
                            placeholder='Option'
                            index={i}
                            value={
                                this.context.state.nodes[qId].answerInfo
                                    .options[i]
                            }
                            onChange={this.saveButtonOption}
                        />
                    </div>
                );
            }

            template = (
                <Segment className='yes-no-answer'>
                    <div>{optionsText}</div>
                    {options}
                    <Button
                        basic
                        icon='add'
                        size='small'
                        content='Add option'
                        onClick={this.addButtonOption}
                        className='add-option'
                    />
                    <br />
                    <Input
                        placeholder={startEg}
                        answer='startResponse'
                        value={
                            this.context.state.nodes[qId].answerInfo
                                .startResponse
                        }
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                    <span className='answer-label'>RESPONSE</span>
                    <Input
                        placeholder={endEg}
                        answer='endResponse'
                        value={
                            this.context.state.nodes[qId].answerInfo.endResponse
                        }
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                </Segment>
            );
        } else if (
            type.startsWith('FH') ||
            type.startsWith('PMH') ||
            type.startsWith('PSH') ||
            type.startsWith('MEDS')
        ) {
            const options = [];
            for (
                let i = 0;
                i < this.context.state.nodes[qId].answerInfo.options.length;
                i++
            ) {
                options.push(
                    <div className='button-option' key={i}>
                        <Button
                            basic
                            circular
                            icon='remove'
                            size='mini'
                            index={i}
                            onClick={this.removeButtonOption}
                            className='minus-button'
                        />
                        <Input
                            transparent
                            placeholder='Option'
                            index={i}
                            value={
                                this.context.state.nodes[qId].answerInfo
                                    .options[i]
                            }
                            onChange={this.saveButtonOption}
                        />
                    </div>
                );
            }
            // Questions of advanced types have a preview feature. Allow this to be toggled on/off
            // since its quite spacious.
            let preview;
            if (this.state.showPreview) {
                preview = this.getPreviewComponent(type);
            }

            template = (
                <Segment className='yes-no-answer'>
                    <div>{optionsText}</div>
                    {options}
                    <Button
                        basic
                        icon='add'
                        size='small'
                        content='Add option'
                        onClick={this.addButtonOption}
                        className='add-option-pop'
                    />
                    <Button
                        basic
                        size='small'
                        icon={
                            this.state.showPreview
                                ? 'search minus'
                                : 'search plus'
                        }
                        content={
                            this.state.showPreview
                                ? 'Hide table'
                                : 'Preview table'
                        }
                        onClick={this.togglePreviewTable}
                        className='preview-table-btn'
                    />
                    <span className='preview'>{preview}</span>
                </Segment>
            );
        } else {
            template = <Fragment />;
        }

        return template;
    }

    render() {
        const exampleTexts = this.getExampleTexts();
        const optionsText = this.getOptionsText();

        return this.getAnswerTemplate(
            exampleTexts.startEg,
            exampleTexts.endEg,
            optionsText
        );
    }
}

export default TemplateAnswer;
