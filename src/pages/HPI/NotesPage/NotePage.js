import constants from 'constants/constants';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { processSurveyGraph } from 'redux/actions/userViewActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { Button, Icon } from 'semantic-ui-react';
import GenerateNote from '../../EditNote/content/generatenote/GenerateNote';
import initialQuestions from '../../EditNote/content/patientview/constants/initialQuestions.json';
import HPIContent from '../HpiContent/HPIContent';
import InitialSurvey from '../InitialSurvey/InitialSurvey';
//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

class NotePage extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            activePMH: 'Medical History',
            pmhTab: constants.PMH_TAB_NAMES.indexOf('Medical History'),
        };
    }

    componentDidMount() {
        const { userSurveyState, processSurveyGraph } = this.props;
        if (
            !Object.keys(userSurveyState?.graph).length &&
            !Object.keys(userSurveyState?.nodes).length &&
            !Object.keys(userSurveyState?.order).length
        ) {
            processSurveyGraph(initialQuestions);
        }
    }

    setStickyHeaders() {
        const stickyHeaders = document.getElementsByClassName('sticky-header');
        const patientHistoryMenu = document.getElementById(
            'patient-history-menu'
        );
        if (
            stickyHeaders != null &&
            stickyHeaders.length != 0 &&
            patientHistoryMenu != null
        ) {
            for (let i = 0; i < stickyHeaders.length; i++) {
                stickyHeaders[i].style.top = `${
                    parseInt(patientHistoryMenu.style.top) +
                    patientHistoryMenu.offsetHeight
                }px`;
            }
        }
    }

    nextFormClick = () => {
        this.props.onNextClick();
    };

    previousFormClick = () => {
        this.props.onPreviousClick();
    };

    getTabToDisplay(activeItem) {
        //Instantiates and returns the correct content component based on the active tab
        //passes in the corresponding handler and values prop
        let tabToDisplay;
        const { patientView, chiefComplaints, notification } = this.props,
            defaultTab = <InitialSurvey continue={this.nextFormClick} />;
        if (patientView) {
            switch (activeItem) {
                case 'CC':
                    tabToDisplay = patientView ? (
                        defaultTab
                    ) : (
                        <HPIContent
                            step={-1}
                            continue={this.continueHPITab}
                            back={this.backHPITab}
                            activeTab={this.props.activeItem}
                            onTabClick={(_, tabIndex) => {
                                this.props.onTabChange(
                                    Object.keys(this.props.chiefComplaints)[
                                        tabIndex
                                    ]
                                );
                            }}
                        />
                    );
                    break;
                case 'HPI':
                    tabToDisplay = Object.keys(chiefComplaints).length ? (
                        <HPIContent
                            continue={this.nextFormClick}
                            back={this.previousFormClick}
                            activeTab={this.props.activeItem}
                            onTabClick={this.props.onTabChange}
                        />
                    ) : (
                        <>
                            <div className='note-text'>
                                Please select at least one Chief Complaint in
                                the CC tab in order to view an HPI
                                questionnaire.
                            </div>
                            <Button
                                icon
                                labelPosition='left'
                                floated='left'
                                onClick={this.backHPITab}
                                className='hpi-previous-button'
                            >
                                Prev
                                <Icon name='arrow left' />
                            </Button>
                            <Button
                                icon
                                floated='left'
                                onClick={this.backHPITab}
                                className='hpi-small-previous-button'
                            >
                                <Icon name='arrow left' className='big' />
                            </Button>
                            <Button
                                icon
                                labelPosition='right'
                                floated='right'
                                onClick={this.continueHPITab}
                                className='hpi-next-button'
                            >
                                Next
                                <Icon name='arrow right' />
                            </Button>
                            <Button
                                icon
                                floated='right'
                                onClick={this.continueHPITab}
                                className='hpi-small-next-button'
                            >
                                <Icon name='arrow right' className='big' />
                            </Button>
                        </>
                    );
                    break;
                case 'Generated Note':
                    tabToDisplay = patientView ? (
                        defaultTab
                    ) : (
                        <GenerateNote
                            previousFormClick={this.previousFormClick}
                        />
                    );
                    break;
                default:
                    tabToDisplay = (
                        <HPIContent
                            nextFormClick={this.nextFormClick}
                            continue={this.nextFormClick}
                            back={this.previousFormClick}
                            activeTab={this.props.activeItem}
                            onTabClick={(_, tabIndex) => {
                                this.props.onTabChange(
                                    Object.keys(this.props.chiefComplaints)[
                                        tabIndex
                                    ]
                                );
                            }}
                            notification={notification}
                        />
                    );
                    break;
            }
        } else {
            tabToDisplay = (
                <GenerateNote previousFormClick={this.previousFormClick} />
            );
        }

        return tabToDisplay;
    }

    render() {
        //get content based on which tab is active
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);
        return <div>{tabToDisplay}</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        chiefComplaints: state.chiefComplaints,
        patientView: selectPatientViewState(state),
        activeItem: selectActiveItem(state),
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

const mapDispatchToProps = {
    updateActiveItem,
    processSurveyGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
