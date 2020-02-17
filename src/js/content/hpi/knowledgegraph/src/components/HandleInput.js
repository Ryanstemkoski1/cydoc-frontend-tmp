import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from "../../../../../contexts/HPIContext";

class HandleInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        const answers = this.context["hpi"][this.props.category_code][this.props.uid]["response"]
        this.state = {
            textInput: answers !== null ? answers: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        // this.props.handler(event.target.value, 2)
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["response"] = event.target.value
        this.context.onContextChange("hpi", values)
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