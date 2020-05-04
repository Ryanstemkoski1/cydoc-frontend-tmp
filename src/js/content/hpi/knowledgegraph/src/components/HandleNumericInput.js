import React from 'react'
import NumericInput from "react-numeric-input"; 
import HPIContext from "../../../../../contexts/HPIContext";

class HandleNumericInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (event) => {
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = event 
        else values[this.props.category_code][this.props.uid]["response"] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        var value = this.props.am_child ? values['children'][this.props.child_uid]['response'] : values["response"]
        return (
            <NumericInput
                key={this.props.question}
                value={value}
                min={0}
                max={this.props.max}
                onChange={this.handleChange}
            />
        )
    }
}

export default HandleNumericInput