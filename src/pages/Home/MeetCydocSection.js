import { homeContent } from 'constants/homeContent';
import SignUpModal from 'pages/Account/SignUpModal';
import React, { useState } from 'react';
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react';
import './Home.css';
const previewPlan =
    'https://cydoc-static-files.s3.amazonaws.com/about-plan.png';
const previewROS = 'https://cydoc-static-files.s3.amazonaws.com/about-ROS.png';

export const MeetCydocSection = () => {
    const [signUpActive, setSignUpActive] = useState(false);

    const resetSignupState = () => {
        setSignUpActive(false);
    };

    return (
        <Segment className='meet-cydoc'>
            {signUpActive && (
                <SignUpModal
                    navToSignUp={signUpActive}
                    reloadModal={resetSignupState}
                />
            )}
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
                    <p>{homeContent.meetCydoc.description}</p>
                    <Button
                        primary
                        circular
                        size='huge'
                        className='inquire-button'
                        content={homeContent.meetCydoc.inquireNow}
                        onClick={() => setSignUpActive(true)}
                    />
                </Grid.Column>
                <Grid.Column className='image-parent'>
                    <Image
                        src={previewROS}
                        alt='cydoc preview page'
                        verticalAlign='bottom'
                        className='preview-image ros'
                    />
                    <Image
                        src={previewPlan}
                        alt='cydoc preview page'
                        verticalAlign='bottom'
                        className='preview-image plan'
                    />
                </Grid.Column>
            </Grid>
        </Segment>
    );
};
