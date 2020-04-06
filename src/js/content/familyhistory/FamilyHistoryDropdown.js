import { Dropdown, Grid } from "semantic-ui-react";
import React, { Component } from "react";
import HPIContext from "../../contexts/HPIContext";
import ToggleButton from "../../components/ToggleButton";
import '../../../css/content/familyHistory.css';

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
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(event, data) {
        const { index, family_index } = this.props 
        var values = this.context['Family History']
        values[index]['Family Member'][family_index] = data.value 
        this.context.onContextChange("Family History", values)
        this.setState({value: data.value})
    }

    handleClick(event, data) {
        let index = data.condition.props.index
        const values = this.context["Family History"];
        values[index]["Cause of Death"][this.props.family_index] = data.title === "Yes" ? true : false 
        this.context.onContextChange("Family History", values);
    }

    render() {
        const {index, family_index, mobile} = this.props;
        const cause_of_death = this.context["Family History"][index]["Cause of Death"][family_index];

        return (
            mobile ? (
                <div className='dropdown-component-container'>
                    <Grid stackable>
                        <Grid.Column mobile={8} className='family-member-input'>
                            Family Member
                            <Dropdown
                                value={this.state.value}
                                search
                                selection
                                fluid 
                                options={familyOptions}
                                onChange={this.handleChange}
                                className='dropdown-inline-mobile'
                            />
                        </Grid.Column>
                        <Grid.Column width={8} className='cod-input'>
                            Cause of death?
                            <div>
                                <ToggleButton
                                    active={cause_of_death}
                                    condition={this.props.condition}
                                    title="Yes"
                                    onToggleButtonClick={this.handleClick}
                                />
                                <ToggleButton
                                    active={cause_of_death === false ? true : false}
                                    condition={this.props.condition}
                                    title="No"
                                    onToggleButtonClick={this.handleClick}
                                />
                            </div>
                        </Grid.Column>
                    </Grid>
                </div>
            ) : (
                <div className='dropdown-component-container'>
                    <Dropdown
                        value={this.state.value}
                        search
                        selection
                        fluid
                        options={familyOptions}
                        onChange={this.handleChange}
                        className='dropdown-inline'
                    />
                    <ToggleButton
                        active={cause_of_death}
                        condition={this.props.condition}
                        title="Yes"
                        onToggleButtonClick={this.handleClick}
                    />
                    <ToggleButton
                        active={cause_of_death === false ? true : false}
                        condition={this.props.condition}
                        title="No"
                        onToggleButtonClick={this.handleClick}
                    />
                </div>
            )
        );
    }
}

const familyOptions = [
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