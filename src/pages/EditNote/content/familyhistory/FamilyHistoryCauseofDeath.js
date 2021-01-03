import React, {Component} from "react";
import ToggleButton from 'components/tools/ToggleButton.js';
import HPIContext from 'contexts/HPIContext.js'

export default class FamilyHistoryCauseofDeath extends Component { 

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event, data) {
        let index = data.condition.props.index
        const values = this.context["Family History"];
        values[index]["Cause of Death"][this.props.family_index] = data.title === "Yes" ? true : false 
        this.context.onContextChange("Family History", values);
    }

    render() {
        var cause_of_death = this.context["Family History"][this.props.index]["Cause of Death"][this.props.family_index]
        return ( 
            <div>
                <ToggleButton active={cause_of_death}
                                condition={this.props.condition}
                                title="Yes"
                                onToggleButtonClick={this.handleClick}/>
                <ToggleButton active={cause_of_death === false ? true : false}
                                condition={this.props.condition}
                                title="No"
                                onToggleButtonClick={this.handleClick}/>
            </div>
        )
    }
}