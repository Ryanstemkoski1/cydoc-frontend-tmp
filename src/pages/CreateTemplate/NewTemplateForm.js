import React, { Component, createRef } from 'react';
import { Button, Form, Header, Segment, Input, Grid, Dropdown, Message } from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import './NewTemplate.css';
import TemplateQuestion from './TemplateQuestion';
import { graphClient } from 'constants/api.js';
import diseaseAbbrevs from 'constants/diseaseAbbrevs.json';
import diseaseCodes from 'constants/diseaseCodes';

const OTHER_TEXT = 'Other (specify below)';

class NewTemplateForm extends Component {
    static contextType = CreateTemplateContext;
    titleRef = createRef();

    constructor(props, context) {
        super(props, context);
        this.state = {
            bodySystems: [],
            diseases: [],
            showOtherBodySystem: false,
            showOtherDisease: false,
            diseaseEmpty: true,
        }
        this.saveTitle = this.saveTitle.bind(this);
        this.saveBodySystem = this.saveBodySystem.bind(this);
        this.saveDisease = this.saveDisease.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
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
            });
        });
    }

    saveTitle(event, { value }) {
        this.context.onContextChange('title', value);
    }

    saveBodySystem(event, { value }) {
        const otherInput = document.getElementById('other-body-system');
        if (value === OTHER_TEXT) {
            otherInput.style.display = 'inline-block';
            this.setState({
                showOtherBodySystem: true,
            })
            this.context.onContextChange('bodySystem', '');
        } else if (this.state.bodySystems.includes(value)) {
            otherInput.style.display = 'none';
            this.setState({
                showOtherBodySystem: false,
            })
            this.context.onContextChange('bodySystem', value);
        } else {
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

    render() {
        const { bodySystems, diseases, showOtherBodySystem, showOtherDisease } = this.state;
        console.log(this.context.state)

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

        const questionsDisplay = [];
        const rootEdges = this.context.state.graph['0000'];
        for (let edge in rootEdges) {
            const qId = this.context.state.edges[rootEdges[edge].toString()].to;
            questionsDisplay.push(
                <TemplateQuestion key={qId} qId={qId} />
            );
        }

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
                <div>
                    {questionsDisplay}
                </div>
                <Button
                    circular
                    icon='add'
                    onClick={this.addQuestion}
                    content='Add question'
                    className='add-question-button'
                />
            </Segment>
        );
    }
}

export default NewTemplateForm;