import React from "react";
import { Icon, Button } from 'semantic-ui-react';
import "../css/Button.css"
import DiseaseTag from "./DiseaseTag";
import HPIContext from 'contexts/HPIContext.js';
import '../../hpi.css';

class ButtonItem extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        var disease_buttons = this.props.diseases_list.map(disease =>
            <DiseaseTag
                key={disease}
                name={disease}
                handler = {this.handler}
            />)
        this.state = {
            disease_buttons: disease_buttons,
            disease_array: this.context["positivecategories"].includes(this.props.name) ? disease_buttons : [],
            diseases_positive: []
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        if (!(this.context["positivecategories"].includes(this.props.name))) {
            this.setState({disease_array: this.state.disease_buttons})
            this.context["positivecategories"].push(this.props.name)
        }
        else {
            this.setState({disease_array: []})
            this.context["positivecategories"].splice(this.context["positivecategories"].indexOf(this.props.name), 1)
        }
    }

    render() {
        return (
            <div>
                <Button basic className="hpi-disease-button"  onClick={this.handleClick}>
                    <Icon name='dropdown' /> 
                    {this.props.name}
                </Button>
                <div className="diseases-array">
                    {this.state.disease_array}
                </div>
            </div>
        )
    }
}

export default ButtonItem