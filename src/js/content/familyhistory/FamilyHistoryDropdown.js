import { Dropdown, Container } from "semantic-ui-react"
import React, {Component} from "react";
import HPIContext from "../../contexts/HPIContext"
import ToggleButton from "../../components/ToggleButton";
import FamilyHistoryCauseofDeath from "../discussionplan/FamilyHistoryCauseofDeath";


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
        var cause_of_death = this.context["Family History"][this.props.index]["Cause of Death"][this.props.family_index]
        return (
            <div style={{marginBottom: 10}}>
                <Dropdown
                    value={this.state.value}
                    button
                    search
                    selection
                    fluid 
                    options={familyOptions}
                    onChange={this.handleChange}
                    style={{width: '50%', display: 'inline-table', marginRight: 50}}
                />
                <ToggleButton   active={cause_of_death}
                                condition={this.props.condition}
                                title="Yes"
                                onToggleButtonClick={this.handleClick} />
                <ToggleButton   active={cause_of_death === false ? true : false}
                                condition={this.props.condition}
                                title="No"
                                onToggleButtonClick={this.handleClick} />
            </div>
        )
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