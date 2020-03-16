import React from 'react'
import {Input, Form} from "semantic-ui-react";
import HPIContext from "../../contexts/HPIContext";

class MedicalHistoryInput extends React.Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        var condition = this.context["Medical History"][this.props.index]['Condition']
        var answer = condition.length === 0 ? "" : condition
        this.state = {
            textInput: answer,
            isTitleFocused: condition.length === 0 ? true : false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => { 
        this.setState({textInput: event.target.value})
        const values = this.context["Medical History"]
        values[this.props.index]["Condition"] = event.target.value
        this.context.onContextChange("Medical History", values)
    }

    render() {
        return(
            <Input
                className={this.state.isTitleFocused === true ? "ui input focus" : "ui input transparent"}
                type='text'
                placeholder="Condition"
                style={{fontSize: 14, marginBottom: 5, outline: 'none'}}
                onChange={this.handleInputChange}
                onFocus={()=>{this.setState({isTitleFocused: true})}}
                onBlur={()=>{this.setState({isTitleFocused: false})}}
                value={this.state.textInput} 
                />
        )
        }
    }

export default MedicalHistoryInput