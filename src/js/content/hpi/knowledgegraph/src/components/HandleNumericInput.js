import React from 'react'
import NumericInput from "react-numeric-input";
import HPIContext from "../../../../../contexts/HPIContext";

class HandleNumericInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        const answers = this.props.am_child ? values['children'][this.props.child_uid]['response'] : values["response"]
        this.state = {
            numericValue: answers !== null ? answers: null
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (event) => {
        this.setState({numericValue: event})
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = event 
        else values[this.props.category_code][this.props.uid]["response"] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        return (
            <NumericInput
                key={this.props.question}
                value={this.state.numericValue}
                min={0}
                max={this.props.max}
                onChange={this.handleChange}
            />
        )
    }
}

export default HandleNumericInput