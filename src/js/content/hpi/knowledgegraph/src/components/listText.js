import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from "../../../../../contexts/HPIContext";

class listInput extends React.Component {
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
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["response"] = event.target.value
        this.context.onContextChange("hpi", values)
    }

    render() {
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

export default listInput