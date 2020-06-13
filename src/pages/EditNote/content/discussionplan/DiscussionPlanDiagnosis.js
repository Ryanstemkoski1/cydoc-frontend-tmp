import React, { Component } from 'react'
import { 
    Grid, 
    Input, 
    Header, 
    Dropdown,
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

    render() {
        const { index } = this.props;
        const differential_diagnosis = this.context.plan['conditions'][index]['differential_diagnosis'];
        return (
            <Accordion styled fluid>
                <Accordion.Title
                    active
                    className='section-title'
                >
                    <Header as='h2' size='large' content='Differential Diagnosis' attached/>
                </Accordion.Title>
                <Accordion.Content active>
                    <Grid columns={2} stackable className='section-body'>
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
                    <AddRowButton
                        name='diagnosis'
                        onClick={this.addRow}
                    />
                </Accordion.Content>
            </Accordion>
        )
    }
}