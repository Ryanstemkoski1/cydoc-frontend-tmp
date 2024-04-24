import React, { useMemo } from 'react';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';
import { HOME_MED_BP } from 'constants/breakpoints.js';
import { homeContent } from 'constants/homeContent';
import './Home.css';
import { useState } from 'react';
import SignUpForm from 'pages/Account/SignUpForm';
import Image from 'next/image';

const previewPlan =
    'https://cydoc-static-files.s3.amazonaws.com/about-plan.png';
const previewROS = 'https://cydoc-static-files.s3.amazonaws.com/about-ROS.png';

interface Props {
    windowWidth: number;
}

export const MeetCydocSection = (props: Props) => {
    const [signUpActive, setSignUpActive] = useState(false);

    const HEADER_SECTION = useMemo(
        () => (
            <>
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
            </>
        ),
        [setSignUpActive]
    );

    return (
        <Segment className='meet-cydoc'>
            <SignUpForm
                modalOpen={signUpActive}
                closeModal={() => setSignUpActive(false)}
            />
            {props.windowWidth < HOME_MED_BP ? (
                <>
                    {HEADER_SECTION}
                    <div className='preview-image-container'>
                        <Image
                            src={previewROS}
                            alt='cydoc review of service'
                            // verticalAlign='bottom'
                            className='preview-image-small ros-small'
                        />
                        <Image
                            src={previewPlan}
                            alt='cydoc preview plan'
                            // verticalAlign='bottom'
                            className='preview-image-small plan-small'
                        />
                    </div>
                </>
            ) : (
                <Grid relaxed columns={2} centered>
                    <Grid.Column className='meet-cydoc-text'>
                        {HEADER_SECTION}
                    </Grid.Column>
                    <Grid.Column className='image-parent'>
                        <Image
                            src={previewROS}
                            alt='cydoc preview page'
                            // verticalAlign='bottom'
                            className='preview-image ros'
                        />
                        <Image
                            src={previewPlan}
                            alt='cydoc preview page'
                            // verticalAlign='bottom'
                            className='preview-image plan'
                        />
                    </Grid.Column>
                </Grid>
            )}
        </Segment>
    );
};
