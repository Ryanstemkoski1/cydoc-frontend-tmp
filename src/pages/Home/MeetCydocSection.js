import React from 'react';
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { HOME_MED_BP } from 'constants/breakpoints.js';
import { homeContent } from 'constants/homeContent';
import './Home.css';
import PreviewHistory from '../../assets/home/patient-history.png';
import PreviewROS from '../../assets/home/ros.png';

export const MeetCydocSection = (props) => {
    return props.windowWidth < HOME_MED_BP ? (
        <Segment className='meet-cydoc'>
            <Header
                as='h1'
                content={homeContent.meetCydoc.header}
                className='home-header white'
            />
            <Header
                as='h2'
                content={homeContent.meetCydoc.subheader}
                className='home-sub-header'
            />
            <p>
                {homeContent.meetCydoc.description}
            </p>
            <Button
                primary
                circular
                size='huge'
                className='inquire-button'
                as='a'
                href='https://aemail.com/lYPj'
                content={homeContent.meetCydoc.inquireNow}
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
                        content={homeContent.meetCydoc.header}
                        className='home-header white'
                    />
                    <Header
                        as='h2'
                        content={homeContent.meetCydoc.subheader}
                        className='home-sub-header'
                    />
                    <p>
                        {homeContent.meetCydoc.description}
                    </p>
                    <Button
                        primary
                        circular
                        size='huge'
                        className='inquire-button'
                        as='a'
                        href='https://aemail.com/lYPj'
                        content={homeContent.meetCydoc.inquireNow}
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
