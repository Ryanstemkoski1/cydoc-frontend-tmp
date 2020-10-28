import React, {Fragment, Component} from 'react'
import { Grid, Button } from "semantic-ui-react";
import NumericInput from "react-numeric-input";
import HPIContext from 'contexts/HPIContext.js';

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
        values['nodes'][this.props.node]["response"][1] = event.target.title
        this.context.onContextChange("hpi", values);
    }

    handleInputChange = (event) => {
        const values = this.context["hpi"]
        values['nodes'][this.props.node]["response"][0] = event
        this.context.onContextChange("hpi", values)
    }

    render() {
        const values = this.context["hpi"]['nodes'][this.props.node]
        var value = values["response"][0]
        var time_value = values["response"][1]
        var question = values['text']
        const time_options = ["minutes", "hours", "days", "weeks", "months", "years"]
        var button_map = []
        for (var time_index = 0; time_index < time_options.length; time_index += 3) {
            button_map.push(
                <Grid.Row columns='equal' style={{padding: 0}}> 
                        {time_options.slice(time_index, time_index+3).map((time_item) => 
                        <Grid.Column style={{padding: 5}}>
                            <Button
                                color={time_value === time_item ? 'grey' : ''}
                                title={time_item}
                                onClick={this.handleToggleButtonClick}
                                style={{width: '100%'}}
                            > {time_item} </Button>
                            </Grid.Column>
                            )}
                </Grid.Row>)
        }
        return (
            <div style={{marginTop: 30}}> 
                <Grid columns={2}>
                    <Grid.Row> 
                        <Grid.Column width={3}>
                            <div style={{position: 'relative', top: '30%', left: '30%'}}> 
                                <NumericInput
                                    size={10}
                                    key={question}
                                    value={value}
                                    min={0} 
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={6}> 
                            <Grid> 
                                {button_map}
                            </Grid>
                        </Grid.Column>
                    </Grid.Row> 
                </Grid>
            </div>
        )
    }
}

export default TimeInput