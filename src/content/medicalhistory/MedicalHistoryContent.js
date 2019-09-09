import { Input } from "semantic-ui-react";
import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import React, {Component} from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import YesNoContent from "../YesNoContent";


export default class MedicalHistoryContent extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, data){
        const values = this.props.values;
        values[data.condition][data.placeholder] = data.value;
        this.props.onMedicalHistoryChange(data, values);
    }


    render(){
        const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV"];
        const listItems = conditions.map((condition, index) =>
            <MedicalHistoryNoteRow key={index}
                                   condition={condition}
                                   onset={this.props.values[condition]["Onset"]}
                                   comments={this.props.values[condition]["Comments"]}
                                   onChange={this.handleChange}/>);

        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<MedicalHistoryNoteRow condition={inputField}/>);

        return(
            <YesNoContent
                numColumns={4}
                contentHeader={<MedicalHistoryContentHeader />}
                listItems={listItems}
                customNoteRow={customNoteRow}
            />
        );
    }
}

