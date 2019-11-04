import React from 'react'
import {Input, Form} from "semantic-ui-react";
import TextArea from "semantic-ui-react/dist/commonjs/addons/TextArea";

class HandleInput extends React.Component {
    constructor() {
        super()
        this.state = {
            textInput: null
        }
        this.handleInputChange = this.handleInputChange(this)
    }

    handleInputChange(event, data) {
        console.log(event)
        this.setState({textInput: event})
        // this.props.handler("Hello", 1)
    }

    render() {
        const inputField = <Input name="textInput" />
        return ( <Form> <TextArea condition={inputField} onChange={this.handleInputChange} /> </Form> )
    }
}

export default HandleInput