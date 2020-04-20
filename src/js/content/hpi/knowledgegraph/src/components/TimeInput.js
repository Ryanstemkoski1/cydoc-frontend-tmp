import React, {Fragment, Component} from 'react'
import { Grid } from "semantic-ui-react";
import ToggleButton from "../../../../../components/ToggleButton";
import DatePicker from "react-date-picker";
import NumericInput from "react-numeric-input";
import HPIContext from "../../../../../contexts/HPIContext";

class TimeInput extends Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this)
    }

    handleToggleButtonClick(event){
        const values = this.context["hpi"];
        console.log(event.target.title)
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'][1] = event.target.title
        else values[this.props.category_code][this.props.uid]["response"][1] = event.target.title
        this.context.onContextChange("hpi", values);
    }

    handleInputChange = (event) => {
        const values = this.context["hpi"]
        if (this.props.am_child) values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'][0] = event 
        else values[this.props.category_code][this.props.uid]["response"][0] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        const values = this.context["hpi"][this.props.category_code][this.props.uid]
        var value = this.props.am_child ? values['children'][this.props.child_uid]['response'][0] : values["response"][0]
        var time_value = this.props.am_child ? values['children'][this.props.child_uid]['response'][1] : values["response"][1]
        const time_options = ["minutes", "hours", "days", "weeks", "months", " years "]
        var button_map = time_options.map((time_option, index) => 
            <ToggleButton
                active={time_value === time_option}
                title={time_option}
                onToggleButtonClick={this.handleToggleButtonClick}
                style={{marginTop: 10}}
            />)
        return (
            <Fragment style={{marginTop: 10}}> 
                <Grid columns={2}>
                    <Grid.Row> 
                        <Grid.Column width={3}>
                            <div style={{position: 'relative', top: '30%', left: '30%'}}> 
                                <NumericInput
                                    size={10}
                                    key={this.props.question}
                                    value={value}
                                    min={0} 
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={5}> 
                            {button_map}
                        </Grid.Column>
                    </Grid.Row> 
                </Grid>
            </Fragment>
        )
    }
}

export default TimeInput