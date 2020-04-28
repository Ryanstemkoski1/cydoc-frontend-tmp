import React, { Component } from 'react';
import { Container, Grid, Segment, Input, Button, Dropdown } from 'semantic-ui-react';
import CreateTemplateContext from '../contexts/CreateTemplateContext';
import TemplateAnswer from './TemplateAnswer';
import questionTypes from '../constants/questionTypes';
import '../../css/components/newTemplate.css';

class TemplateQuestion extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedMore: false,
        };
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveQuestionType = this.saveQuestionType.bind(this);
        this.getQuestionTypes = this.getQuestionTypes.bind(this);
        this.getAdvancedDropdown = this.getAdvancedDropdown.bind(this);
        this.removeAdvancedDropdown = this.removeAdvancedDropdown.bind(this);
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
            key: 'More',
            text: 'More...',
            value: 'More...',
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
                className='question-type'
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
        const questionTypeOptions = this.getQuestionTypes();

        return (
            <Container key={qId} className='question-container'>
                <Segment>
                    <Grid>
                        <Grid.Column width={1} verticalAlign='middle'>
                            <Button
                                basic
                                fluid
                                icon='move'
                                className='move-question'
                            />
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <Grid.Row className='question-info'>
                                <Input
                                    qid={qId}
                                    placeholder='Question'
                                    value={this.context.state.nodes[qId].text}
                                    onChange={this.saveQuestion}
                                    transparent
                                    size='large'
                                    className='question-input'
                                />
                                {questionTypeOptions}
                            </Grid.Row>
                            <Grid.Row>
                                <TemplateAnswer qId={qId} type={this.context.state.nodes[qId].type} />
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        );
    }
}

export default TemplateQuestion;