import React, {Component} from 'react'
import {Segment} from 'semantic-ui-react'
import NumericInput from "react-numeric-input";
import HPIContext from 'contexts/HPIContext.js'

class plan extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context)
        this.state = {
            textInput: "",
            yes_id: 0,
            no_id: 0,
            yes_color: "whitesmoke",
            no_color: "whitesmoke",
        }
        this.handleYesClick = this.handleYesClick.bind(this)
        this.handleNoClick = this.handleNoClick.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange = (title, event) => {
        // this.setState({textInput: event.target.value})
        const values = this.context["plan"]
        values[title] = typeof event === 'object' ? event.target.value : event
        this.context.onContextChange("plan", values)
    }

    handleYesClick() {
        this.setState({yes_color: "lightslategrey", yes_id: 1, no_id: -1, no_color: "whitesmoke"})
        const values = this.context["plan"]
        values["Admitting Patient"] = "Yes"
        this.context.onContextChange("plan", values)
    }

    handleNoClick() {
        this.setState({yes_color: "whitesmoke", yes_id: -1, no_id: 1, no_color: "lightslategrey"})
        const values = this.context["plan"]
        values["Admitting Patient"] = "No"
        this.context.onContextChange("plan", values)
    }

    render() {
        return (
            <div>
                <Segment>
                    <h4> Differential Diagnosis </h4>
                    <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Differential Diagnosis", event)} /> </div>
                </Segment>
                <Segment>
                    <h4> Plan (Medications) </h4>
                    <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Medications Plan", event)} /> </div>
                </Segment>
                <Segment>
                    <h4> Plan (Procedures/Services) </h4>
                    <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Procedures Plan", event)} /> </div>
                </Segment>
                <Segment>
                <h4> Referrals/Consults </h4>
                <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Referrals/Consults", event)} /> </div>
                </Segment>
                <Segment>
                    <h4> How sick is the patient on a scale from 1 (healthy) to 10 (critically ill)? </h4>
                <NumericInput min={0} max={10} onChange={this.handleInputChange} />
                <h4> Will you be admitting this patient to the hospital? </h4>
                <button className="button_yesno" style={{backgroundColor: this.state.yes_color}} onClick={this.handleYesClick}> Yes </button> 
                <button className="button_yesno" style={{backgroundColor: this.state.no_color}} onClick={this.handleNoClick}> No </button>

                    <h4> What other questions did you ask the patient that were not part of the existing questionnaire? </h4>
                    <div className="ui form"> <textarea onChange={(event) => this.handleInputChange("Other Questions", event)} /> </div>
                </Segment>

            </div>
        )
    }
}

export default plan