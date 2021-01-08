import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js';
import '../css/HandleInput.css';

class HandleInput extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        const values = this.context["hpi"]['nodes'][this.props.node]
        var answers = ""
        // Currently, every letter is saved into Context
        answers = this.props.type === "LIST-TEXT" ? values['response'][this.props.inputID] : values["response"]
        this.state = {
            textInput: answers !== null ? answers: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        var values = this.context['hpi']
        delete values['nodes'][this.props.node]['response'][this.props.inputID] // fix error
        this.context.onContextChange("hpi", values)
    }

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        const values = this.context["hpi"]
        if (this.props.type === 'LIST-TEXT') values['nodes'][this.props.node]["response"][this.props.inputID] = event.target.value
        else values['nodes'][this.props.node]["response"] = event.target.value
        this.context.onContextChange("hpi", values)
    }

    render() {
        var type = this.context['hpi']['nodes'][this.props.node]['responseType']
        if (type === 'SHORT-TEXT') {
            return (
                <Form.TextArea
                    className = 'short-text'
                    //type='text'
                    onChange={this.handleInputChange}
                    rows='2'
                    value={this.state.textInput}
                />
            ) }
        else if (type === 'LONG-TEXT') {
            return (
                <Form.TextArea
                    className = 'long-text'
                    //type='text'
                    onChange={this.handleInputChange}
                    rows='4'
                    value={this.state.textInput}
                />
            )
        }
        else if (type === 'LIST-TEXT') {
            return (
                <Form>
                <Input class="ui input focus"
                    className='list-text'
                    type='text'
                    onChange={this.handleInputChange}
                    value={this.state.textInput}
                    />
                    <button onClick={this.handleClick}> - </button>
                </Form>
            )}}}

export default HandleInput
