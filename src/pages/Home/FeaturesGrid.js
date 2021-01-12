import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { HOME_LARGE_BP, HOME_SMALL_BP } from 'constants/breakpoints.js';
import { homeContent } from 'constants/homeContent';
import './Home.css';

export const FeaturesGrid = (props) => {
    const { windowWidth } = props;
    if (windowWidth < HOME_SMALL_BP) {
        return (
            <div className='features-content-mobile'>
                <Icon
                    name='pencil'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.HPI.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.HPI.description}
                </p>
                <Icon
                    name='user outline'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.patientHistory.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.patientHistory.description}
                </p>
                <Icon
                    name='redo'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.ROS.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.ROS.description}
                </p>
                <Icon
                    name='user md'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.physcialExam.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.physcialExam.description}
                </p>
                <Icon
                    name='chart line'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.plan.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.plan.description}
                </p>
                <Icon
                    name='clipboard check'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {homeContent.features.generatedNote.header}
                </p>
                <p className='feature-description'>
                    {homeContent.features.generatedNote.description}
                </p>
            </div>
        );
    } else if (windowWidth < HOME_LARGE_BP) {
        return (
            <Grid columns={2} relaxed className='features-content'>
                <Grid.Row textAlign='center' className='icon-row features-row'>
                    <Grid.Column>
                        <Icon
                            name='pencil'
                            className='white-icon'
                            size='huge'
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Icon
                            name='user outline'
                            className='white-icon'
                            size='huge'
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column className='feature-title'>
                        <p>{homeContent.features.HPI.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{homeContent.features.patientHistory.header}</p>
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
                </Grid.Row>
                <Grid.Row textAlign='center' className='icon-row features-row'>
                    <Grid.Column>
                        <Icon name='redo' className='white-icon' size='huge' />
                    </Grid.Column>
                    <Grid.Column>
                        <Icon
                            name='user md'
                            className='white-icon'
                            size='huge'
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column className='feature-title'>
                        <p>{homeContent.features.ROS.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{homeContent.features.physcialExam.header}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column>
                        <p className='feature-description'>
                            {homeContent.features.ROS.description}
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <p className='feature-description'>
                            {homeContent.features.physcialExam.description}
                        </p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='icon-row features-row'>
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
                        <p>{homeContent.features.plan.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{homeContent.features.generatedNote.header}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
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
    }

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
                    <p>{homeContent.features.physcialExam.header}</p>
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
                        {homeContent.features.physcialExam.description}
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
