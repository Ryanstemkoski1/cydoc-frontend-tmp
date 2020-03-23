import { Dropdown } from "semantic-ui-react"
import React, {Component} from "react";
import HPIContext from "../../contexts/HPIContext"

export default class FamilyHistoryDropdown extends Component { 

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        this.state = {
            value: "Add Family Member"
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event, data) {
        const { index, family_index } = this.props 
        var values = this.context['Family History']
        values[index]['Family Member'][family_index] = data.value 
        this.context.onContextChange("Family History", values)
        this.setState({value: data.value})
    }

    render() {
        return ( 
            <Dropdown 
                    value={this.state.value}
                    button
                    selection
                    fluid 
                    options={familyOptions}
                    onChange={this.handleChange}
                />
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
        key: 'grandmother',
        text: 'grandmother',
        value: 'grandmother'
    },
    {
        key: 'grandfather',
        text: 'grandfather',
        value: 'grandfather'
    },
    {
        key: 'aunt',
        text: 'aunt',
        value: 'aunt'
    },
    {
        key: 'uncle',
        text: 'uncle',
        value: 'uncle'
    },
    {
        key: 'none',
        text: 'none',
        value: 'none'
    }
]