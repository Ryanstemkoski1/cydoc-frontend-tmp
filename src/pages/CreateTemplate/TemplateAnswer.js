import React, { Component, Fragment } from 'react';
import { Input, Segment, Button, Dropdown, Icon } from 'semantic-ui-react';
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

    updateDimensions() {
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
        || type.startsWith('MEDS')) {
            return {
                options: ['', '', ''],
            }
        }
    }

    connectGraph = (e, { parent }) => {
        let numQuestions = this.context.state.numQuestions;
        let numEdges = this.context.state.numQuestions;
        const { otherGraph } = this.state;
        const { graph, edges, nodes } = this.props.graphData;
        
        const disease = this.context.state.disease;
        const diseaseCode = diseaseCodes[disease] || disease.slice(0, 3);
        
        let randomId;
        let numZeros;
        let childId;

        const id = diseaseCodes[otherGraph] + '0001';
        if (id in graph) {
            // create edges and nodes for every new question
            for (let edge of graph[id]) {
                randomId = Math.floor(Math.random() * 9000000000) + 1000000000;
                numZeros = 4 - numQuestions.toString().length;
                childId = diseaseCode + '-' + randomId.toString() + '-' + '0'.repeat(numZeros) + numQuestions.toString();
                
                const nodeId = edges[edge].from;
                this.context.state.nodes[childId] = {
                    id: childId,
                    text: nodes[nodeId].text,
                    type: nodes[nodeId].type,
                    order: numQuestions,
                    answerInfo: this.getAnswerInfo(nodes[nodeId].type),
                }

                this.context.state.edges[numEdges] = {
                    from: parent,
                    to: childId,
                }

                this.context.state.graph[childId] = [];
                this.context.state.graph[parent].push(numEdges)
                numEdges++;
                numQuestions++;
            }
            this.context.onContextChange('nodes', this.context.state.nodes);
            this.context.onContextChange('edges', this.context.state.edges);
            this.context.onContextChange('graph', this.context.state.graph);
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
            type: '',
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
        this.context.state.nodes[qId].answerInfo.options.push('');
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    removeButtonOption = (event, { index }) => {
        const { qId } = this.props;
        this.context.state.nodes[qId].answerInfo.options.splice(index, 1);
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    getExampleTexts() {
        const { type } = this.props;

        let startEg;
        let endEg;

        switch (type) {
            case questionTypes.basic['SHORT-TEXT']: {
                startEg = 'e.g. The pain is located in the';
                break;
            }
            case questionTypes.basic['NUMBER']: {
                startEg = 'e.g. The patient rates the pain at';
                endEg = 'e.g. out of 10.';
                break;
            }
            case questionTypes.basic['TIME']: {
                startEg = 'e.g. The pain started';
                endEg = 'e.g. ago.';
                break;   
            }
            case questionTypes.basic['LIST-TEXT']: {
                startEg = 'e.g. The patient visited';
                endEg = 'e.g. while traveling.';
                break;
            }
            case questionTypes.basic['CLICK-BOXES']: {
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

        switch(type) {
            case questionTypes.basic['CLICK-BOXES']: {
                optionsText = 'Button options:';
                break;
            }
            case questionTypes.advanced['FH']: {
                optionsText = 'Family history options:';
                break;
            }
            case questionTypes.advanced['PMH']: {
                optionsText = 'Past medical history options:';
                break;
            }
            case questionTypes.advanced['MEDS']: {
                optionsText = 'Medications options:';
                break;
            }
            case questionTypes.advanced['PSH']: {
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
        const { windowWidth, showPreview } = this.state;
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;

        let preview;
        if (type.startsWith(questionTypes.advanced["FH"])) {
            preview = (
                <FamilyHistoryContent 
                    collapseTabs={collapseTabs}
                />
            );
        } else if (type.startsWith(questionTypes.advanced["MEDS"])) {
            preview = (
                <MedicationsContent 
                    collapseTabs={collapseTabs}
                />
            );
        } else if (type.startsWith(questionTypes.advanced["PMH"])) {
            preview = (
                <MedicalHistoryContent 
                    collapseTabs={collapseTabs}
                />
            );
        } else if (type.startsWith(questionTypes.advanced["PSH"])) {
            preview = (
                <SurgicalHistoryContent 
                    collapseTabs={collapseTabs}
                />
            );
        }
        return preview;
    }

    getAnswerTemplate(startEg, endEg, optionsText) {
        const { qId, type } = this.props;
        let template;
        let otherGraphs;

        if (type === questionTypes.basic['YES-NO']) {
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
                        <Button 
                            basic
                            icon='arrow right'
                            parent={qId}
                            disabled={this.state.otherGraph === null}
                            onClick={this.connectGraph}
                            className='connect-button'
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
                    <span className='answer-label'>
                        IF YES:
                    </span>
                    <Input
                        placeholder='e.g. The patient has pain.'
                        answer='yesResponse'
                        value={this.context.state.nodes[qId].answerInfo.yesResponse}
                        onChange={this.saveAnswer}
                        className='yes-no-input'
                    />
                    <br />
                    <span className='answer-label answer-label-if-no'>
                        IF NO:
                    </span>
                    <Input
                        placeholder='e.g. The patient does not have pain.'
                        answer='noResponse'
                        value={this.context.state.nodes[qId].answerInfo.noResponse}
                        onChange={this.saveAnswer}
                        className='yes-no-input'
                    />
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
                </Segment>
            );
        } else if (type === questionTypes.basic['NO-YES']) {
            template = (
                <Segment className='yes-no-answer'>
                    <span className='answer-label answer-label-if-no'>
                        IF NO:
                    </span>
                    <Input
                        placeholder='e.g. The patient does not have pain.'
                        answer='yesResponse'
                        value={this.context.state.nodes[qId].answerInfo.yesResponse}
                        onChange={this.saveAnswer}
                        className='yes-no-input'
                    />
                    <br />
                    <span className='answer-label'>
                        IF YES:
                    </span>
                    <Input
                        placeholder='e.g. The patient has pain.'
                        answer='noResponse'
                        value={this.context.state.nodes[qId].answerInfo.noResponse}
                        onChange={this.saveAnswer}
                        className='yes-no-input'
                    />
                    <div className='add-child-question'>
                        <Button
                            basic
                            icon='add'
                            parent={qId}
                            content='Add follow-up question'
                            onClick={this.addChildQuestion}
                            className='add-child-button'
                        />
                        <Button
                            basic
                            parent={qId}
                            content='Connect to other graphs'
                            className='add-child-button'
                            onClick={this.showGraphOptions}
                        />
                    </div>
                </Segment>
            );
        } else if (type === questionTypes.basic['SHORT-TEXT']
        || type === questionTypes.basic['NUMBER']
        || type === questionTypes.basic['TIME']
        || type === questionTypes.basic['LIST-TEXT']) {
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
        } else if (type === questionTypes.basic['CLICK-BOXES']) {
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
        } else if(type.startsWith(questionTypes.advanced['FH'])
        || type.startsWith(questionTypes.advanced['PMH'])
        || type.startsWith(questionTypes.advanced['PSH'])
        || type.startsWith(questionTypes.advanced['MEDS'])) {
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
                    {preview}
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