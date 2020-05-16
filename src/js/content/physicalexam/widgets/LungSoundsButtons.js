import React, {Component} from 'react'
import { Button, Popup } from 'semantic-ui-react'
import HPIContext from '../../../contexts/HPIContext'

export default class LungSoundsButtons extends Component {
    static contextType = HPIContext 
    constructor(props, context) {
        super(props, context)
        this.onClick = this.onClick.bind(this)
        this.onPopupClick = this.onPopupClick.bind(this)
    }

    onPopupClick(event, data) {
        var values = this.context["Physical Exam"]
        values.widgets["Lungs"][this.props.lung_lobe][data.children[1]] = true 
        this.context.onContextChange("Physical Exam", values);
    }

    onClick(event, data) {
        var more_options = ["bronchial breath sounds","vesicular breath sounds","egophony", "whistling", "stridor"]
        var values = this.context["Physical Exam"]
        var prevState = values.widgets["Lungs"][this.props.lung_lobe][data.children]
        values.widgets["Lungs"][this.props.lung_lobe][data.children] = !prevState
        if (more_options.includes(data.children) && prevState) delete values.widgets["Lungs"][this.props.lung_lobe][data.children]
        this.context.onContextChange("Physical Exam", values);
    }

    render() {
        var more_options = ["bronchial breath sounds","vesicular breath sounds","egophony", "whistling", "stridor"]
        const current_options = Object.keys(this.context["Physical Exam"].widgets["Lungs"][this.props.lung_lobe])
        more_options = more_options.filter(n => !current_options.includes(n))
        var more_options_buttons = more_options.map(
            item => <Button 
                        key={this.props.lung_lobe + " " + item} 
                        color={this.context["Physical Exam"].widgets["Lungs"][this.props.lung_lobe][item] ? 'grey': ''} 
                        onClick={this.onPopupClick}> {item} 
                    </Button>
        )
        var lung_buttons = []
        var lung_button_dict = this.context["Physical Exam"].widgets["Lungs"][this.props.lung_lobe]
        for (var lung_button in lung_button_dict) {
            lung_buttons.push(
                <Button
                    key={this.props.lung_lobe + " " + lung_button}
                    color={this.context["Physical Exam"].widgets["Lungs"][this.props.lung_lobe][lung_button] ? 'grey' : ''}
                    onClick={this.onClick}
                    style = {{marginBottom: 5}}
                > 
                    {lung_button} 
                </Button>
            ) } 
        return (
                <div> 
                    {lung_buttons}
                    {more_options_buttons.length > 0 ? 
                    <Popup trigger={<Button basic circular icon="plus" size='mini'/>} position={this.props.position} flowing hoverable> 
                        {more_options_buttons} 
                    </Popup> : ""}
                </div>
              )
        }
    }

