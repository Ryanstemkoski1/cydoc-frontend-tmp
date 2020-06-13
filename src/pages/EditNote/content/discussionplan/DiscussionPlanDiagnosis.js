import React, { Component } from 'react'
import { 
    Grid, 
    Input, 
    Header, 
    Dropdown,
    Form,
    Accordion,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import { DIAGNOSIS_DEFAULT } from './DiscussionPlanDefaults';
import HPIContext from 'contexts/HPIContext.js'
import diseases from 'constants/diseases';

export default class DiagnosisForm extends Component{
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            options: diseases,
        }
    }

    addRow = () => {
        const plan = {...this.context.plan};
        plan['conditions'][this.props.index]['differential_diagnosis'].push({...DIAGNOSIS_DEFAULT});
        this.context.onContextChange('plan', plan);
    }
    
    handleOnChange = (index, type, value) => {
        const plan = {...this.context.plan};
        const diagnosis = plan['conditions'][this.props.index]['differential_diagnosis'];
        diagnosis[index][type] = value;
        this.context.onContextChange('plan', plan);
    }
    
    handleAdditionDiagnosis = (e, { value }) => {
        this.setState((prevState) => ({
            options: [
                {key: value, text: value, value},
                ...prevState.options,
            ],
        }));
    }

    makeAccordionPanels = (all_diagnosis) => {
        return all_diagnosis.map((diagnosis, i) => {
            const title = (
                <Input 
                    transparent 
                    className='content-input-surgical content-dropdown medication plan-main-input'
                >
                    <Dropdown
                        fluid
                        search
                        selection
                        allowAdditions
                        icon=''
                        value={diagnosis['diagnosis']}
                        options={this.state.options}
                        onAddItem={this.handleAdditionDiagnosis}
                        onChange={(e, data) => this.handleOnChange(i, 'diagnosis', data.value)}
                        placeholder='Diagnosis'
                        className='side-effects'
                    />
                </Input>
            );
            const content = (
                <Input
                    fluid
                    transparent
                    placeholder='Comments'
                    value={diagnosis['comment']}
                    className='plan-expanded-input'
                    onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                />
            );
            return {
                key: i,
                title: {
                    content: title,
                },
                content: { content, },
            };
        });
    }

    render() {
        const { index, mobile } = this.props;
        const differential_diagnosis = this.context.plan['conditions'][index]['differential_diagnosis'];
        const content = mobile 
            ? <Accordion
                panels={this.makeAccordionPanels(differential_diagnosis)}
                exclusive={false}
                fluid
                styled
                className='plan-section_response diagnosis'
            />
            : <Grid columns={2} stackable className='section-body'>
                { differential_diagnosis.map((diagnosis, i) => (
                    <Grid.Row key={i}>
                        <Grid.Column width={6}>
                            <Dropdown
                                fluid
                                search
                                selection
                                allowAdditions
                                icon=''
                                value={diagnosis['diagnosis']}
                                options={this.state.options}
                                onAddItem={this.handleAdditionDiagnosis}
                                onChange={(e, data) => this.handleOnChange(i, 'diagnosis', data.value)}
                                placeholder='Diagnosis'
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Input
                                fluid
                                placeholder='Comments'
                                value={diagnosis['comment']}
                                onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                            />
                        </Grid.Column>
                    </Grid.Row>
                ))}
            </Grid>
            
        return (
            <Accordion styled fluid className='plan-section'>
                <Accordion.Title
                    active
                    className='section-title'
                >
                    <Header as='h2' size='large' content='Differential Diagnosis' attached/>
                </Accordion.Title>
                <Accordion.Content active>
                    {content}
                    <AddRowButton
                        name='diagnosis'
                        onClick={this.addRow}
                    />
                </Accordion.Content>
            </Accordion>
        )
    }
}