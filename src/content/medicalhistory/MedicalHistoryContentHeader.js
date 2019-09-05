import React from 'react';
import {Grid, Header} from "semantic-ui-react";

export default function Component() {
    return (
        <Grid columns={4} centered>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h4">Condition</Header>
                </Grid.Column>
                <Grid.Column/>
                <Grid.Column>
                    <Header as="h4">Onset</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as="h4">Comments</Header>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
