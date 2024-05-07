import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import constants from 'constants/constants';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { processSurveyGraph } from '@redux/actions/userViewActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import { Container } from 'semantic-ui-react';
import './NotePage.css';
import AllergiesContent from './content/allergies/AllergiesContent';
import DiscussionPlan from './content/discussionplan/DiscussionPlan.tsx';
import FamilyHistoryContent from './content/familyhistory/FamilyHistoryContent';
import GenerateNote from './content/generatenote/GenerateNote.tsx';
import HPIContent from './content/hpi/knowledgegraph/HPIContent';
import MedicalHistoryContent from './content/medicalhistory/MedicalHistoryContent';
import MedicationsContent from './content/medications/MedicationsContent';
import './content/patienthistory/PatientHistory.css';
import PatientHistoryContent from './content/patienthistory/PatientHistoryContent';
import InitialSurvey from './content/patientview/InitialSurvey';
import initialQuestions from './content/patientview/constants/initialQuestions';
import PhysicalExamContent from './content/physicalexam/PhysicalExamContent';
import ReviewOfSystemsContent from './content/reviewofsystems/ReviewOfSystemsContent';
import SocialHistoryContent from './content/socialhistory/SocialHistoryContent';
import SurgicalHistoryContent from './content/surgicalhistory/SurgicalHistoryContent';
//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

