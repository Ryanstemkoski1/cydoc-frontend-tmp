import {Input} from "semantic-ui-react";
import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import React, {Component} from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import GridContent from "../../components/GridContent";
import {CONDITIONS} from '../../constants/constants'
import HPIContext from "../../contexts/HPIContext"

//Component that manages the layout of the medical history tab content
export default class MedicalHistoryContent extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.generateListItems = this.generateListItems.bind(this);
    }

    //handles input field events
    handleChange(event, data){
        //console.log(event);
        const values = this.props.values;
        values[data.condition][data.placeholder] = data.value;
        this.context.onContextChange("Medical History", values);
    }

    //handles toggle button events
    handleToggleButtonClick(event, data){
        const values = this.props.values;
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        this.context.onContextChange("Medical History", values);
    }

    render(){
        const rows = this.generateListItems(CONDITIONS);
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<MedicalHistoryNoteRow condition={inputField}/>);

        return(
            <GridContent
                numColumns={4}
                contentHeader={<MedicalHistoryContentHeader />}
                rows={rows}
                customNoteRow={customNoteRow}
            />
        );
    }

    generateListItems(conditions) {
        return conditions.map((condition, index) =>
            <MedicalHistoryNoteRow key={index}
                                   condition={condition}
                                   onset={this.context["Medical History"][condition]["Onset"]}
                                   comments={this.context["Medical History"][condition]["Comments"]}
                                   onChange={this.handleChange}
                                   onToggleButtonClick={this.handleToggleButtonClick}
                                   yesActive={this.context["Medical History"][condition]["Yes"]}
                                   noActive={this.context["Medical History"][condition]["No"]}
            />);
    }
}

