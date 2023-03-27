import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Image } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { initialState } from 'redux/reducers';
import _ from 'lodash';

import { deleteNote } from '../../redux/actions/currentNoteActions';
import NavMenu from '../../components/navigation/NavMenu';

import { LANDING_PAGE_MOBLE_BP } from 'constants/breakpoints.js';
import './LandingPage.css';
import Feedback from '../../assets/cydoc-feedback.svg';

//Component that manages the layout of the dashboard page
class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1000,
            windowHeight: 0,
            redirect: '',
        };
        this.updateDimensions = this.updateDimensions.bind(this);

        this.handleNewHPIClick = this.handleNewHPIClick.bind(this);
        this.handleEditHPIClick = this.handleEditHPIClick.bind(this);
        this.checkExistingNote = this.checkExistingNote.bind(this);
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

    handleEditNoteClick = () => {
        this.setState({
            redirect: 'NEW_NOTE',
        });
    };

    // switches to new note under user's confirmation if prompt is true
    handleNewNoteClick = (prompt) => {
        const toDelete =
            !prompt || window.confirm('Delete current note and make a new one');
        if (toDelete) {
            this.props.deleteNote();
            this.handleEditNoteClick();
        }
    };

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

    checkExistingNote() {
        return !_.isEqual(initialState, this.props.currentNote);
    }

    render() {
        const { windowWidth } = this.state;

        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;
        const noteExists = this.checkExistingNote();
        const desktopNoteButtons = noteExists ? (
            <div className='landing-col multiple'>
                <div
                    className='landing-box top'
                    onClick={() => this.handleNewNoteClick(true)}
                >
                    <Icon
                        name='file alternate outline'
                        size='large'
                        class='icons'
                    />
                    <h3 className='text'>Create New Blank Note</h3>
                </div>
                <div
                    className='landing-box bottom'
                    onClick={() => this.handleEditNoteClick()}
                >
                    <Icon name='file outline' size='large' class='icons' />
                    <h3 className='text'>Return to Active Note</h3>
                </div>
            </div>
        ) : (
            <Fragment>
                <div
                    className='landing-box landing-col'
                    onClick={() => this.handleNewNoteClick(false)}
                >
                    <Icon
                        name='file alternate outline'
                        size='huge'
                        className='icons'
                    ></Icon>
                    <h3 className='text'>Create New Note</h3>
                    <br />
                    <p className='smaller-text'>
                        Write a note for a patient encounter
                    </p>
                </div>
            </Fragment>
        );

        const existingNoteMobileButton = noteExists && (
            <div
                onClick={() => this.handleEditNoteClick}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'>Return to an Active Note</Button>
                </div>
                <div className='hidden content'>
                    <Icon
                        name='file alternate outline'
                        size='large'
                        className='icons'
                    ></Icon>
                </div>
            </div>
        );

        const newNoteMobileButton = (
            <div
                onClick={() => this.handleNewNoteClick(noteExists)}
                className='ui animated fade button landing'
                tabIndex='0'
            >
                <div className='visible content' size='massive'>
                    <Button size='big'> Create New Blank Note</Button>
                </div>
                <div className='hidden content'>
                    <Icon
                        name={`file outline ${!noteExists ? 'alternate' : ''}`}
                        size='large'
                        className='icons'
                    ></Icon>
                </div>
            </div>
        );

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
                        <div className='landing-feedback'>
                            <Image src={Feedback} />
                        </div>
                        <div
                            className={`landing-boxes ${
                                stack ? 'rows' : 'columns'
                            }`}
                        >
                            {stack ? (
                                <>
                                    {existingNoteMobileButton}
                                    {newNoteMobileButton}
                                </>
                            ) : (
                                <>{desktopNoteButtons}</>
                            )}
                        </div>
                    </>
                );
        }
    }
}
const mapStatetoProps = (state) => ({ currentNote: state });

const mapDispatchToProps = {
    deleteNote,
};

export default connect(mapStatetoProps, mapDispatchToProps)(LandingPage);
