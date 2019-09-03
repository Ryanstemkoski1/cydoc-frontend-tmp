import { Grid } from "semantic-ui-react";
import NoteRow from "../../components/NoteRow";
import React, { Component } from 'react';

const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV", ];
const listItems = conditions.map((condition) =>
    <NoteRow condition={condition} />);

export default class MedicalHistoryContent extends Component {

    render(){
        return(
            <Grid columns={4} verticalAlign='middle' >
                {listItems}
            </Grid>
        );
    }
}

