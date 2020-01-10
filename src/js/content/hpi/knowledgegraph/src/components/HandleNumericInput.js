import React from 'react'
import NumericInput from "react-numeric-input";

class HandleNumericInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numericValue: this.props.answers !== null ? this.props.answers[0]: null
        }
    }

    handleChange = (event) => {
        this.setState({numericValue: event})
        this.props.handler(event, 2)
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