import React, {Component} from 'react'
import { Button, Popup } from 'semantic-ui-react'
import HPIContext from 'contexts/HPIContext.js'

export default class AbdomenExamButtons extends Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.onClick = this.onClick.bind(this)
    }

    onClick(event, data) {
        var values = this.context["Physical Exam"]
        var prevState = values.widgets["Abdomen"][this.props.ab_quadrant][data.children]
        values.widgets["Abdomen"][this.props.ab_quadrant][data.children] = !prevState
        this.context.onContextChange("Physical Exam", values);
    }

    render() {
        var ab_quadrant_buttons = []
        var ab_quadrant_dict = this.context["Physical Exam"].widgets["Abdomen"][this.props.ab_quadrant]
        for (var ab_quadrant_button in ab_quadrant_dict) {
            ab_quadrant_buttons.push(
                <Button fluid
                    size = {'small'}
                    key={this.props.ab_quadrant + " " + ab_quadrant_button}
                    color={this.context["Physical Exam"].widgets["Abdomen"][this.props.ab_quadrant][ab_quadrant_button] ? 'red' : ''}
                    onClick={this.onClick}
                    style = {{marginBottom: 5}}
                > 
                    {ab_quadrant_button} 
                </Button>
            )
        } 
        return (
                <div>{ab_quadrant_buttons}</div>
              )
        }
    }

