import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import { aboutContent } from 'constants/aboutContent';
import NavMenu from '../../components/navigation/NavMenu';
import { MeetCydocSection } from './MeetCydocSection';
import { BetterNotesIcons } from './BetterNotesIcons';
import { FeaturesGrid } from './FeaturesGrid';
import './AboutPage.css';

class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        return (
            <Fragment>
                <div className='nav-menu-container'>
                    <NavMenu />
                </div>
                <MeetCydocSection windowWidth={windowWidth} />
                <Segment className='better-notes'>
                    <div className='diagonal'>
                        <div className='diagonal-content'>
                            <Header
                                as='h1'
                                content={aboutContent.betterNotes.header}
                                className='about-header white'
                            />
                            <p className='better-notes-description'>{aboutContent.betterNotes.description}</p>
                            <BetterNotesIcons windowWidth={windowWidth} />
                        </div>
                    </div>
                </Segment>
                <Segment className='click-to-tell'>
                    <Header
                        as='h1'
                        content={aboutContent.clickToTell.header}
                        className='about-header white click-to-tell'
                        textAlign='center'
                    />
                </Segment>
                <Segment className='design-doctors'>
                    <div className='design-doctors-content'>
                        <Header
                            as='h1'
                            content={aboutContent.forDoctors.header}
                            className='about-header teal for-doctors'
                        />
                        <Header
                            as='h2'
                            content={aboutContent.forDoctors.subheader}
                            className='about-sub-header for-doctors-sub'
                        />
                    </div>
                </Segment>
                <Segment className='features'>
                    <Header
                        as='h1'
                        content={aboutContent.features.header}
                        className='about-header white'
                        textAlign='center'
                    />
                    <FeaturesGrid windowWidth={windowWidth} />
                </Segment>
                <Segment className='footer'>
                    <Header
                        as={Link}
                        to='/home'
                        content={aboutContent.footer.cydoc}
                        className='about-header light-teal footer-header'
                    />
                    <div className='footer-links'>
                        <div className='footer-link'>
                            <Header
                                as={Link}
                                to='/home'
                                content={aboutContent.footer.home}
                                className='light-teal '
                            />
                        </div>
                        <div className='footer-link'>
                            <Header
                                as={Link}
                                to='/about#'
                                content={aboutContent.footer.about}
                                className='light-teal '
                            />
                        </div>
                        <div className='footer-link'>
                            <Header
                                as={Link}
                                to='/login'
                                content={aboutContent.footer.login}
                                className='light-teal '
                            />
                        </div>
                        <div className='footer-link'>
                            <Header
                                as={Link}
                                to='/register'
                                content={aboutContent.footer.register}
                                className='light-teal '
                            />
                        </div>
                        <div className='footer-link'>
                            <Header
                                as='a'
                                href='https://aemail.com/lYPj'
                                content={aboutContent.footer.contact}
                                className='light-teal '
                            />
                        </div>
                    </div>
                </Segment>
            </Fragment>
        );
    }
}

export default AboutPage;
