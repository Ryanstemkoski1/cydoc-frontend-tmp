import React from 'react';
import {Grid, Header} from "semantic-ui-react";

//functional component for the heading above the divider for Family History
export default function FamilyHistoryContentHeader() {
    return (
        <Grid columns={5} centered>
            <Grid.Row>
                <Grid.Column width={3}>
                    <Header as="h4">Condition</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Header as="h4">Family Hx?</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Header as="h4" style={{display: 'inline'}}>Family Member</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Header as="h4">Cause of Death</Header>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Header as="h4">Comments</Header>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
