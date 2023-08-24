import { homeContent } from 'constants/homeContent';
import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import './Home.css';

export const FeaturesGrid = () => {
    return (
        <Grid columns={3} relaxed className='features-content'>
            <Grid.Row textAlign='center' className='icon-row features-row'>
                <Grid.Column>
                    <Icon name='pencil' className='white-icon' size='huge' />
                </Grid.Column>
                <Grid.Column>
                    <Icon
                        name='user outline'
                        className='white-icon'
                        size='huge'
                    />
                </Grid.Column>
                <Grid.Column>
                    <Icon name='redo' className='white-icon' size='huge' />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.HPI.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.patientHistory.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.ROS.header}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.HPI.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.patientHistory.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.ROS.description}
                    </p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='icon-row features-row'>
                <Grid.Column>
                    <Icon name='user md' className='white-icon' size='huge' />
                </Grid.Column>
                <Grid.Column>
                    <Icon
                        name='chart line'
                        className='white-icon'
                        size='huge'
                    />
                </Grid.Column>
                <Grid.Column>
                    <Icon
                        name='clipboard check'
                        className='white-icon'
                        size='huge'
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.medicalKnowledge.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.plan.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{homeContent.features.generatedNote.header}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.medicalKnowledge.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.plan.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {homeContent.features.generatedNote.description}
                    </p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
