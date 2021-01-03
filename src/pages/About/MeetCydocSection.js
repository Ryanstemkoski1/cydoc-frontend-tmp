import React from 'react';
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { ABOUT_PAGE_MED_BP } from 'constants/breakpoints.js';
import { aboutContent } from 'constants/aboutContent';
import './AboutPage.css';
import PreviewHistory from '../../assets/about-page/patient-history.png';
import PreviewROS from '../../assets/about-page/ros.png';

export const MeetCydocSection = (props) => {
    return props.windowWidth < ABOUT_PAGE_MED_BP ? (
        <Segment className='meet-cydoc'>
            <Header
                as='h1'
                content={aboutContent.meetCydoc.header}
                className='about-header white'
            />
            <Header
                as='h2'
                content={aboutContent.meetCydoc.subheader}
                className='about-sub-header'
            />
            <p>{aboutContent.meetCydoc.description}</p>
            <Button
                primary
                circular
                size='huge'
                className='inquire-button'
                as='a'
                href='https://aemail.com/lYPj'
                content={aboutContent.meetCydoc.inquireNow}
            />
            <div className='preview-image-container'>
                <Image
                    src={PreviewROS}
                    alt='cydoc preview page'
                    verticalAlign='bottom'
                    className='preview-image-small ros-small'
                />
                <Image
                    src={PreviewHistory}
                    alt='cydoc preview page'
                    verticalAlign='bottom'
                    className='preview-image-small history-small'
                />
            </div>
        </Segment>
    ) : (
        <Segment className='meet-cydoc'>
            <Grid relaxed columns={2} centered>
                <Grid.Column className='meet-cydoc-text'>
                    <Header
                        as='h1'
                        content={aboutContent.meetCydoc.header}
                        className='about-header white'
                    />
                    <Header
                        as='h2'
                        content={aboutContent.meetCydoc.subheader}
                        className='about-sub-header'
                    />
                    <p>{aboutContent.meetCydoc.description}</p>
                    <Button
                        primary
                        circular
                        size='huge'
                        className='inquire-button'
                        as='a'
                        href='https://aemail.com/lYPj'
                        content={aboutContent.meetCydoc.inquireNow}
                    />
                </Grid.Column>
                <Grid.Column className='image-parent'>
                    <Image
                        src={PreviewROS}
                        alt='cydoc preview page'
                        verticalAlign='bottom'
                        className='preview-image ros'
                    />
                    <Image
                        src={PreviewHistory}
                        alt='cydoc preview page'
                        verticalAlign='bottom'
                        className='preview-image history'
                    />
                </Grid.Column>
            </Grid>
        </Segment>
    );
};
