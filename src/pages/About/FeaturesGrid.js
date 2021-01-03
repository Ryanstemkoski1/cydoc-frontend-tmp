import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import {
    ABOUT_PAGE_LARGE_BP,
    ABOUT_PAGE_SMALL_BP,
} from 'constants/breakpoints.js';
import { aboutContent } from 'constants/aboutContent';
import './AboutPage.css';

export const FeaturesGrid = (props) => {
    const { windowWidth } = props;
    if (windowWidth < ABOUT_PAGE_SMALL_BP) {
        return (
            <div className='features-content-mobile'>
                <Icon
                    name='pencil'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.HPI.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.HPI.description}
                </p>
                <Icon
                    name='user outline'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.patientHistory.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.patientHistory.description}
                </p>
                <Icon
                    name='redo'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.ROS.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.ROS.description}
                </p>
                <Icon
                    name='user md'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.physcialExam.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.physcialExam.description}
                </p>
                <Icon
                    name='chart line'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.plan.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.plan.description}
                </p>
                <Icon
                    name='clipboard check'
                    className='white-icon mobile-icon'
                    size='huge'
                />
                <p className='feature-title'>
                    {aboutContent.features.generatedNote.header}
                </p>
                <p className='feature-description'>
                    {aboutContent.features.generatedNote.description}
                </p>
            </div>
        );
    } else if (windowWidth < ABOUT_PAGE_LARGE_BP) {
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
                        <p>{aboutContent.features.HPI.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{aboutContent.features.patientHistory.header}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.HPI.description}
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.patientHistory.description}
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
                        <p>{aboutContent.features.ROS.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{aboutContent.features.physcialExam.header}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.ROS.description}
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.physcialExam.description}
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
                        <p>{aboutContent.features.plan.header}</p>
                    </Grid.Column>
                    <Grid.Column className='feature-title'>
                        <p>{aboutContent.features.generatedNote.header}</p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign='center' className='features-row'>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.plan.description}
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <p className='feature-description'>
                            {aboutContent.features.generatedNote.description}
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
                    <p>{aboutContent.features.HPI.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{aboutContent.features.patientHistory.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{aboutContent.features.ROS.header}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.HPI.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.patientHistory.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.ROS.description}
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
                    <p>{aboutContent.features.physcialExam.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{aboutContent.features.plan.header}</p>
                </Grid.Column>
                <Grid.Column className='feature-title'>
                    <p>{aboutContent.features.generatedNote.header}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center' className='features-row'>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.physcialExam.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.plan.description}
                    </p>
                </Grid.Column>
                <Grid.Column>
                    <p className='feature-description'>
                        {aboutContent.features.generatedNote.description}
                    </p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
