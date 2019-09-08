import { Input } from "semantic-ui-react";
import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import React, {Component} from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import YesNoContent from "../YesNoContent";
import constants from "../../constants.json";


export default class MedicalHistoryContent extends Component {

    render(){
        const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV"];
        const listItems = conditions.map((condition, index) =>
            <MedicalHistoryNoteRow key={index} condition={condition} value={this.props.value} onChange={this.props.onChange}/>);
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

