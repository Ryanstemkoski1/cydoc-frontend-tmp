import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { HOME_XS_BP } from 'constants/breakpoints.js';
import { homeContent } from 'constants/homeContent';
import './Home.css';

export const BetterNotesIcons = (props) => {
    return props.windowWidth < HOME_XS_BP ? (
        <Grid>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column textAlign='center'>
                    <Icon name='window restore outline' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.intuitiveInterface}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column textAlign='center'>
                    <Icon name='globe' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.webBased}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' textAlign='right'>
                <Grid.Column textAlign='center'>
                    <Icon name='mobile alternate' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.mobileFriendly}</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    ) : (
        <Grid>
            <Grid.Row>
                <Grid.Column textAlign='center' tablet={5}>
                    <Icon name='window restore outline' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.intuitiveInterface}</p>
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={6}>
                    <Icon name='globe' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.webBased}</p>
                </Grid.Column>
                <Grid.Column textAlign='center' tablet={5}>
                    <Icon name='mobile alternate' className='white-icon' size='huge' />
                    <p>{homeContent.betterNotes.mobileFriendly}</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
