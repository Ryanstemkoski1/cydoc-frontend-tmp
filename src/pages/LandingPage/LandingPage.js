import React, { Component } from 'react';
import NavMenu from '../../components/navigation/NavMenu';
import { Icon } from 'semantic-ui-react';
import { LANDING_PAGE_MOBLE_BP } from 'constants/breakpoints.js';
import './LandingPage.css';
import { Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';

// imports for old landing page with notes/data stored in context
// import OpenRecentSegment from './OpenNotes';
// import CreateTemplateSegment from './CreateTemplate';
// import NewNoteSegment from './NewNote';

//Component that manages the layout of the dashboard page
export default class LandingPageOld extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1000,
            windowHeight: 0,
            redirect: '',
            // hidden: true,
        };
        this.updateDimensions = this.updateDimensions.bind(this);

        this.handleNewNoteClick = this.handleNewNoteClick.bind(this);
        this.handleNewHPIClick = this.handleNewHPIClick.bind(this);
        this.handleEditHPIClick = this.handleEditHPIClick.bind(this);
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

    handleNewNoteClick() {
        // const note = await this.context.addNote();

        /* 
        
        if (note !== null) {
            let { _id, noteName: title, ...newNote } = note;
            newNote = { _id, title, ...newNote.body};
            
            this.context.loadNote(newNote);
            this.props.loadNote(newNote);
        
            // this.setState({ redirect: true });
        }

        */

        // some saving here to the state maintained by redux??

        this.setState({
            redirect: 'NEW_NOTE',
        });
    }

    handleNewHPIClick() {
        this.setState({
            redirect: 'NEW_HPI',
        });
    }

    handleEditHPIClick() {
        this.setState({
            redirect: 'EDIT_HPI',
        });
    }

    render() {
        const { windowWidth } = this.state;

        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;

        switch (this.state.redirect) {
            case 'NEW_NOTE':
                return <Redirect to='/editnote' />;

            case 'NEW_HPI':
                return <Redirect to='/templates/new' />;

            case 'EDIT_HPI':
                return <Redirect to='/templates/old' />;

            default:
                return (
                    <>
                        <div>
                            <NavMenu className='landing-page-nav-menu' />
                        </div>
                        {stack ? (
                            <div style={{ margin: '12vh 15vw' }}>
                                <div
                                    onClick={() => this.handleNewNoteClick()}
                                    style={{ margin: '4vh 1vw' }}
                                    className='ui animated fade button'
                                    tabIndex='0'
                                >
                                    <div
                                        className='visible content'
                                        size='massive'
                                    >
                                        <Button size='big'>
                                            Create New Blank Note
                                        </Button>
                                    </div>
                                    <div className='hidden content'>
                                        <Icon
                                            name='file alternate outline'
                                            size='large'
                                            class='icons'
                                        ></Icon>
                                    </div>
                                </div>
                                <div
                                    onClick={() => this.handleNewHPIClick()}
                                    style={{ margin: '4vh auto' }}
                                    className='ui animated fade button'
                                    tabIndex='0'
                                >
                                    <div className='visible content'>
                                        <Button size='big'>
                                            Create New HPI Template
                                        </Button>
                                    </div>
                                    <div className='hidden content'>
                                        <Icon
                                            name='list alternate outline'
                                            size='large'
                                            class='icons'
                                        ></Icon>
                                    </div>
                                </div>
                                <div
                                    onClick={() => this.handleEditHPIClick()}
                                    style={{ margin: '4vh auto' }}
                                    className='ui animated fade button'
                                    tabIndex='0'
                                >
                                    <div className='visible content'>
                                        <Button size='big'>
                                            Edit Existing HPI Template
                                        </Button>
                                    </div>
                                    <div className='hidden content'>
                                        <Icon
                                            name='edit outline'
                                            size='large'
                                            class='icons'
                                        ></Icon>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='landing-boxes'>
                                <div
                                    className='landing-box'
                                    onClick={() => this.handleNewNoteClick()}
                                >
                                    <Icon
                                        name='file alternate outline'
                                        size='huge'
                                        class='icons'
                                    ></Icon>
                                    <h3 className='text'>Create New Note</h3>
                                    <br />
                                    <p className='smaller-text'>
                                        Insert explanation here for creating a
                                        new note
                                    </p>
                                </div>

                                <div
                                    className='landing-box'
                                    onClick={() => this.handleNewHPIClick()}
                                >
                                    <Icon
                                        name='list alternate outline'
                                        size='huge'
                                        class='icons'
                                    ></Icon>
                                    <h3 className='text'>
                                        Create New Template
                                    </h3>
                                    <br />
                                    <p className='smaller-text'>
                                        Insert explanation here for creating a
                                        new template
                                    </p>
                                </div>

                                <div
                                    className='landing-box'
                                    onClick={() => this.handleEditHPIClick()}
                                >
                                    <Icon
                                        name='edit outline'
                                        size='huge'
                                        class='icons'
                                    ></Icon>
                                    <h3 className='text'>
                                        Edit Existing Template
                                    </h3>
                                    <br />
                                    <p className='smaller-text'>
                                        Insert explanation for editing an
                                        existing template
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    }
}
