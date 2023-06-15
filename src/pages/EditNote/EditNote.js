import React, { Component, createRef } from 'react';
import { Sticky, Message } from 'semantic-ui-react';
import MenuTabs from './MenuTabs';
import NotePage from './NotePage';
import NavMenu from '../../components/navigation/NavMenu';
import constants from 'constants/constants';
import { connect } from 'react-redux';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';

import './EditNote.css';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import './NotePage.css';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { withRouter } from 'react-router-dom';
import { YesNoResponse } from 'constants/enums';
// Component that manages the active state of the create note editor
// and defines the layout of the editor
class EditNote extends Component {
    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.state = {
            activeTabIndex: 0,
            windowWidth: 0,
            windowHeight: 0,
            message: '',
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    timeoutRef = createRef();
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

    canNavigateToOtherPages() {
        if (!this.props) {
            return false;
        }
        const selected = this.isAllQuestionsNo();
        const questionsNotAnswered = this.isQuestionsNotAnswered();
        if (!selected || questionsNotAnswered) {
            return false;
        }
        return true;
    }

    isAllQuestionsNo() {
        const selected =
            this.props.userSurveyState.nodes['2'].response ===
                YesNoResponse.Yes ||
            this.props.userSurveyState.nodes['3'].response ===
                YesNoResponse.Yes ||
            this.props.userSurveyState.nodes['4'].response ===
                YesNoResponse.Yes;
        return selected;
    }

    isQuestionsNotAnswered() {
        if (
            !this.props.userSurveyState.nodes['8'].response ||
            !this.props.additionalSurvey.legalFirstName ||
            !this.props.additionalSurvey.legalLastName ||
            !this.props.additionalSurvey.dateOfBirth ||
            !this.props.additionalSurvey.socialSecurityNumber
        ) {
            return true;
        }
        return false;
    }

    onTabChange(name) {
        clearTimeout(this.timeoutRef?.current);
        this.setState({ message: '' });
        if (
            this.props.patientView &&
            name !== 'CC' &&
            !this.canNavigateToOtherPages()
        ) {
            this.setState({
                message: this.isQuestionsNotAnswered()
                    ? 'Please complete all mandatory questions in section 1 before proceeding.'
                    : 'Please answer Yes to at least one question to proceed.',
            });
            this.timeoutRef.current = setTimeout(() => {
                this.setState({ message: '' });
            }, 3000);
            return;
        }
        let activeItem = name;
        let activeTabIndex = constants.TAB_NAMES.indexOf(name);
        this.props.updateActiveItem(name);
        this.setState({ activeItem, activeTabIndex });
        window.scrollTo(0, 0);
        this.props.history.push({
            hash: '#' + encodeURI(name),
        });
    }

    // brings users to the next form when clicked
    onNextClick() {
        const tabs = this.props.patientView
                ? constants.PATIENT_VIEW_TAB_NAMES
                : constants.TAB_NAMES,
            nextTab = tabs[tabs.indexOf(this.props.activeItem) + 1];
        this.props.updateActiveItem(nextTab);
        // brings users to the top of the page after button click
        window.scrollTo(0, 0);
    }

    // brings users to the previous form when clicked
    onPreviousClick() {
        const tabs = this.props.patientView
                ? constants.PATIENT_VIEW_TAB_NAMES
                : constants.TAB_NAMES,
            nextTab = tabs[tabs.indexOf(this.props.activeItem) - 1];
        this.props.updateActiveItem(nextTab);
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
                        {this.props.patientView && this.state?.message && (
                            <Message negative className='error-message'>
                                <Message.Header>
                                    {this.state.message}
                                </Message.Header>
                            </Message>
                        )}
                        <NotePage
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
                            activeItem={this.props.activeItem}
                            onTabChange={this.onTabChange}
                            activeTabIndex={this.state.activeTabIndex}
                            attached
                        />
                    </div>
                </Sticky>

                {editNoteHeader ? (
                    <></>
                ) : (
                    // for desktop
                    <>
                        {this.props.patientView && this.state?.message && (
                            <Message
                                negative
                                className='container error-message'
                                style={{ marginTop: '10px' }}
                            >
                                <Message.Header>
                                    {this.state.message}
                                </Message.Header>
                            </Message>
                        )}
                        <NotePage
                            onNextClick={this.onNextClick}
                            onPreviousClick={this.onPreviousClick}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(
    connect(
        (state) => ({
            _id: selectNoteId(state),
            patientView: selectPatientViewState(state),
            userSurveyState: selectInitialPatientSurvey(state),
            activeItem: selectActiveItem(state),
            additionalSurvey: state.additionalSurvey,
        }),
        { updateActiveItem }
    )(EditNote)
);
