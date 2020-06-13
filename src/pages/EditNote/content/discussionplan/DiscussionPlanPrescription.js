import React, { Component } from 'react'
import { 
    Input,
    Grid, 
    Header, 
    Dropdown,
    Accordion,
    TextArea,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import { PRESCRIPTION_DEFAULT } from './DiscussionPlanDefaults';
import HPIContext from 'contexts/HPIContext.js'
import medications from 'constants/drugNames';

export default class PrescriptionForm extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            expandPanels: false,
            options: medications,
        };
    }

    addRow = () => {
        const plan = {...this.context.plan};
        plan['conditions'][this.props.index]['prescription'].push({...PRESCRIPTION_DEFAULT});
        this.context.onContextChange('plan', plan);
    }

    handleOnChange = (index, type, value) => {
        const plan = {...this.context.plan};
        const procedures = plan['conditions'][this.props.index]['prescription'];
        procedures[index][type] = value;
        this.context.onContextChange('plan', plan);
    }

    handleAddition = (e, value) => {
        this.setState((prevState) => ({
            options: [
                {key: value, text:value, value},
                ...prevState.options,
            ],
        }));
    }

    togglePanel = (e, data) => {
        const { expandPanels } = this.state;
        this.setState({ expandPanels: !expandPanels });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.index !== this.props.index) {
            this.setState({ expandPanels: false });
        }
    }
    
    makeAccordionPanels = (all_prescriptions) => {
        return all_prescriptions.map((prescription, i) => {
            const title = (
                <div className='recipe'>
                    Recipe (Rx)
                    <Input 
                        transparent 
                        className='content-input-surgical content-dropdown medication plan-main-input recipe'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            allowAdditions
                            icon=''
                            value={prescription['recipe_type']}
                            options={this.state.options}
                            onAddItem={(e, data) => this.handleAddition(i, data.value)}
                            onChange={(e, data) => this.handleOnChange(i, 'recipe_type', data.value)}
                            placeholder='Prescription'
                            className='side-effects'
                        />
                    </Input>
                    <Input
                        fluid
                        transparent
                        type='text'
                        className='recipe-amount'
                        placeholder={'e.g. 81 mg tablet'}
                        value={prescription.recipe_amount}
                        onChange={(e) => this.handleOnChange(i, 'recipe_amount', e.target.value)}
                    />
                </div>
            );
            const content = (
                <React.Fragment>

                    Signatura (Sig)
                    <Input 
                        fluid
                        transparent
                        type='text'
                        className='plan-expanded-input'
                        value={prescription.signatura} 
                        onChange={(e) => this.handleOnChange(i, 'signatura', e.target.value)}
                        placeholder='e.g. 1 tablet every 8 hours'
                    />
                    
                    Comments
                    <Input
                        fluid
                        transparent
                        type='text' 
                        className='plan-expanded-input'
                        value={prescription.comment} 
                        onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                        placeholder='e.g. take with food'
                    />
                </React.Fragment>
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
        const {index, mobile} = this.props;
        const {expandPanels} = this.state;
        const prescriptions = this.context.plan['conditions'][index]['prescription'];
        const content = mobile
            ? <Accordion
                panels={this.makeAccordionPanels(prescriptions)}
                exclusive={false}
                fluid
                styled
                className='plan-section_response prescription'
            />
            : <Grid className='section-body' columns={3} stackable>
            <Grid.Row>
                <Grid.Column> Recipe (Rx) </Grid.Column>
                <Grid.Column> Signatura (Sig) </Grid.Column>
                <Grid.Column> Comments </Grid.Column>
            </Grid.Row>
            { prescriptions.map((prescription, i) => (
                <Grid.Row key={i}>
                    <Grid.Column>
                        <Dropdown
                            fluid
                            search
                            allowAdditions
                            selection
                            icon=''
                            type='text'
                            options={this.state.options}
                            value={prescription.recipe_type}
                            onChange={(e, data) => this.handleOnChange(i, 'recipe_type', data.value)}
                            onAddItem={(e, data) => this.handleAddition(i, data.value)}
                            placeholder='Medication'
                        />
                        <Input
                            fluid
                            type='text'
                            className='recipe-amount'
                            placeholder={'e.g. 81 mg tablet'}
                            value={prescription.recipe_amount}
                            onChange={(e) => this.handleOnChange(i, 'recipe_amount', e.target.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <div className='ui form'>
                            <textarea 
                                value={prescription.signatura} 
                                onChange={(e) => this.handleOnChange(i, 'signatura', e.target.value)}
                                placeholder='e.g. 1 tablet every 8 hours'
                            />
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <div className='ui form'>
                            <textarea 
                                value={prescription.comment} 
                                onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                                placeholder='e.g. take with food'
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                ))}
            </Grid>
        return (
        <Accordion styled fluid >
            <Accordion.Title 
                onClick={mobile ? this.togglePanel : () => {}} 
                active={mobile ? expandPanels : true }
                className='section-title'
            >
                <Header as='h2' content='Prescriptions' size='large' attached/>
            </Accordion.Title>
            <Accordion.Content active={mobile ? expandPanels : true }>
                {content}
                <AddRowButton name='prescription' onClick={this.addRow}/>
            </Accordion.Content>
        </Accordion>);
    }
}