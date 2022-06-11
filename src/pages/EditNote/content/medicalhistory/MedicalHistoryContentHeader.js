import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

//functional component for the Medical History header above the divider
export default function MedicalHistoryContentHeader() {
    return (
        <Grid columns={7} centered className='sticky-header'>
            <Grid.Row>
                <Grid.Column>
                    <Header as='h4'>Condition</Header>
                </Grid.Column>
                <Grid.Column />
                <Grid.Column>
                    <Header as='h4'>Start Year</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as='h4'>Has Condition Resolved?</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as='h4'>End Year</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header as='h4'>Comments</Header>
                </Grid.Column>
                <Grid.Column className='delete-header' width={2}></Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
