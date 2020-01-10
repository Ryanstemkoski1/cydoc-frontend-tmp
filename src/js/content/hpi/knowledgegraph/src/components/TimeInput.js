import React from 'react'
import DatePicker from "react-date-picker";

class TimeInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timeInput: this.props.answers !== null ? this.props.answers[1]: null
        }
    }

    handleInputChange = (event) => {
        this.setState({timeInput: event})
        this.props.handler(event, 3)
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