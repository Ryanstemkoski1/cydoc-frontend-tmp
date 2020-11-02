import React from "react";
import { Icon, Button } from 'semantic-ui-react';
import "../css/Button.css"
import DiseaseTag from "./DiseaseTag";
import HPIContext from 'contexts/HPIContext.js';
import '../../HPI.css';
import diseaseCodes from '../../../../../../../constants/diseaseCodes'

class ButtonItem extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        // create disease buttons based on user's chosen diseases 
        var diseaseButtons = this.props.diseases_list.map(disease =>
            <DiseaseTag
                key={disease}
                name={Object.keys(diseaseCodes).find(key => diseaseCodes[key] === disease)}
                handler = {this.handler}
            />)
        this.state = {
            diseaseButtons: diseaseButtons,
            diseaseArray: this.context["positivecategories"].includes(this.props.name) ? diseaseButtons : []
        }
        this.handleClick = this.handleClick.bind(this)
    }

    // add body system to positive categories if not there yet 
    // consider deprecating - same as handleClick() and state
    componentDidMount() {
        if (!(this.context["positivecategories"].includes(this.props.name))) {
            this.setState({diseaseArray: this.state.diseaseButtons})
            this.context["positivecategories"].push(this.props.name)
        }
    }

    // if the current body system isn't in positivecategories, then add it. Otherwise, if it is already in positivecategories,
    // then clicking it again would remove it from positivecategories and thus prevent the diseaseArray from displaying.
    handleClick() {
        if (!(this.context["positivecategories"].includes(this.props.name))) {
            this.setState({diseaseArray: this.state.diseaseButtons})
            this.context["positivecategories"].push(this.props.name)
        }
        else {
            this.setState({diseaseArray: []})
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
                    {this.state.diseaseArray}
                </div>
            </div>
        )
    }
}

export default ButtonItem