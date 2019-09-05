import React, {Component} from 'react';
import {Grid, Header} from "semantic-ui-react";

export default class FamilyHistoryContentHeader extends Component {
    render() {
        return (
            <Grid columns={5} centered >
                <Grid.Row>
                    <Grid.Column>
                        <Header as="h4">Condition</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4">Family Hx?</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4">Family Member</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4">Cause of Death</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4">Comments</Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
};
