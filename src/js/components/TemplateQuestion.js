import React, { Component } from 'react';
import { Container, Grid, Segment, Form, Input, Button, Dropdown } from 'semantic-ui-react';
import CreateTemplateContext from '../contexts/CreateTemplateContext';
import '../../css/components/newTemplate.css';

class TemplateQuestion extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            showAddChildButton: false,
        }
        this.saveQuestion = this.saveQuestion.bind(this);
        this.saveQuestionType = this.saveQuestionType.bind(this);
        this.addChildQuestion = this.addChildQuestion.bind(this);
    }

    saveQuestion = (event, { value, index }) => {
        this.context.state.questions[index].question = value;
        this.context.onContextChange('questions', this.context.state.questions);
    }

    saveQuestionType = (event, { value, index }) => {
        const addChildButton = document.getElementById('add-child-question');
        if (value === 'YES-NO') {
            addChildButton.style.display = 'block';
            this.setState({
                showAddChildButton: true,
            })
            this.context.state.questions[index].type = value;
            this.context.onContextChange('questions', this.context.state.questions);
        } else {
            addChildButton.style.display = 'none';
            this.setState({
                showAddChildButton: false,
            })
            this.context.state.questions[index].type = value;
            this.context.onContextChange('questions', this.context.state.questions);
        }
    }

    addChildQuestion = (event, { index }) => {
        this.context.state.questions[index].children.push({
            question: '',
            type: '',
            index: this.context.state.questions[index].children.length,
            answerTemplate: {},
            children: [],
        });
        this.context.onContextChange('questions', this.context.state.questions);
    }

    render() {
        const { index, options } = this.props;

        return (
            <Container key={index} className='question-container'>
                <Segment>
                    <Form>
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
                                        index={index}
                                        placeholder='Question'
                                        value={this.context.state.questions[index].question}
                                        onChange={this.saveQuestion}
                                        transparent
                                        size='large'
                                        className='question-input'
                                    />
                                    <Dropdown
                                        search
                                        selection
                                        clearable
                                        placeholder='Question type'
                                        index={index}
                                        value={this.context.state.questions[index].type}
                                        options={options}
                                        onChange={this.saveQuestionType}
                                        className='question-type'
                                    />
                                </Grid.Row>
                                <Grid.Row>
                                    <Input
                                        fluid
                                        transparent
                                        size='large'
                                        placeholder='Answer'
                                        className='answer-input'
                                    />
                                </Grid.Row>
                                <Grid.Row>
                                    <Button
                                        basic
                                        icon='add'
                                        labelPosition='left'
                                        index={index}
                                        onClick={this.addChildQuestion}
                                        content='Add follow-up question'
                                        id='add-child-question'
                                    />
                                </Grid.Row>
                            </Grid.Column>
                        </Grid>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default TemplateQuestion;