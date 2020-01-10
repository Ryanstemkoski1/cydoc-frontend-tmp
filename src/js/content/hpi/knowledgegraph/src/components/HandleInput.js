import React from 'react'
import {Input, Form} from "semantic-ui-react";

class HandleInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            textInput: this.props.answers !== null ? this.props.answers[0]: ''
        }
    }

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        this.props.handler(event.target.value, 2)
    }

    render() {
        if (this.props.type === 'SHORT-TEXT') {
            return (
                <Form>
                    <textarea
                        type='text'
                        onChange={this.handleInputChange}
                        rows='4'
                        value={this.state.textInput}
                    />
                </Form>
            ) }
        else if (this.props.type === 'LIST-TEXT') {
            return (
                <Form>
                    <Input
                        type='text'
                        onChange={this.handleInputChange}
                        value={this.state.textInput}
                    />
                </Form>
            )}
    }
}

export default HandleInput