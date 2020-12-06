import React from "react"
import "./ButtonItem"
import HPIContext from 'contexts/HPIContext.js';
import { CONDITION_DEFAULT } from '../../../../discussionplan/DiscussionPlanDefaults';
import diseaseCodes from '../../../../../../../constants/diseaseCodes'

class DiseaseTag extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = { 
            category: diseaseCodes[this.props.name]
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let values = this.context['positivediseases']
        const plan = {...this.context['plan']}
        let nameIndex = values.indexOf(this.state.category)
        if (nameIndex > -1) {
            values.splice(nameIndex, 1)
            plan['conditions'].splice(plan['conditions'].findIndex(disease => disease.name === this.state.category), 1)

        }
        else {
            values = values.concat(this.state.category)
            plan['conditions'].unshift({... JSON.parse(JSON.stringify(CONDITION_DEFAULT)), name: this.state.category });
        }
        this.context.onContextChange("positivediseases", values)
        this.context.onContextChange("activeHPI", values[0])
        this.context.onContextChange("plan", plan)
    }

    render() {
        const { category } = this.state 
        // change color of button and font based on whether the user chose this disease category or not
        let color = this.context['positivediseases'].indexOf(category) > -1 ? "lightslategrey" : "whitesmoke"
        let fontColor = this.context['positivediseases'].indexOf(category) > -1 ? "white" : "black"
        return (
            <button
                className="tag_text"
                style={{
                    display: !category && "none", //display button only if it's not none and is a valid name
                    backgroundColor: color,
                    color: fontColor
                }}
                onClick={this.handleClick}
            >
                {this.props.name}
            </button>
        )
    }
}

export default DiseaseTag