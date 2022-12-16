import React, { Component } from 'react';
import HPITemplateContext from '../../contexts/HPITemplateContext';
import { questionTypeMapping, questionTypes } from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';
import MedicalHistoryContent from 'pages/EditNote/content/medicalhistory/MedicalHistoryContent';
import SurgicalHistoryContent from 'pages/EditNote/content/surgicalhistory/SurgicalHistoryContent';
import MedicationsContent from 'pages/EditNote/content/medications/MedicationsContent';
import FamilyHistoryContent from 'pages/EditNote/content/familyhistory/FamilyHistoryContent';
import ImportQuestionForm from './modules/ImportQuestionForm';
import GeneratedSentence from './modules/GeneratedSentence';
import {
    getAnswerInfo,
    createNodeId,
    sortEdges,
    updateParent,
    addChildrenNodes,
} from './util';
import { RESPONSE_PLACEHOLDER } from './placeholders';
import { Input, Button, Dropdown, Message, List } from 'semantic-ui-react';
import { graphClient } from 'constants/api';
const MIN_OPTIONS = 2;

class TemplateAnswer extends Component {
    static contextType = HPITemplateContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            showOtherGraphs: false,
            otherGraph: null,
            showPreview: false,
            showQuestionSelect: false,
            showOptionError: false,
            fetchingImport: false,
            showNonanswer: false,
            showPreviewSentence: false,
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

