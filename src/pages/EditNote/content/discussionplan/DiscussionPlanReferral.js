import React, { Component } from 'react'
import { 
    Grid, 
    Header, 
    Dropdown,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import HPIContext from 'contexts/HPIContext.js'
import { REFERRAL_DEFAULT } from './DiscussionPlanDefaults';
import constants from 'constants/registration-constants.json';

const specialtyOptions = constants.specialties.map((specialty) => ({ key: specialty, text: specialty, value: specialty }));

// General form containing search dropdown, when, and comment
export default class GeneralForm extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            options: specialtyOptions,
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
        plan['conditions'][this.props.index]['referral'].push({...REFERRAL_DEFAULT});
        this.context.onContextChange('plan', plan);
    }

    handleOnChange = (index, type, value) => {
        const plan = {...this.context.plan};
        const referrals = plan['conditions'][this.props.index]['referral'];
        referrals[index][type] = value;
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

    render() {
        const {index} = this.props;
        const referrals = this.context.plan['conditions'][index]['referral'];
        return (
            <React.Fragment>
                <Header as='h4' dividing> Referrals </Header>
                <Grid columns={3} stackable>
                    <Grid.Row>
                        <Grid.Column>Department</Grid.Column>
                        <Grid.Column>When</Grid.Column>
                        <Grid.Column>Comments</Grid.Column>
                    </Grid.Row>
                    { referrals.map((referral, i) => (
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
                                    value={referral['department']}
                                    onAddItem={(e, data) => this.handleAddition('options', data.value)}
                                    onChange={(e, data) => this.handleOnChange(i, 'department', data.value)}
                                    placeholder={'Department'}
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
                                    value={referral['when']}
                                    onAddItem={(e, data) => this.handleAddition('whenOptions', data.value)}
                                    onChange={(e, data) => this.handleOnChange(i, 'when', data.value)}
                                    placeholder='When'
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <div className='ui form'>
                                    <textarea 
                                        placeholder='Comments'
                                        value={referral['comment']} 
                                        onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        ))
                    }
                </Grid>
                <AddRowButton 
                    name={'referral'}
                    onClick={this.addRow}
                />
            </React.Fragment>
        );
    }

}