import { Input } from "semantic-ui-react";
import NoteRow from "../../components/NoteRow";
import React, {Component} from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import YesNoContent from "../YesNoContent";

const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV", ];
const listItems = conditions.map((condition) =>
    <NoteRow condition={condition} />);
const inputField = (<Input placeholder="Condition"/>);
const customNoteRow = (<NoteRow condition={inputField}/>);

export default class MedicalHistoryContent extends Component {

    render(){
        return(
            <YesNoContent
                numColumns={4}
                pageName="medical history"
                contentHeader={<MedicalHistoryContentHeader />}
                listItems={listItems}
                customNoteRow={customNoteRow}
            />
        );
    }
}

