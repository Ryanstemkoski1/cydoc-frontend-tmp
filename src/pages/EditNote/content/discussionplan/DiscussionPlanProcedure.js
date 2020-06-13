import React, { Component } from 'react'
import { 
    Grid, 
    Header, 
    Dropdown,
    Accordion,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import HPIContext from 'contexts/HPIContext.js'
import { PROCEDURES_DEFAULT } from './DiscussionPlanDefaults';
import procedures from 'constants/procedures';

export default class GeneralForm extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            expandPanels: false,
            options: procedures,
            whenOptions: this.generateOptions(['today', 'this week', 'this month', 'this year']),
        }
    }

    generateOptions = (values) => {
        return values.map((value) => 
            ({key: value, text: value, value})
        )    
    }

    addRow = () => {
        const plan = {...this.context.plan};
        plan['conditions'][this.props.index]['procedure'].push({...PROCEDURES_DEFAULT});
        this.context.onContextChange('plan', plan);
    }

    handleOnChange = (index, type, value) => {
        const plan = {...this.context.plan};
        const procedures = plan['conditions'][this.props.index]['procedure'];
        procedures[index][type] = value;
        this.context.onContextChange('plan', plan);
    }

    handleAddition = (type, value) => {
        this.setState((prevState) => ({
            [type]: [
                {key: value, text:value, value},
                ...prevState[type],
            ],
        }));
    }

    togglePanel = (e, data) => {
        const { expandPanels } = this.state;
        this.setState({ expandPanels: !expandPanels });
    }

    render() {
        const {index} = this.props;
        const procedures = this.context.plan['conditions'][index]['procedure'];
        return (
            <Accordion fluid styled>
                <Accordion.Title
                    onClick={this.togglePanel}
                    active={this.state.expandPanels}
                    className='section-title'
                >
                    <Header as='h2' content='Procedures and Services' size='large' dividing attached/>
                </Accordion.Title>
                <Accordion.Content active={this.state.expandPanels}>
                    <Grid columns={3} stackable className='section-body'>
                        <Grid.Row>
                            <Grid.Column>Procedures</Grid.Column>
                            <Grid.Column>When</Grid.Column>
                            <Grid.Column>Comments</Grid.Column>
                        </Grid.Row>
                        { procedures.map((procedure, i) => (
                            <Grid.Row key={i}>
                                <Grid.Column>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        allowAdditions
                                        type='text'
                                        icon=''
                                        options={this.state.options}
                                        value={procedure['procedure']}
                                        onAddItem={(e, data) => this.handleAddition('options', data.value)}
                                        onChange={(e, data) => this.handleOnChange(i, 'procedure', data.value)}
                                        placeholder={'Procedure'}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        allowAdditions
                                        type='text'
                                        icon=''
                                        options={this.state.whenOptions}
                                        value={procedure['when']}
                                        onChange={(e, data) => this.handleOnChange(i, 'when', data.value)}
                                        onAddItem={(e, data) => this.handleAddition('whenOptions', data.value)}
                                        placeholder='When'
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <div className='ui form'>
                                        <textarea 
                                            placeholder='Comments'
                                            value={procedure['comment']} 
                                            onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            ))
                        }
                    </Grid>
                    <AddRowButton 
                        name={'procedure or service'}
                        onClick={this.addRow}
                    />
                </Accordion.Content>
            </Accordion>
        );
    }

}