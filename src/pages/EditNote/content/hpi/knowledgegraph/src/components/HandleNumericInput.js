import React from 'react'
import NumericInput from "react-numeric-input"; 
import HPIContext from 'contexts/HPIContext.js';

class HandleNumericInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (event) => {
        const values = this.context["hpi"]
        values['nodes'][this.props.node]["response"] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        const values = this.context["hpi"]['nodes'][this.props.node]
        var value = values["response"]
        var question = values['text'] 
        return (
            <NumericInput
                key={question}
                value={value}
                min={0}
                max={this.props.max}
                onChange={this.handleChange}
            />
        )
    }
}

export default HandleNumericInput