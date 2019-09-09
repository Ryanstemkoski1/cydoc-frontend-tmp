import {Input} from "semantic-ui-react";
import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import React, {Component} from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import GridContent from "../../components/GridContent";
import constants from '../../constants'


export default class MedicalHistoryContent extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.generateListItems = this.generateListItems.bind(this);
    }

    handleChange(event, data){
        console.log(event);
        const values = this.props.values;
        values[data.condition][data.placeholder] = data.value;
        this.props.onMedicalHistoryChange(data, values);
    }

    handleToggleButtonClick(event, data){
        const values = this.props.values;
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        this.props.onMedicalHistoryChange(data, values);
    }

    render(){
        const conditions = constants.conditions;
        const rows = this.generateListItems(conditions);
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
                                   onset={this.props.values[condition]["Onset"]}
                                   comments={this.props.values[condition]["Comments"]}
                                   onChange={this.handleChange}
                                   onToggleButtonClick={this.handleToggleButtonClick}
                                   yesActive={this.props.values[condition]["Yes"]}
                                   noActive={this.props.values[condition]["No"]}
            />);
    }
}

