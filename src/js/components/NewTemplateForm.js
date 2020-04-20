import React, { Component, createRef } from 'react';
import { Button, Form, Header, Segment, Input, Grid, Dropdown } from 'semantic-ui-react';
import CreateTemplateContext from '../contexts/CreateTemplateContext';
import '../../css/components/newTemplate.css';
import '../../css/components/navMenu.css';
import TemplateQuestion from './TemplateQuestion';
import API from '../content/hpi/knowledgegraph/src/API';
import disease_abbrevs from '../content/hpi/knowledgegraph/src/components/data/disease_abbrevs';

const OTHER_TEXT = 'Other (specify below)';

class NewTemplateForm extends Component {
    static contextType = CreateTemplateContext;
    titleRef = createRef();

    constructor(props, context) {
        super(props, context);
        this.state = {
            bodySystems: [],
            diseases: [],
            questionTypes: [],
            isLoaded: false,
            showOtherBodySystem: false,
            showOtherDisease: false,
        }
        this.saveTitle = this.saveTitle.bind(this);
        this.saveBodySystem = this.saveBodySystem.bind(this);
        this.saveDisease = this.saveDisease.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
    }

    componentDidMount() {
        API.then(value => {
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
                            name: disease_abbrevs[bodySys],
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
                questionTypes: allQuestionTypes,
                isLoaded: true,
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
        if (value === OTHER_TEXT) {
            otherInput.style.display = 'inline-block';
            this.setState({
                showOtherDisease: true,
            })
            this.context.onContextChange('disease', '');
        } else if (this.state.diseases.includes(value)) {
            otherInput.style.display = 'none';
            this.setState({
                showOtherDisease: false,
            })
            this.context.onContextChange('disease', value);
        } else {
            this.context.onContextChange('disease', value);
        }
    }

    addQuestion() {
        this.context.state.questions.push({
            question: '',
            type: '',
            index: this.context.state.questions.length,
            answerTemplate: {},
            children: [],
        });
        this.context.onContextChange('questions', this.context.state.questions);
    }

    render() {
        const { bodySystems, diseases, questionTypes, isLoaded, showOtherBodySystem, showOtherDisease } = this.state;

        const bodySystemOptions = isLoaded ? bodySystems.map((bodySystem, index) => {
            return {
                key: index,
                value: bodySystem,
                text: bodySystem,
            };
        }) : [];

        if (isLoaded) {
            bodySystemOptions.push({
                value: OTHER_TEXT,
                text: OTHER_TEXT,
            });
        }

        const diseaseOptions = isLoaded ? diseases.map((disease, index) => {
            return {
                key: index,
                value: disease,
                text: disease,
            };
        }) : [];

        if (isLoaded) {
            diseaseOptions.push({
                value: OTHER_TEXT,
                text: OTHER_TEXT,
            });
        }

        const questionTypeOptions = isLoaded ? questionTypes.map((type, index) => {
            return {
                key: index,
                value: type,
                text: type,
            }
        }) : [];

        const questionsDisplay = this.context.state.questions.map((category, index) =>
            <TemplateQuestion key={index} index={index} options={questionTypeOptions} />
        );

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
                {questionsDisplay}
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