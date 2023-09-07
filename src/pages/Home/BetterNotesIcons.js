import { homeContent } from 'constants/homeContent';
import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import './Home.css';

export const BetterNotesIcons = () => {
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column textAlign='center' tablet={5}>
                    <Icon
                        name='window restore outline'
                        className='white-icon'
                        size='huge'
                    />
                    <p>{homeContent.betterNotes.intuitiveInterface}</p>
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={6}>
                    <Icon name='globe' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.webBased}</p>
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={5}>
                    <Icon
                        name='mobile alternate'
                        className='white-icon'
                        size='huge'
                    />
                    <p>{homeContent.betterNotes.mobileFriendly}</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
