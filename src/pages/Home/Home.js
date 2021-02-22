import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import { homeContent } from 'constants/homeContent';
import NavMenu from '../../components/navigation/NavMenu';
import { MeetCydocSection } from './MeetCydocSection';
import { BetterNotesIcons } from './BetterNotesIcons';
import { FeaturesGrid } from './FeaturesGrid';
import './Home.css';

class Home extends Component {
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
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        return (
            <Fragment>
                <NavMenu />
                <MeetCydocSection windowWidth={windowWidth} />
                <Segment className='better-notes'>
                    <div className='diagonal'>
                        <div className='diagonal-content'>
                            <Header
                                as='h1'
                                content={homeContent.betterNotes.header}
                                className='home-header white'
                            />
                            <p className='better-notes-description'>
                                {homeContent.betterNotes.description}
                            </p>
                            <BetterNotesIcons windowWidth={windowWidth} />
                        </div>
                    </div>
                </Segment>
                <Segment className='click-to-tell'>
                    <Header
                        as='h1'
                        content={homeContent.clickToTell.header}
                        className='home-header white click-to-tell'
                        textAlign='center'
                    />
                </Segment>
                <Segment className='design-doctors'>
                    <div className='design-doctors-content'>
                        <Header
                            as='h1'
                            content={homeContent.forDoctors.header}
                            className='home-header teal for-doctors'
                        />
                        <Header
                            as='h2'
                            content={homeContent.forDoctors.subheader}
                            className='home-sub-header for-doctors-sub'
                        />
                    </div>
                </Segment>
                <Segment className='features'>
                    <Header
                        as='h1'
                        content={homeContent.features.header}
                        className='home-header white'
                        textAlign='center'
                    />
                    <FeaturesGrid windowWidth={windowWidth} />
                </Segment>
                <Segment className='footer'>
                    <Header
                        as={Link}
                        to='#'
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }
                        content={homeContent.footer.cydoc}
                        className='home-header light-teal footer-header'
                    />
                    <div className='footer-links'>
                        <div className='footer-link'>
                            <Header
                                as={Link}
                                to='/login'
                                content={homeContent.footer.login}
                                className='light-teal'
                            />
                        </div>
                        <div className='footer-link'>
                            <Header
                                as='a'
                                href='https://aemail.com/lYPj'
                                content={homeContent.footer.contact}
                                className='light-teal'
                            />
                        </div>
                    </div>
                </Segment>
            </Fragment>
        );
    }
}

export default Home;
