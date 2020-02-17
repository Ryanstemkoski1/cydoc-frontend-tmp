import React from 'react'
import DatePicker from "react-date-picker";
import HPIContext from "../../../../../contexts/HPIContext";

class TimeInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        const answers = this.context["hpi"][this.props.category_code][this.props.uid]["response"]
        this.state = {
            timeInput: answers !== null ? answers: null
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange = (event) => {
        this.setState({timeInput: event})
        // this.props.handler(event, 3)
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["response"] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        return (
            <DatePicker
                onChange={this.handleInputChange}
                value={this.state.timeInput}
            />
        )
    }
}

export default TimeInput