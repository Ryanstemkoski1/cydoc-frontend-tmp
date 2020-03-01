import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from "../../../../../contexts/HPIContext";

class listText extends React.Component {
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
            <div> 
                <h3 id="List Text"> Hello </h3>
            </div>
            )}
    }

export default listText