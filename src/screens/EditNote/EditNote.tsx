'use client';

import constants from '@constants/constants.json';
import React, { Component, createRef } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { selectNoteId } from '@redux/selectors/currentNoteSelectors';
import { Message } from 'semantic-ui-react';
import MenuTabs from './MenuTabs';
import NotePage from './NotePage';
import { RootState } from '@redux/store';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import { YesNoResponse } from '@constants/enums';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import './EditNote.css';
import './NotePage.css';

interface OwnProps extends WithRouterProps {}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

interface State {
    activeTabIndex: number;
    message: string;
}

// Component that manages the active state of the create note editor
// and defines the layout of the editor

class EditNote extends Component<Props, State> {
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

    timeoutRef = createRef<NodeJS.Timeout | null>();
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
        // @ts-expect-error TODO: fix this, add Typescript types
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
            // @ts-expect-error TODO: fix this, add Typescript types
            this.timeoutRef.current = setTimeout(() => {
                this.setState({ message: '' });
            }, 3000);
            return;
        }
        const activeItem = name;
        const activeTabIndex = constants.TAB_NAMES.indexOf(name);
        this.props.updateActiveItem(name);
        this.setState({ activeTabIndex });
        window.scrollTo(0, 0);
        this.props.router.push({
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
            <div
                // @ts-expect-error TODO: fix this, add Typescript types
                ref={this.noteContent}
            >
                {/* Top NavMenu and MenuTabs stay on top regardless of scroll*/}
                <MenuTabs
                    // @ts-expect-error TODO: fix this, add Typescript types
                    activeItem={this.props.activeItem}
                    onTabChange={this.onTabChange}
                    activeTabIndex={this.state.activeTabIndex}
                    attached
                />

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

const mapStateToProps = (state: RootState) => ({
    _id: selectNoteId(state),
    patientView: selectPatientViewState(state),
    userSurveyState: selectInitialPatientSurvey(state),
    activeItem: selectActiveItem(state),
    additionalSurvey: selectAdditionalSurvey(state),
});

const mapDispatchToProps = { updateActiveItem };

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withRouter(EditNote));
