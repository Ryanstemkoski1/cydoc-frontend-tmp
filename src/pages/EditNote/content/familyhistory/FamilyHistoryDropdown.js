import { Dropdown, Grid, Form, Button, Header } from "semantic-ui-react";
import React, { Component } from "react";
import HPIContext from 'contexts/HPIContext.js';
import ToggleButton from 'components/tools/ToggleButton.js';
import './FamilyHistory.css';

export default class FamilyHistoryDropdown extends Component { 

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        var values = this.context['Family History']
        var value = values[this.props.index]['Family Member'][this.props.family_index]
        this.state = {
            value: value ? value : "Add Family Member"
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleCauseOfDeathToggle = this.handleCauseOfDeathToggle.bind(this)
        this.handleCommentsChange = this.handleCommentsChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleLivingToggle = this.handleLivingToggle.bind(this)
    }

    handleChange(event, data) {
        const { index, family_index } = this.props 
        var values = this.context['Family History']
        values[index]['Family Member'][family_index] = data.value
        this.context.onContextChange("Family History", values)
        this.setState({value: data.value})
    }

    handleCauseOfDeathToggle(event, data) {
        const { index, family_index } = this.props
        const values = this.context["Family History"];
        values[index]["Cause of Death"][family_index] = data.title === "Yes" ? true : false;
        values[index]["Living"][family_index] = data.title === "Yes" ? false : "";
        this.context.onContextChange("Family History", values);
    }

    handleLivingToggle(event, data) {
        const { index, family_index } = this.props
        const values = this.context["Family History"];
        values[index]["Living"][family_index] = data.title === "Yes" ? true : false
        this.context.onContextChange("Family History", values);
    }

    handleCommentsChange(event, data) {
        const { index, family_index, comments } = this.props
        var values = this.context['Family History']
        values[index]["Comments"][family_index] = data.value
        this.context.onContextChange("Family History", values)
    }

    handleDelete(event, data) {
        const { index, family_index } = this.props
        var values = this.context['Family History'];
        values[index]['Family Member'].splice(family_index, 1)
        values[index]['Cause of Death'].splice(family_index, 1)
        values[index]['Comments'].splice(family_index, 1)
        values[index]['Living'].splice(family_index, 1)
        this.context.onContextChange("Family History", values)
    }

