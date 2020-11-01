import React, {Component} from "react"
import "./ButtonItem"
import HPIContext from 'contexts/HPIContext.js';
import '../../HPI.css';
import diseaseCodes from '../../../../../../../constants/diseaseCodes'

class PositiveDiseases extends Component {
    // If you wrap <div> around the button, you can get the buttons to line up under each other.
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.handleClick = this.handleClick.bind(this) 
    }

    handleClick() {
        const plan = {...this.context['plan']}
        let values = this.context['positivediseases']
        let disease_code = diseaseCodes[this.props.name]
        if (values.indexOf(disease_code) > -1) {
            values.splice(values.indexOf(disease_code), 1)
            plan['conditions'].splice(plan['conditions'].findIndex(disease => disease.name === disease_code), 1)
        }
        this.context.onContextChange("positivediseases", values)
        this.context.onContextChange("plan", plan) 

    }

    render() {
        return (
            <button
                className="tag_text positive-disease"
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default PositiveDiseases