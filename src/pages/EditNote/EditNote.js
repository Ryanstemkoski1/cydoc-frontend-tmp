import React, { Component, createRef } from 'react';
import { Sticky } from 'semantic-ui-react';
import MenuTabs from './MenuTabs';
import NotePage from './NotePage';
import NavMenu from '../../components/navigation/NavMenu';
import constants from 'constants/constants';
import { connect } from 'react-redux';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';

import './EditNote.css';

// Component that manages the active state of the create note editor
// and defines the layout of the editor
class EditNote extends Component {
    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.state = {
            activeItem: 'CC',
            activeTabIndex: 0,
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
        // Setting view to top of the page upon loading a note
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
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

    onTabChange(name) {
        let activeItem = name;
        let activeTabIndex = constants.TAB_NAMES.indexOf(name);

        this.setState({ activeItem, activeTabIndex });
        window.scrollTo(0, 0);
    }

    // brings users to the next form when clicked
    onNextClick() {
        this.setState((state) => {
            if (state.activeItem === 'CC') {
                return {
                    activeItem: 'HPI',
                };
            } else if (state.activeItem === 'HPI') {
                return {
                    activeItem: 'Patient History',
                };
            } else if (state.activeItem === 'Patient History') {
                return {
                    activeItem: 'Review of Systems',
                };
            } else if (state.activeItem === 'Review of Systems') {
                return {
                    activeItem: 'Physical Exam',
                };
            } else if (state.activeItem === 'Physical Exam') {
                return {
                    activeItem: 'Plan',
                };
            } else if (state.activeItem === 'Plan') {
                return {
                    activeItem: 'Generated Note',
                };
            }
        });
        // brings users to the top of the page after button click
        window.scrollTo(0, 0);
    }

    // brings users to the previous form when clicked
    onPreviousClick() {
        this.setState((state) => {
            if (state.activeItem === 'HPI') {
                return {
                    activeItem: 'CC',
                };
            } else if (state.activeItem === 'Patient History') {
                return {
                    activeItem: 'HPI',
                };
            } else if (state.activeItem === 'Review of Systems') {
                return {
                    activeItem: 'Patient History',
                };
            } else if (state.activeItem === 'Physical Exam') {
                return {
                    activeItem: 'Review of Systems',
                };
            } else if (state.activeItem === 'Plan') {
                return {
                    activeItem: 'Physical Exam',
                };
            } else if (state.activeItem === 'Generated Note') {
                return {
                    activeItem: 'Plan',
                };
            }
        });
        // brings users to the top of the page after button click
        window.scrollTo(0, 0);
    }

    // Reference for the Sticky navigation bars
    noteContent = createRef();

    render() {
        // Redirects to LandingPage if there is no valid note in constext
        // re-implement once we start saving notes again
        // if (this.props._id === '') {
        //     return <Redirect push to='/dashboard' />;
        // }
        const { windowWidth } = this.state;
        const editNoteHeader = windowWidth < NOTE_PAGE_MOBILE_BP;

        return (
            <div ref={this.noteContent}>
                {editNoteHeader ? (
                    <>
                        <div className='mobile-header' />
                        <NotePage
                            activeItem={this.state.activeItem}
                            onNextClick={this.onNextClick}
                            onPreviousClick={this.onPreviousClick}
                        />
                        <div
                            className='container'
                            id='mobile-header-container'
                        />
                    </>
                ) : (
                    <></>
                )}
                {/* Top NavMenu and MenuTabs stay on top regardless of scroll*/}
                <Sticky
                    context={this.noteContent}
                    id={editNoteHeader ? 'mobile-nav' : 'stickyHeader'}
                >
                    <NavMenu
                        className='edit-note-nav-menu'
                        displayNoteName={true}
                    />
                    <div className={editNoteHeader ? 'sticky-div' : ''}>
                        <MenuTabs
                            activeItem={this.state.activeItem}
                            onTabChange={this.onTabChange}
                            activeTabIndex={this.state.activeTabIndex}
                            attached
                        />
                    </div>
                </Sticky>

                {editNoteHeader ? (
                    <></>
                ) : (
                    <NotePage
                        activeItem={this.state.activeItem}
                        onNextClick={this.onNextClick}
                        onPreviousClick={this.onPreviousClick}
                    />
                )}
            </div>
        );
    }
}

export default connect((state) => ({ _id: selectNoteId(state) }))(EditNote);