    render() {
        const {index, family_index, mobile, condition, comments, familyMember} = this.props;
        const cause_of_death = this.context["Family History"][index]["Cause of Death"][family_index];
        const family_member = familyMember[family_index]
        const comment = comments[family_index]
        const living = this.context["Family History"][index]["Living"][family_index]

        return (
            mobile ? (
                <div className='dropdown-component-container'>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column mobile={6} className='family-member-input'>
                                Family Member
                                <Dropdown
                                    value={family_member}
                                    search
                                    selection
                                    fluid 
                                    options={familyOptions}
                                    onChange={this.handleChange}
                                    className='dropdown-inline-mobile'
                                />
                            </Grid.Column>
                            <Grid.Column mobile={1} />
                            <Grid.Column mobile={4} className='cod-input'>
                                Cause of death?
                                <div>
                                    <ToggleButton
                                        active={cause_of_death}
                                        condition={this.props.condition}
                                        title="Yes"
                                        onToggleButtonClick={this.handleCauseOfDeathToggle}
                                    />
                                    <ToggleButton
                                        active={cause_of_death === false ? true : false}
                                        condition={this.props.condition}
                                        title="No"
                                        onToggleButtonClick={this.handleCauseOfDeathToggle}
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={1} />
                            {cause_of_death === true || cause_of_death === undefined ? "" :
                                <Grid.Column mobile={4} >
                                    Living?
                                    <div>
                                        <ToggleButton
                                            active={living}
                                            condition={this.props.condition}
                                            title="Yes"
                                            onToggleButtonClick={this.handleLivingToggle}
                                        />
                                        <ToggleButton
                                            active={living === false ? true : false}
                                            condition={this.props.condition}
                                            title="No"
                                            onToggleButtonClick={this.handleLivingToggle}
                                        />
                                    </div>
                                </Grid.Column>
                            }
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={16}>
                                <Form.TextArea
                                    label="Comments"
                                    className="text-area comments-box-mobile"
                                    condition={condition}
                                    value={comment}
                                    placeholder='Comments'
                                    onChange={this.handleCommentsChange}
                                    rows={1}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            ) : (
                <div className='dropdown-component-container'>
                    
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={1}>
                                <Button
                                    basic
                                    circular
                                    icon="close"
                                    size='mini'
                                    onClick = {this.handleDelete}
                                />
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Dropdown
                                    value={family_member}
                                    search
                                    selection
                                    fluid
                                    options={familyOptions}
                                    onChange={this.handleChange}
                                    className='dropdown-inline'
                                    style={{width: '45%'}}
                                />
                            </Grid.Column>
                            
                            <Grid.Column width={3}>
                                <ToggleButton
                                    active={cause_of_death}
                                    condition={this.props.condition}
                                    title="Yes"
                                    onToggleButtonClick={this.handleCauseOfDeathToggle}
                                />
                                <ToggleButton
                                    active={cause_of_death === false ? true : false}
                                    condition={this.props.condition}
                                    title="No"
                                    onToggleButtonClick={this.handleCauseOfDeathToggle}
                                />
                            </Grid.Column>

                            <Grid.Column width={9}>
                                <Form>
                                    <Form.TextArea rows={1} condition={condition} value={comment}
                                                onChange={this.handleCommentsChange} placeholder='Comments'/>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        {cause_of_death === true || cause_of_death === undefined ? "" :
                        <Grid.Row className="living-toggle-row">
                            <Grid.Column width={3} />
                            <Grid.Column width={1}>
                                <Header.Subheader className="living-toggle-title">Living?</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <ToggleButton
                                    active={living}
                                    condition={this.props.condition}
                                    title="Yes"
                                    onToggleButtonClick={this.handleLivingToggle}
                                />
                                <ToggleButton
                                    active={living === false ? true : false}
                                    condition={this.props.condition}
                                    title="No"
                                    onToggleButtonClick={this.handleLivingToggle}
                                />
                            </Grid.Column>
                        </Grid.Row> 
                        }
                        

                    </Grid>
                    
                </div>
            )
        );
    }
}

const familyOptions = [
    {
        key: '',
        text: '',
        value: ''
    },
    {
        key: 'mother',
        text: 'mother',
        value: 'mother'
    },
    {
        key: 'father',
        text: 'father',
        value: 'father'
    },
    {
        key: 'sister',
        text: 'sister',
        value: 'sister'
    },
    {
        key: 'brother',
        text: 'brother',
        value: 'brother'
    },
    {
        key: 'daughter',
        text: 'daughter',
        value: 'daughter'
    },
    {
        key: 'son',
        text: 'son',
        value: 'son'
    },
    {
        key: 'maternal aunt',
        text: 'maternal aunt',
        value: 'maternal aunt'
    },
    {
        key: 'maternal uncle',
        text: 'maternal uncle',
        value: 'maternal uncle'
    },
    {
        key: 'paternal aunt',
        text: 'paternal aunt',
        value: 'paternal aunt'
    },
    {
        key: 'paternal uncle',
        text: 'paternal uncle',
        value: 'paternal uncle'
    },
    {
        key: 'maternal grandmother',
        text: 'maternal grandmother',
        value: 'maternal grandmother'
    },
    {
        key: 'maternal grandfather',
        text: 'maternal grandfather',
        value: 'maternal grandfather'
    },
    {
        key: 'paternal grandmother',
        text: 'paternal grandmother',
        value: 'paternal grandmother'
    },
    {
        key: 'paternal grandfather',
        text: 'paternal grandfather',
        value: 'paternal grandfather'
    },
    {
        key: 'cousin',
        text: 'cousin',
        value: 'cousin'
    },
    {
        key: 'other',
        text: 'other',
        value: 'other'
    }
]