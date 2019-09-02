import React from 'react';
import {Grid, Header} from "semantic-ui-react";

export default () => (
    <Grid columns={4} centered>
        <Grid.Row>
            <Grid.Column>
                <Header>Condition</Header>
            </Grid.Column>
            <Grid.Column/>
            <Grid.Column>
                <Header>Onset</Header>
            </Grid.Column>
            <Grid.Column>
                <Header>Comments</Header>
            </Grid.Column>
        </Grid.Row>
    </Grid>
);
