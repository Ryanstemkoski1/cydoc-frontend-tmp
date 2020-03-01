import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from "../../../../../contexts/HPIContext";

class HandleInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        const answers = this.props.am_child ? values['children'][this.props.child_uid]['response'] : values["response"]
        this.state = {
            textInput: answers !== null ? answers: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = event.target.value 
        else values[this.props.category_code][this.props.uid]["response"] = event.target.value
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
                <textarea 
                    type='text'
                    onChange={this.handleInputChange}
                    rows='4'
                    value={this.state.textInput}
                /> 
                </Form>
            
            )}
    }
}

export default HandleInput