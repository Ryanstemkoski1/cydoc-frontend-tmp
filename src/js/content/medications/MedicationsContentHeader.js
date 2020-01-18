import React from 'react';
import {Grid, Header} from "semantic-ui-react";

//functional component for the Medical History header above the divider
export default function MedicalHistoryContentHeader() {
    return (
        <Grid columns={4} centered>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h4">Drug Name</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Start Date</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Schedule</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Dose</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Reason for Taking</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Side Effects</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Comments</Header>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