class NotePage extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            activeHPI: '',
            activePMH: 'Medical History',
            pmhTab: constants.PMH_TAB_NAMES.indexOf('Medical History'),
        };
    }

    // go to the next page (change step = step + 1)
    continueHPITab = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        let hpiTab =
            this.state.activeHPI in this.props.chiefComplaints
                ? Object.keys(this.props.chiefComplaints).findIndex(
                      (cc) => cc == this.state.activeHPI
                  )
                : 0;
        const lastIndex = Object.keys(this.props.chiefComplaints).length - 1;
        if (
            !Object.keys(this.props.chiefComplaints).length ||
            lastIndex == hpiTab ||
            this.props.activeItem == 'CC'
        ) {
            this.nextFormClick();
        } else hpiTab += 1;
        this.setState({
            activeHPI: Object.keys(this.props.chiefComplaints)[hpiTab],
        });
    };

    // go to previous page (change step = step - 1)
    backHPITab = (e) => {
        e.preventDefault();
        if (
            !Object.keys(this.props.chiefComplaints).length ||
            Object.keys(this.props.chiefComplaints)[0] == this.state.activeHPI
        )
            this.previousFormClick();
        else
            this.setState({
                activeHPI: Object.keys(this.props.chiefComplaints)[
                    Object.keys(this.props.chiefComplaints).findIndex(
                        (cc) => cc == this.state.activeHPI
                    ) - 1
                ],
            });
        window.scrollTo(0, 0);
    };

    setHPITab = (e, tabIndex) => {
        e.preventDefault();
        this.setState({
            activeHPI: Object.keys(this.props.chiefComplaints)[tabIndex],
        });
        window.scrollTo(0, 0);
    };

    handlePMHTabChange = (e, { activeIndex }) => {
        this.setState({
            pmhTab: activeIndex,
            activePMH: constants.PMH_TAB_NAMES[activeIndex],
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    // panes for mobile view
    onPMHTabClick(activeTabName) {
        let tabToDisplay;
        switch (activeTabName) {
            case 'Medical History':
                tabToDisplay = <MedicalHistoryContent />;
                break;
            case 'Surgical History':
                tabToDisplay = <SurgicalHistoryContent />;
                break;
            case 'Medications':
                tabToDisplay = <MedicationsContent singleType={false} />;
                break;
            case 'Allergies':
                tabToDisplay = <AllergiesContent />;
                break;
            case 'Social History':
                tabToDisplay = <SocialHistoryContent />;
                break;
            case 'Family History':
                tabToDisplay = <FamilyHistoryContent />;
                break;
            case null:
                this.setState({
                    activePMH: 'Medical History',
                    pmhTab: 0,
                });
                break;
            default:
                tabToDisplay = <MedicalHistoryContent />;
                break;
        }
        return tabToDisplay;
    }

    onPMHNextClick(activeTabName) {
        const index = constants.PMH_TAB_NAMES.indexOf(activeTabName) + 1;
        this.setState({
            activePMH: constants.PMH_TAB_NAMES[index],
            activeIndex: index,
        });
    }

    // brings users to the previous form when clicked
    onPMHPreviousClick(activeTabName) {
        const index = constants.PMH_TAB_NAMES.indexOf(activeTabName) - 1;
        this.setState({
            activePMH: constants.PMH_TAB_NAMES[index],
            activeIndex: index,
        });
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
        const { patientView, chiefComplaints } = this.props,
            defaultTab = <InitialSurvey continue={this.continueHPITab} />;
        switch (activeItem) {
            case 'CC':
                tabToDisplay = patientView ? (
                    defaultTab
                ) : (
                    <HPIContent
                        step={-1}
                        continue={this.continueHPITab}
                        back={this.backHPITab}
                        activeTab={
                            this.state.activeHPI
                                ? this.state.activeHPI
                                : Object.keys(chiefComplaints)[0]
                        }
                        onTabClick={this.setHPITab}
                    />
                );
                break;
            case 'HPI':
                tabToDisplay = Object.keys(chiefComplaints).length ? (
                    <HPIContent
                        step={
                            this.state.activeHPI in chiefComplaints
                                ? Object.keys(chiefComplaints).findIndex(
                                      (cc) => cc == this.state.activeHPI
                                  )
                                : 0
                        }
                        continue={this.continueHPITab}
                        back={this.backHPITab}
                        activeTab={
                            this.state.activeHPI
                                ? this.state.activeHPI
                                : Object.keys(chiefComplaints)[0]
                        }
                        onTabClick={this.setHPITab}
                    />
                ) : (
                    <>
                        <div className='note-text'>
                            Please select at least one Chief Complaint in the CC
                            tab in order to view an HPI questionnaire.
                        </div>
                        <br />
                        <div className='flex justify-center'>
                            <NavigationButton
                                previousClick={this.backHPITab}
                                nextClick={this.continueHPITab}
                            />
                        </div>
                    </>
                );
                break;
            case 'Patient History':
                tabToDisplay = (
                    <PatientHistoryContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                        activePMH={this.state.activePMH}
                        pmhIndex={this.state.pmhTab}
                        onTabClick={this.onPMHTabClick}
                        setStickyHeaders={this.setStickyHeaders}
                        handlePMHTabChange={this.handlePMHTabChange}
                    />
                );
                break;
            case 'Physical Exam':
                tabToDisplay = (
                    <PhysicalExamContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            case 'Review of Systems':
                tabToDisplay = (
                    <ReviewOfSystemsContent
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            case 'Intake and Note':
                tabToDisplay = patientView ? (
                    defaultTab
                ) : (
                    <GenerateNote previousFormClick={this.previousFormClick} />
                );
                break;
            case 'Plan':
                tabToDisplay = patientView ? (
                    defaultTab
                ) : (
                    <DiscussionPlan
                        nextFormClick={this.nextFormClick}
                        previousFormClick={this.previousFormClick}
                    />
                );
                break;
            default:
                tabToDisplay = (
                    <HPIContent
                        nextFormClick={this.nextFormClick}
                        step={
                            this.state.activeHPI in this.props.chiefComplaints
                                ? Object.keys(
                                      this.props.chiefComplaints
                                  ).findIndex(
                                      (cc) => cc == this.state.activeHPI
                                  )
                                : 0
                        }
                        continue={this.continueHPITab}
                        back={this.backHPITab}
                        activeTab={this.state.activeHPI}
                        onTabClick={this.setHPITab}
                    />
                );
                break;
        }
        return tabToDisplay;
    }

    render() {
        //get content based on which tab is active
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);
        return (
            <Container className='active-tab-container'>
                {tabToDisplay}
            </Container>
        );
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
