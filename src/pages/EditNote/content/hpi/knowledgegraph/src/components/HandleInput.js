import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js';

class HandleInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        var answers = ""
        if (this.props.am_child) {
            var res = values['children'][this.props.child_uid]['response']
            answers = this.props.type === "LIST-TEXT" ? res[this.props.input_id] : res
        }
        else answers = this.props.type === "LIST-TEXT" ? values['response'][this.props.input_id] : values["response"]
        this.state = {
            textInput: answers !== null ? answers: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        var values = this.context['hpi']
        if (this.props.am_child) delete values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'][this.props.input_id]
        else delete values[this.props.category_code][this.props.uid]['response'][this.props.input_id]
        this.context.onContextChange("hpi", values)
    }

    handleInputChange = (event) => { 
        this.setState({textInput: event.target.value})
        const values = this.context["hpi"] 
        if (this.props.am_child && this.props.type === 'LIST-TEXT') values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'][this.props.input_id] = event.target.value
        else if (this.props.type === 'LIST-TEXT') values[this.props.category_code][this.props.uid]["response"][this.props.input_id] = event.target.value
        else if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = event.target.value 
        else values[this.props.category_code][this.props.uid]["response"] = event.target.value
        this.context.onContextChange("hpi", values)
    }

    render() {
        if (this.props.type === 'SHORT-TEXT') {
            return (
                <Form.TextArea
                    // type='text'
                    onChange={this.handleInputChange}
                    rows='2'
                    value={this.state.textInput}
                />
            ) }
        else if (this.props.type === 'LONG-TEXT') {
            return (
                <Form.TextArea
                    // type='text'
                    onChange={this.handleInputChange}
                    rows='4'
                    value={this.state.textInput}
                />
            )
        }
        else if (this.props.type === 'LIST-TEXT') {
            return (
                <Form> 
                <Input class="ui input focus" style={{width: '50%'}}
                    type='text'
                    onChange={this.handleInputChange}
                    value={this.state.textInput}
                    />
                    <button onClick={this.handleClick}> - </button>
                </Form>
            )}}}

export default HandleInput