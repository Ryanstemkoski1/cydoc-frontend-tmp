import React, { Component, Fragment } from 'react';
import { Input, Segment, Button, Dropdown, Divider, Popup } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import questionTypes from 'constants/questionTypes';
import diseaseCodes from 'constants/diseaseCodes';
import { PATIENT_HISTORY_MOBILE_BP } from "constants/breakpoints";
import MedicalHistoryContent from "pages/EditNote/content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "pages/EditNote/content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "pages/EditNote/content/medications/MedicationsContent";
import FamilyHistoryContent from 'pages/EditNote/content/familyhistory/FamilyHistoryContent';

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
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.addChildQuestion = this.addChildQuestion.bind(this);
        this.saveButtonOption = this.saveButtonOption.bind(this);
        this.addButtonOption = this.addButtonOption.bind(this);
        this.removeButtonOption = this.removeButtonOption.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    showGraphOptions = () => {
        this.setState({ showOtherGraphs: true });
    }

    hideGraphOptions = () => {
        this.setState({ showOtherGraphs: false, otherGraph: null });
    }

    saveGraphType = (e, { value }) => {
        this.setState({ otherGraph: value });
    }

    togglePreviewTable = () => {
        this.setState({ showPreview: !this.state.showPreview });
    }

    getAnswerInfo = (type) => {
        if (type === 'YES-NO' || type === 'NO-YES') {
            return {
                yesResponse: '',
                noResponse: '',
            }
        } else if (type === 'SHORT-TEXT'
        || type === 'NUMBER'
        || type === 'TIME'
        || type === 'LIST-TEXT') {
            return {
                startResponse: '',
                endResponse: '',
            }
        } else if (type === 'CLICK-BOXES') {
            return {
                options: ['', '', ''],
                startResponse: '',
                endResponse: '',
            }
        } else if (type.startsWith('FH')
        || type.startsWith('PMH')
        || type.startsWith('PSH')
        || type.startsWith('MEDS')) {
            return {
                options: [],
            }
        }
    }

    /**
     * Imports top level questions from selected `otherGraph`
     */
    connectGraph = (e, { parent }) => {
        let { numQuestions, numEdges } = this.context.state;
        const { otherGraph } = this.state;
        const { graph, edges, nodes } = this.props.graphData;
        
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        
        let randomId;
        let numZeros;
        let childId;

        const contextNodes = { ...this.context.state.nodes };
        const contextEdges = { ...this.context.state.edges };
        const contextGraph = { ...this.context.state.graph };

        const id = diseaseCodes[otherGraph] + '0001';
        let questionParent = parent;
        if (id in graph) {
            // add the original root if the text is not "nan"
            if (nodes[id].text !== 'nan') {
                randomId = Math.floor(Math.random() * 9000000000) + 1000000000;
                numZeros = 4 - numQuestions.toString().length;
                const rootId = diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();
  
                contextNodes[rootId] = {
                    id: rootId,
                    text: nodes[id].text,
                    responseType: nodes[id].responseType,
                    answerInfo: this.getAnswerInfo(nodes[id].responseType),
                    order: numQuestions,
                }
                contextEdges[numEdges] = {
                    from: parent,
                    to: rootId,
                }
                contextGraph[rootId] = [];
                contextGraph[parent].push(numEdges)
                numQuestions++;
                numEdges++;
                questionParent = rootId;
            }

            // sort edges by the node's question order
            graph[id].sort((a, b) => {
                const nodeA = parseFloat(nodes[edges[a].from].questionOrder);
                const nodeB = parseFloat(nodes[edges[b].from].questionOrder);
                
                if (nodeA < nodeB) {
                    return -1;
                } else if (nodeA > nodeB) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // create edges and nodes for every new question
            for (let edge of graph[id]) {
                randomId = Math.floor(Math.random() * 9000000000) + 1000000000;
                numZeros = 4 - numQuestions.toString().length;
                childId = diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();
                
                const nodeId = edges[edge].from;
                let type = nodes[nodeId].responseType;
                let responseType;

                // convert response type to the human readable version
                if (type in questionTypes.basic) {
                    responseType = questionTypes.basic[type];
                } else {
                    const advType = type.split("-");
                    type = advType[0];
                    responseType = questionTypes.advanced[type];
                }

                let text = nodes[nodeId].text;
                if (text === 'nan') {
                    // TODO: Some root questions are connected to other root questions
                    // In these cases, and the questions are nans, do we import the other
                    // root's children or skip over it?
                    continue;
                }
                let answerInfo = this.getAnswerInfo(type);
                let placeholder = text.search(/SYMPTOM|DISEASE/);
                if (placeholder > -1) {
                    // replace occurrences of SYMPTOM or DISEASE with disease itself
                    text = text.substring(0, placeholder) + otherGraph.toLowerCase() + text.substring(placeholder +7)
                }
                // preprocess the text to prepopulate the answerinfo if necessary
                if (type === 'CLICK-BOXES' || nodes[nodeId].responseType.slice(-3, responseType.length) === 'POP' || responseType === 'nan') {
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
                contextNodes[childId] = {
                    text,
                    answerInfo,
                    responseType,
                    id: childId,
                    order: numQuestions,
                }

                contextEdges[numEdges] = {
                    from: questionParent,
                    to: childId,
                }

                contextGraph[childId] = [];
                contextGraph[questionParent].push(numEdges)
                numEdges++;
                numQuestions++;
            }
            this.context.onContextChange('nodes', contextNodes);
            this.context.onContextChange('edges', contextEdges);
            this.context.onContextChange('graph', contextGraph);
            this.context.onContextChange('numEdges', numEdges);
            this.context.onContextChange('numQuestions', numQuestions);
            
            this.setState({
                showOtherGraphs: false,
                otherGraph: null,
            });
        }
    }

    saveAnswer = (event, { value, answer }) => {
        const { qId } = this.props;
        this.context.state.nodes[qId].answerInfo[answer] = value;
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    addChildQuestion = (event, { parent }) => {
        let numQuestions = this.context.state.numQuestions;
        let numEdges = this.context.state.numEdges;
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        const randomId = Math.floor(Math.random() * 9000000000) + 1000000000;

        const numZeros = 4 - numQuestions.toString().length;
        const childId = diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();

        this.context.state.nodes[childId] = {
            id: childId,
            text: '',
            responseType: '',
            order: numQuestions,
            answerInfo: {},
        };

        this.context.state.edges[numEdges] = {
            from: parent,
            to: childId,
        };
        this.context.state.graph[childId] = [];
        this.context.state.graph[parent].push(numEdges);

        this.context.onContextChange('nodes', this.context.state.nodes);
        this.context.onContextChange('graph', this.context.state.graph);
        this.context.onContextChange('edges', this.context.state.edges);
        this.context.onContextChange('numQuestions', numQuestions + 1);
        this.context.onContextChange('numEdges', numEdges + 1);
    }

    saveButtonOption = (event, { value, index }) => {
        const { qId } = this.props;
        this.context.state.nodes[qId].answerInfo.options[index] = value;
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    addButtonOption = (event) => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].answerInfo.options.push('');
        
        // update response type from BLANK -> POP
        if (nodes[qId].responseType.endsWith("BLANK")) {
            const prefix = nodes[qId].responseType.split("-")[0];
            nodes[qId].responseType = prefix + '-POP';
        }

        this.context.onContextChange('nodes', nodes);
    }

    removeButtonOption = (event, { index }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].answerInfo.options.splice(index, 1);

        // update response type from POP -> BLANK
        if (nodes[qId].answerInfo.options.length === 0 
            && nodes[qId].responseType.endsWith('POP')) {
            const prefix = nodes[qId].responseType.split("-")[0];
            nodes[qId].responseType = prefix + "-BLANK";
        }

        this.context.onContextChange('nodes', nodes);
    }

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

        return {startEg, endEg};
    }

    getOptionsText() {
        const { type } = this.props;
        let optionsText;
        let responseType = type.split("-")[0];
        if (!(responseType in questionTypes.advanced)) {
            responseType = type;
        }

        switch(responseType) {
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

    getPreviewComponent = (type) => {
        const { windowWidth } = this.state;
        const { nodes } = this.context.state;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        let preview;
        const responseType = type.split('-')[0];
        if (!(responseType in questionTypes.advanced)) {
            responseType = type;
        }

        const values = nodes[this.props.qId].answerInfo.options;
        switch (responseType) {
            case "FH":
                preview = (
                    <FamilyHistoryContent 
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case "MEDS":
                preview = (
                    <MedicationsContent 
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case "PMH":
                preview = (
                    <MedicalHistoryContent 
                        isPreview={true}
                        mobile={collapseTabs}
                        values={values}
                    />
                );
                break;
            case "PSH":
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
    }

    changeFollowupType = (e, { value }) => {
        const { qId } = this.props;
        const nodes = { ...this.context.state.nodes };
        nodes[qId].responseType = value;
        this.context.onContextChange('nodes', nodes);
    }

    getAnswerTemplate(startEg, endEg, optionsText) {
        const { qId, type } = this.props;
        const { graph, nodes } = this.context.state;
        let template;
        let otherGraphs;

        if (type === 'YES-NO'|| type === 'NO-YES') {
            if (this.state.showOtherGraphs) {
                const options = this.props.allDiseases.map((disease) => (
                    {
                        key: disease,
                        text: disease,
                        value: disease,
                    }
                ));

                otherGraphs = (
                    <Fragment>
                        <Dropdown
                            search
                            selection
                            placeholder='Other Diseases'
                            direction='left'
                            options={options}
                            onChange={this.saveGraphType}
                            value={this.state.otherGraph}
                        />
                        <Popup
                            on='click'
                            trigger={
                                <Button 
                                    basic
                                    icon='arrow right'
                                    circular
                                    disabled={this.state.otherGraph === null}
                                    className='connect-button'
                                />
                            }
                            content={
                                <Button.Group vertical className='connect-graph-btns'>
                                    <Button
                                        basic
                                        fluid
                                        parent={qId}
                                        onClick={this.connectGraph}
                                    >
                                        Connect to root
                                    </Button>
                                    <Divider fitted/>
                                    <Button
                                        basic
                                        fluid
                                        parent={qId}
                                    >
                                        Connect select questions
                                    </Button>
                                </Button.Group>
                            }
                        />
                        <Button 
                            basic
                            icon='cancel'
                            onClick={this.hideGraphOptions}
                            className='cancel-button'
                        />
                    </Fragment>
                );
            } else {
                otherGraphs = (
                    <Button
                        basic
                        parent={qId}
                        content='Connect to other graphs'
                        className='add-child-button'
                        onClick={this.showGraphOptions}
                    />
                );
            }

            template = (
                <Segment className='yes-no-answer'>
                    { ['yes', 'no'].map((type, idx) => {
                        const answer = type + "Response";
                        const action = type === "yes" ? "has" : "does not have";
                        
                        return (
                            <Fragment key={idx}>
                                <span className={`answer-label answer-label-if-${type}`}>
                                IF {type.toUpperCase()}:
                                </span>
                                <Input
                                    placeholder={`e.g. The patient ${action} pain.`}
                                    answer={answer}
                                    value={this.context.state.nodes[qId].answerInfo[answer]}
                                    onChange={this.saveAnswer}
                                    className='yes-no-input'
                                />
                                {idx === 0 && (<br/>)}
                            </Fragment>
                        )

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
                        {otherGraphs}
                    </div>
                    { graph[qId].length > 0
                        && (
                            <div className='choose-yes-no'>
                                <p>
                                    Ask the follow-up questions if the patient answers
                                </p>
                                <Button 
                                    value='YES-NO'
                                    className='yes-no-btn'
                                    onClick={this.changeFollowupType}
                                    content='YES'
                                    color={nodes[qId].responseType === 'YES-NO' ? 'violet' : 'grey'}
                                    />
                                <Button
                                    value='NO-YES'
                                    content='NO'
                                    className='yes-no-btn'
                                    onClick={this.changeFollowupType}
                                    color={nodes[qId].responseType === 'NO-YES' ? 'violet' : 'grey'}
                                />
                            </div>
                        )

                    }
                </Segment>
            );
        } else if (type === 'SHORT-TEXT'
        || type === 'NUMBER'
        || type === 'TIME'
        || type === 'LIST-TEXT') {
            template = (
                <Segment className='yes-no-answer'>
                    <Input
                        placeholder={startEg}
                        answer='startResponse'
                        value={this.context.state.nodes[qId].answerInfo.startResponse}
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                    <span className='answer-label'>
                        RESPONSE
                    </span>
                    <Input
                        placeholder={endEg}
                        answer='endResponse'
                        value={this.context.state.nodes[qId].answerInfo.endResponse}
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                </Segment>
            );
        } else if (type === 'CLICK-BOXES') {
            const options = [];
            for (let i = 0; i < this.context.state.nodes[qId].answerInfo.options.length; i++) {
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
                            value={this.context.state.nodes[qId].answerInfo.options[i]}
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
                        value={this.context.state.nodes[qId].answerInfo.startResponse}
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                    <span className='answer-label'>
                        RESPONSE
                    </span>
                    <Input
                        placeholder={endEg}
                        answer='endResponse'
                        value={this.context.state.nodes[qId].answerInfo.endResponse}
                        onChange={this.saveAnswer}
                        className='fill-in-the-blank-input'
                    />
                </Segment>
            );
        } else if (type.startsWith('FH')
        || type.startsWith('PMH')
        || type.startsWith('PSH')
        || type.startsWith('MEDS')) {
            const options = [];
            for (let i = 0; i < this.context.state.nodes[qId].answerInfo.options.length; i++) {
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
                            value={this.context.state.nodes[qId].answerInfo.options[i]}
                            onChange={this.saveButtonOption}
                        />
                    </div>
                );
            }
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
                        icon={this.state.showPreview ? "search minus": "search plus"}
                        content={this.state.showPreview ? "Hide table" : "Preview table"}
                        onClick={this.togglePreviewTable}
                        className='preview-table-btn'
                    />
                    <span className='preview'>
                       {preview}
                    </span>
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

        return this.getAnswerTemplate(exampleTexts.startEg, exampleTexts.endEg, optionsText);
    }
}

export default TemplateAnswer;