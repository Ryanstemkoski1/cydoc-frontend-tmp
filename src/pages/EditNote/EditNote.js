import React, { Component, createRef } from 'react';
import {Sticky, Button, Icon} from "semantic-ui-react";
import MenuTabs from "./MenuTabs";
import NotePage from "./NotePage";
import NavMenu from "../../components/navigation/NavMenu";
import { TAB_NAMES } from 'constants/constants';
import HPIContext from '../../contexts/HPIContext'
import { Redirect } from 'react-router';
import './EditNote.css';

// Component that manages the active state of the create note editor
// and defines the layout of the editor
class EditNote extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.state = {
            activeItem: 'HPI',
            activeTabIndex: 0,
        }
    }

    componentDidMount() {
        // Setting view to top of the page upon loading a note
        setTimeout((_e) => {window.scrollTo(0,0)}, 0);
    }

    onTabChange(name) {
        let activeItem = name;
        let activeTabIndex = TAB_NAMES.indexOf(name);

        this.setState({ activeItem, activeTabIndex })
        window.scrollTo(0,0);
    }

    // brings users to the next form when clicked
    onNextClick() {
        this.setState(state => {
            if (state.activeItem === 'HPI') {
                return {
                    activeItem: 'Patient History',
                }
            } else if (state.activeItem === 'Patient History') {
                return {
                    activeItem: 'Review of Systems',
                }
            } else if (state.activeItem === 'Review of Systems') {
                return {
                    activeItem: 'Physical Exam',
                }
            } else if (state.activeItem === 'Physical Exam') {
                return {
                    activeItem: 'Plan',
                }
            } else if (state.activeItem === 'Plan') {
                return {
                    activeItem: 'Generated Note',
                }
            }
        })
        // brings users to the top of the page after button click
        window.scrollTo(0,0);
    }

    // brings users to the previous form when clicked
    onPreviousClick() {
        this.setState(state => {
            if (state.activeItem === 'Patient History') {
                return {
                    activeItem: 'HPI',
                }
            } else if (state.activeItem === 'Review of Systems') {
                return {
                    activeItem: 'Patient History',
                }
            } else if (state.activeItem === 'Physical Exam') {
                return {
                    activeItem: 'Review of Systems',
                }
            } else if (state.activeItem === 'Plan') {
                return {
                    activeItem: 'Physical Exam',
                }
            } else if (state.activeItem === 'Generated Note') {
                return {
                    activeItem: 'Plan',
                }
            }
        })
        // brings users to the top of the page after button click
        window.scrollTo(0,0);
    }

    // Reference for the Sticky navigation bars
    noteContent = createRef()

    render() {
        // Redirects to LandingPage if there is no valid note in constext
        if (this.context._id === null) {
            return <Redirect push to="/dashboard" />
        }

        return (
            <>
                <div ref={this.noteContent}>
                    {/* Top NavMenu and MenuTabs stay on top regardless of scroll*/}
                    <Sticky context={this.noteContent} id = "stickyHeader">
                        <NavMenu
                            className="edit-note-nav-menu"
                            displayNoteName={true}
                        />
                        <MenuTabs
                            activeItem={this.state.activeItem}
                            onTabChange={this.onTabChange}
                            activeTabIndex={this.state.activeTabIndex}
                            attached
                        />
                    </Sticky>
                    <NotePage activeItem={this.state.activeItem} onNextClick={this.onNextClick}/>
                    {this.state.activeItem === 'HPI' ? 
                    ""
                    : (
                    <>
                        <Button icon floated='left' onClick={this.onPreviousClick} className='small-previous-button'>
                        <Icon name='left arrow'/>
                        </Button>
                        <Button icon labelPosition='left' floated='left' onClick={this.onPreviousClick} className='previous-button'>
                        Previous Form
                        <Icon name='left arrow'/>
                        </Button>

                        <Button icon floated='right' onClick={this.onNextClick} className='small-next-button'>
                        <Icon name='right arrow'/>
                        </Button>
                        <Button icon labelPosition='right' floated='right' onClick={this.onNextClick} className='next-button'>
                        Next Form
                        <Icon name='right arrow'/>
                        </Button>
                    </>
                    )}
                </div>

            </>
        );
    }
}

export default EditNote;