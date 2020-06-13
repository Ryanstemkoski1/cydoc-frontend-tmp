import React, { Component } from 'react'
import { 
    Grid, 
    Header, 
    Dropdown,
    Accordion,
    Input,
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
            expandPanels: false,
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

    togglePanel = (e, data) => {
        const { expandPanels } = this.state;
        this.setState({ expandPanels: !expandPanels });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.index !== this.props.index) {
            this.setState({ expandPanels: false });
        }
    }

    makeAccordionPanels = (all_referrals) => {
        return all_referrals.map((referral, i) => {
            const title = (
                <Input 
                    transparent 
                    className='content-input-surgical content-dropdown plan-main-input'
                >
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
                        placeholder='Department'
                        className='side-effects'
                    />
                </Input>
            );
            const content = (
                <React.Fragment>
                    <Input 
                        transparent 
                        className='content-input-surgical content-dropdown medication plan-main-input'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            allowAdditions
                            type='text'
                            icon=''
                            options={this.state.whenOptions}
                            value={referral['when']}
                            onChange={(e, data) => this.handleOnChange(i, 'when', data.value)}
                            onAddItem={(e, data) => this.handleAddition('whenOptions', data.value)}
                            placeholder='When'
                            className='side-effects'
                        />
                    </Input>
                    <Input
                        fluid
                        transparent
                        className='plan-expanded-input'
                        placeholder='Comments'
                        value={referral['comment']} 
                        onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
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
        const referrals = this.context.plan['conditions'][index]['referral'];
        const content = mobile 
            ? <Accordion
                fluid
                styled
                exclusive={false}
                panels={this.makeAccordionPanels(referrals)}
                className='plan-section_response referral'
            />
            :<Grid columns={3} stackable className='section-body'>
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
        return (
            <Accordion fluid styled className='plan-section'>
                <Accordion.Title
                    active={mobile ? expandPanels : true}
                    onClick={mobile ? this.togglePanel : () => {}}
                    className='section-title'
                >
                    <Header as='h2' size='large' content='Referrals' attached/>
                </Accordion.Title>
                <Accordion.Content active={mobile ? expandPanels : true}>
                    {content}
                    <AddRowButton 
                        name={'referral'}
                        onClick={this.addRow}
                    />
                </Accordion.Content>
            </Accordion>
        );
    }

}