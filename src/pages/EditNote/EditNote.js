import constants from 'constants/constants';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import { Message, Sticky } from 'semantic-ui-react';
import NavMenu from '../../components/navigation/NavMenu';
import MenuTabs from './MenuTabs';
import NotePage from './NotePage';

import { YesNoResponse } from 'constants/enums';
import { withRouter } from 'react-router-dom';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import './EditNote.css';
import './NotePage.css';
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
            message: '',
        };
    }

    timeoutRef = createRef();
    componentDidMount() {
        // Setting view to top of the page upon loading a note
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }

    canNavigateToOtherPages() {
        if (!this.props) {
            return false;
        }
        const selected = this.isAllQuestionsNo();
        const questionsNotAnswered = this.isQuestionsNotAnswered();
        const isUserInfoValid = this.props.additionalSurvey.isUserInfoValid;
        if (!selected || questionsNotAnswered || !isUserInfoValid) {
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

        return (
            <div ref={this.noteContent}>
                {/* Top NavMenu and MenuTabs stay on top regardless of scroll*/}
                <Sticky context={this.noteContent} id={'stickyHeader'}>
                    <NavMenu
                        className='edit-note-nav-menu'
                        displayNoteName={true}
                    />

                    <div>
                        <MenuTabs
                            activeItem={this.props.activeItem}
                            onTabChange={this.onTabChange}
                            activeTabIndex={this.state.activeTabIndex}
                            attached
                        />
                    </div>
                </Sticky>

                {this.props.patientView && this.state?.message && (
                    <Message
                        negative
                        className='container error-message'
                        style={{ marginTop: '10px' }}
                    >
                        <Message.Header>{this.state.message}</Message.Header>
                    </Message>
                )}
                <NotePage
                    onNextClick={this.onNextClick}
                    onPreviousClick={this.onPreviousClick}
                />
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