    componentDidUpdate(prevProps) {
        // Reset error message state when question type changes
        if (
            prevProps.type !== this.props.type &&
            prevProps.type === questionTypes.CLICK_BOXES
        ) {
            this.setState({ showOptionError: false });
        }
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

    fetchCydocGraph = async (category) => {
        const { parentNodes, cydocGraphs } = this.context.template;
        const medID = Object.values(parentNodes[category])[0];
        // Skip roots already cached in the context
        if (!(medID in cydocGraphs.graph)) {
            const res = await graphClient.get(`/graph/subgraph/${medID}/4`);
            this.context.addCydocGraphs(res.data);
        }
        return medID;
    };

    /**
     * Import top level questions from the selected `otherGraph` and its root if its text is not `nan`
     * @param {String} parent: qid of the nodes to connect the questions to
     */
    connectGraph = async (_e, { parent }) => {
        this.setState({ fetchingImport: true });

        const { otherGraph } = this.state;
        const id = await this.fetchCydocGraph(otherGraph);

        let { numQuestions, nextEdgeID, cydocGraphs } = this.context.template;
        const { graph, edges, nodes } = cydocGraphs;

        const {
            disease,
            nodes: contextNodes,
            edges: contextEdges,
            graph: contextGraph,
        } = this.context.template;

        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);

        let questionParent = parent;
        updateParent(contextNodes, parent);

        if (id in graph) {
            // Keep original root if it's an actual question
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
            sortEdges(graph[id], edges);

            // create edges and nodes for every new question
            let newCount = addChildrenNodes(
                questionParent,
                graph[id],
                otherGraph,
                diseaseCode,
                cydocGraphs,
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
                nextEdgeID,
                numQuestions,
                nodes: contextNodes,
                edges: contextEdges,
                graph: contextGraph,
            });

            this.setState({
                showOtherGraphs: false,
                otherGraph: null,
                fetchingImport: false,
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
        const { nodes } = this.context.template;
        nodes[qId].answerInfo[answer] = value;
        updateParent(nodes, qId);
        this.context.onTemplateChange('nodes', nodes);
        this.setState({ showOptionError: false });
    };

    /**
     * Add a followup question to the target question in the context.
     * @param {String} parent: qid of the node to add the questions to
     */
    addChildQuestion = (event, { parent }) => {
        let { numQuestions, nextEdgeID } = this.context.template;
        const { graph, edges, nodes, disease } = this.context.template;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        const childId = createNodeId(diseaseCode, numQuestions);

        updateParent(nodes, parent);

        nodes[childId] = {
            id: childId,
            text: '',
            responseType: '',
            answerInfo: {},
            hasChanged: true,
        };

        edges[nextEdgeID] = {
            from: parent,
            to: childId,
        };
        graph[childId] = [];
        graph[parent].push(nextEdgeID);
        numQuestions++;
        nextEdgeID++;

        this.context.updateTemplate({
            nodes,
            graph,
            edges,
            numQuestions,
            nextEdgeID,
        });
    };

    /**
     * Updates the value of the option at the given index
     * @param {String} value: text value of the option
     * @param {Number} index: index of the option
     */
    saveButtonOption = (event, { value, index }) => {
        const { qId } = this.props;
        const { nodes } = this.context.template;
        nodes[qId].answerInfo.options[index] = value;
        updateParent(nodes, qId);
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Adds an amoty option to the target question and changes the response type
     * to POP if previously BLANK
     */
    addButtonOption = () => {
        const { qId } = this.props;
        const nodes = { ...this.context.template.nodes };
        nodes[qId].answerInfo.options.push('');
        updateParent(nodes, qId);
        this.setState({ showOptionError: false });

        // update response type from BLANK -> POP
        if (nodes[qId].responseType.endsWith('BLANK')) {
            const prefix = nodes[qId].responseType.split('-')[0];
            nodes[qId].responseType = prefix + '-POP';
        }

        this.context.onTemplateChange('nodes', nodes);
    };

    toggleShowNonanswer = () => {
        const { nodes } = this.context.template;
        const { qId } = this.props;
        if (this.state.showNonanswer) {
            delete nodes[qId].answerInfo.negEndResponse;
        } else {
            nodes[qId].answerInfo = {
                ...nodes[qId].answerInfo,
                negEndResponse: '',
            };
        }
        this.setState({
            showNonanswer: !this.state.showNonanswer,
        });
        this.context.onTemplateChange('nodes', nodes);
    };

    toggleShowPreviewSentence = () => {
        this.setState({
            showPreviewSentence: !this.state.showPreviewSentence,
        });
        const { nodes } = this.context.template;
        const { qId } = this.props;
        nodes[qId].answerInfo = {
            ...nodes[qId].answerInfo,
            negEndResponse: '',
        };
        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Deletes the target option from the node's `answerInfo` and updates the node's response
     * type to BLANK if it was the last remaining option
     * @param {Number} index: index of the option to remove
     */
    removeButtonOption = (event, { index }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.template.nodes };
        if (
            nodes[qId].responseType in questionTypeMapping.basic &&
            nodes[qId].answerInfo.options.length <= MIN_OPTIONS
        ) {
            this.setState({ showOptionError: true });
            return;
        }
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

        this.context.onTemplateChange('nodes', nodes);
    };

    /**
     * Returns a preview component for advanced typed questions that cannot be editted.
     * Its purpose is to give the user an idea of how the options will be rendered.
     * @param {String} type: the response type
     */
    getPreviewComponent = (type) => {
        const { windowWidth } = this.state;
        const { nodes } = this.context.template;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        let preview;
        let responseType = type.split('-')[0];
        if (!(responseType in questionTypeMapping.advanced)) {
            responseType = type;
        }

        const values = nodes[this.props.qId].answerInfo.options;
        switch (responseType) {
            case questionTypes.FH:
                preview = (
                    <FamilyHistoryContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case questionTypes.MEDS:
                preview = (
                    <MedicationsContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case questionTypes.PMH:
                preview = (
                    <MedicalHistoryContent
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case questionTypes.PSH:
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
     * Returns a string preview of the sentence that would be generated. Its
     * purpose is to give the user an idea of how the options will be rendered,
     * especially when NONANSWER is used.
     *
     * It randomly uses the first half of the options for ANSWER. If no
     * blanks were provided, nor answers were provided, the placeholder values
     * are used instead.
     */
    getPreviewSentence = () => {};

    /**
     * Changes whether the followup questions should be asked when YES or when NO
     * @param {String} value: "YES" or "NO"
     */
    changeFollowupType = (e, { value }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.template.nodes };
        nodes[qId].responseType = value;
        updateParent(nodes, qId);
        this.context.onTemplateChange('nodes', nodes);
        this.setState({ showOptionError: false });
    };

    /** Returns response form according to the response type */
    getAnswerTemplate() {
        const { qId, type } = this.props;
        const { graph, nodes, parentNodes = {} } = this.context.template;
        const placeholders = RESPONSE_PLACEHOLDER[nodes[qId].responseType];
        let template, otherGraphs;

        let optionsText = '';
        if (type.endsWith('POP') || type.endsWith('BLANK')) {
            let typeKey = type.split('-')[0];
            optionsText = questionTypeMapping.advanced[typeKey] + ' Options:';
        } else {
            optionsText = questionTypeMapping.basic[type] + ' Options:';
        }

        if (type === questionTypes.YES_NO || type === questionTypes.NO_YES) {
            let editChildrenPrompt;
            if (this.state.showOtherGraphs) {
                // List all possible graphs to import from
                const options = Object.keys(parentNodes).map((disease) => ({
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
                                loading={this.state.fetchingImport}
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
                                    otherGraph={this.state.otherGraph}
                                    fetchCydocGraph={this.fetchCydocGraph}
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
            if (nodes[qId].hasChildren && !nodes[qId].hasChanged) {
                // If the question is an unchanged, imported question with children,
                // display a button rather than actually displaying all of the children
                editChildrenPrompt = (
                    <List
                        className='edit-children'
                        onClick={() => this.props.editChildren(qId, nodes)}
                    >
                        <List.Item>
                            <List.Icon name='triangle right' />
                            Edit follow up questions
                        </List.Item>
                    </List>
                );
            }

            template = (
                <>
                    {['yes', 'no'].map((type, idx) => {
                        const answer = type + 'Response';
                        return (
                            <>
                                <span
                                    className={`answer-label answer-label-if-${type}`}
                                >
                                    IF {type.toUpperCase()}:
                                </span>
                                <Input
                                    placeholder={placeholders[type]}
                                    answer={answer}
                                    value={nodes[qId].answerInfo[answer]}
                                    onChange={this.saveAnswer}
                                    className='yes-no-input'
                                />
                                {idx === 0 && <br />}
                            </>
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
                                value={questionTypes.YES_NO}
                                className='yes-no-btn'
                                onClick={this.changeFollowupType}
                                content='YES'
                                color={
                                    nodes[qId].responseType ===
                                    questionTypes.YES_NO
                                        ? 'violet'
                                        : 'grey'
                                }
                            />
                            <Button
                                value={questionTypes.NO_YES}
                                content='NO'
                                className='yes-no-btn'
                                onClick={this.changeFollowupType}
                                color={
                                    nodes[qId].responseType ===
                                    questionTypes.NO_YES
                                        ? 'violet'
                                        : 'grey'
                                }
                            />
                        </div>
                    )}
                    {editChildrenPrompt}
                </>
            );
        } else if (
            type === questionTypes.SHORT_TEXT ||
            type === questionTypes.NUMBER ||
            type === questionTypes.TIME ||
            type === questionTypes.BODY_LOCATION ||
            type === questionTypes.LIST_TEXT
        ) {
            template = (
                <GeneratedSentence
                    onChange={this.saveAnswer}
                    answerInfo={nodes[qId].answerInfo}
                    placeholders={placeholders}
                />
            );
        } else if (type === questionTypes.CLICK_BOXES) {
            const options = [];
            for (let i = 0; i < nodes[qId].answerInfo.options.length; i++) {
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
                            placeholder={placeholders.options[i]}
                            index={i}
                            value={nodes[qId].answerInfo.options[i]}
                            onChange={this.saveButtonOption}
                            onBlur={() =>
                                this.setState({ showOptionError: false })
                            }
                        />
                    </div>
                );
            }

            template = (
                <>
                    <label>{optionsText}</label>
                    {options}
                    {this.state.showOptionError && (
                        <span className='form-error'>
                            * Required to have at least {MIN_OPTIONS} options
                        </span>
                    )}
                    <Button
                        basic
                        icon='add'
                        size='small'
                        content='Add option'
                        onClick={this.addButtonOption}
                        className='add-option'
                    />
                    <br />
                    <GeneratedSentence
                        onChange={this.saveAnswer}
                        answerInfo={nodes[qId].answerInfo}
                        placeholders={placeholders}
                        responseText='SELECTED'
                        useNonanswer={this.state.showNonanswer}
                    />
                    <Button
                        basic
                        size='small'
                        icon={
                            this.state.showNonanswer
                                ? 'minus square outline'
                                : 'plus square outline'
                        }
                        content={
                            this.state.showNonanswer
                                ? 'Hide unselected options'
                                : 'Include unselected options'
                        }
                        onClick={this.toggleShowNonanswer}
                        className='add-option-pop'
                    />
                    <Button
                        basic
                        size='small'
                        icon={
                            this.state.showPreviewSentence
                                ? 'search minus'
                                : 'search plus'
                        }
                        content={
                            this.state.showPreviewSentence
                                ? 'Hide sentence'
                                : 'Preview sentence'
                        }
                        onClick={this.toggleShowPreviewSentence}
                        className='add-option-pop'
                    />
                </>
            );
        } else if (
            type.startsWith(questionTypes.FH) ||
            type.startsWith(questionTypes.PMH) ||
            type.startsWith(questionTypes.PSH) ||
            type.startsWith(questionTypes.MEDS)
        ) {
            const options = [];
            for (let i = 0; i < nodes[qId].answerInfo.options.length; i++) {
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
                            value={nodes[qId].answerInfo.options[i]}
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
                <>
                    <label>{optionsText}</label>
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
                </>
            );
        } else {
            template = <></>;
        }
        return <div className='template-answer'>{template}</div>;
    }

    render() {
        return this.getAnswerTemplate();
    }
}

export default TemplateAnswer;
