import React, {Component, Fragment} from 'react';
import GridContent from "../GridContent";
import FamilyHistoryContentHeader from "./FamilyHistoryContentHeader";
import {Input} from "semantic-ui-react";
import FamilyHistoryNoteRow from "./FamilyHistoryNoteRow";


//TODO: finish the styling for this page

export default class FamilyHistoryContent extends Component {
    render(){
        const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV", ];
        const listItems = conditions.map((condition) =>
            <FamilyHistoryNoteRow condition={condition} />);
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<FamilyHistoryNoteRow condition={inputField}/>);


        return(
            <Fragment>
                <GridContent
                    numColumns={5}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    customNoteRow={customNoteRow} />
            </Fragment>
        )
    }
}