import React, { Component } from 'react';
import NavMenu from '../../components/navigation/NavMenu';
import { Container, Grid } from 'semantic-ui-react';
import { LANDING_PAGE_MOBLE_BP } from 'constants/breakpoints.js';
import OpenRecentSegment from './OpenNotes';
import CreateTemplateSegment from './CreateTemplate';
import NewNoteSegment from './NewNote';
import './LandingPage.css';

//Component that manages the layout of the dashboard page
export default class LandingPageOld extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    };

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

        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;

        return (
            <>
                <div>
                    <NavMenu className='landing-page-nav-menu' />
                </div>
                {stack ? (
                    <Container style={{ margin: '20px 0 0 0' }}>
                        <OpenRecentSegment stack={stack} />
                        <NewNoteSegment stack={stack} />
                    </Container>
                ) : (
                    <Grid columns={3} style={{ margin: '20px 0 40vh 0' }}>
                        <Grid.Column>
                            <OpenRecentSegment stack={stack} />
                        </Grid.Column>
                        <Grid.Column>
                            <NewNoteSegment stack={stack} />
                        </Grid.Column>
                        <Grid.Column>
                            <CreateTemplateSegment stack={stack} />
                        </Grid.Column>
                    </Grid>
                )}
            </>
        );
    }
}
