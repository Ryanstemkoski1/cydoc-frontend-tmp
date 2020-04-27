import React, { Component, Fragment } from 'react';
import { Input, Segment, Button } from 'semantic-ui-react';
import CreateTemplateContext from '../contexts/CreateTemplateContext';
import TemplateQuestion from './TemplateQuestion';
import questionTypes from '../constants/questionTypes';

class TemplateAnswer extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.addChildQuestion = this.addChildQuestion.bind(this);
        this.saveButtonOption = this.saveButtonOption.bind(this);
        this.addButtonOption = this.addButtonOption.bind(this);
        this.removeButtonOption = this.removeButtonOption.bind(this);
    }

    saveAnswer = (event, { value, answer }) => {
        const { qId } = this.props;
        this.context.state.nodes[qId].answerInfo[answer] = value;
        this.context.onContextChange('nodes', this.context.state.nodes);
    }

    addChildQuestion = (event, { parent }) => {
        let numQuestions = this.context.state.numQuestions;
        let numEdges = this.context.state.numEdges;

        const numZeros = 4 - numQuestions.toString().length;
        const childId = '0'.repeat(numZeros) + numQuestions.toString();

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
            case questionTypes.advanced['FH-POP']: {
                optionsText = 'Family history options:';
                break;
            }
            case questionTypes.advanced['PMH-POP']: {
                optionsText = 'Past medical history options:';
                break;
            }
            case questionTypes.advanced['MEDS-POP']: {
                optionsText = 'Medications options:';
                break;
            }
            default: {
                optionsText = '';
                break;
            }
        }
        
        return optionsText;
    }

    getAnswerTemplate(startEg, endEg, optionsText) {
        const { qId, type } = this.props;
        let template;
        let childQuestions;

        if (type === questionTypes.basic['YES-NO']) {
            childQuestions = this.context.state.graph[qId].map(childQ => {
                const numZeros = 4 - childQ.toString().length;
                const childId = '0'.repeat(numZeros) + childQ.toString();
                return <TemplateQuestion key={childId} qId={childId} />
            });

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
                        {childQuestions}
                        <Button
                            basic
                            icon='add'
                            parent={qId}
                            content='Add follow-up question'
                            onClick={this.addChildQuestion}
                            className='add-child-button'
                        />
                    </div>
                </Segment>
            );
        } else if (type === questionTypes.basic['NO-YES']) {
            childQuestions = this.context.state.graph[qId].map(childQ => {
                const numZeros = 4 - childQ.toString().length;
                const childId = '0'.repeat(numZeros) + childQ.toString();
                return <TemplateQuestion key={childId} qId={childId} />
            });

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
                        {childQuestions}
                        <Button
                            basic
                            icon='add'
                            parent={qId}
                            content='Add follow-up question'
                            onClick={this.addChildQuestion}
                            className='add-child-button'
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
        } else if(type === questionTypes.advanced['FH-POP']
        || type === questionTypes.advanced['PMH-POP']
        || type === questionTypes.advanced['MEDS-POP']) {
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
                        className='add-option-pop'
                    />
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