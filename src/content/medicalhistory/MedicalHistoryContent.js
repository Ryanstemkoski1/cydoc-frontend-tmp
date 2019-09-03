import {Divider, Grid, Header, Segment} from "semantic-ui-react";
import NoteRow from "../../components/NoteRow";
import React, {Component, Fragment} from 'react';
import MedicalHistoryContentHeader from "../MedicalHistoryContentHeader";

const conditions = ["Type II Diabetes", "Myocardial Infarction", "Hypertension",  "Hypercholesteremia", "Depression", "HIV", ];
const listItems = conditions.map((condition) =>
    <NoteRow condition={condition} />);

export default class MedicalHistoryContent extends Component {

    render(){
        return(
            <Fragment>
                <Header as="h3" textAlign="center">
                    medical history
                </Header>
                <br/>
                <MedicalHistoryContentHeader/>
                <Divider/>
                <Grid columns={4} verticalAlign='middle' >
                    {listItems}
                </Grid>
            </Fragment>

        );
    }
}

