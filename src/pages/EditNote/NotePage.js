import React, { Component } from 'react';
import { Container, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PhysicalExamContent from './content/physicalexam/PhysicalExamContent';
import ReviewOfSystemsContent from './content/reviewofsystems/ReviewOfSystemsContent';
import HPIContent from './content/hpi/knowledgegraph/HPIContent';
import PatientHistoryContent from './content/patienthistory/PatientHistoryContent';
import GenerateNote from './content/generatenote/GenerateNote.tsx';
import DiscussionPlan from './content/discussionplan/DiscussionPlan.tsx';
import { connect } from 'react-redux';
import { PMH_TAB_NAMES } from 'constants/constants';
import {
    PATIENT_HISTORY_MOBILE_BP,
    SOCIAL_HISTORY_MOBILE_BP,
} from 'constants/breakpoints.js';
import MedicalHistoryContent from './content/medicalhistory/MedicalHistoryContent';
import SurgicalHistoryContent from './content/surgicalhistory/SurgicalHistoryContent';
import MedicationsContent from './content/medications/MedicationsContent';
import AllergiesContent from './content/allergies/AllergiesContent';
import SocialHistoryContent from './content/socialhistory/SocialHistoryContent';
import FamilyHistoryContent from './content/familyhistory/FamilyHistoryContent';
import './content/patienthistory/PatientHistory.css';

import './NotePage.css';

//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

class NotePage extends Component {
    constructor(props) {
        super(props);
        //bind methods
        this.updateDimensions = this.updateDimensions.bind(this);
        //initialize state
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            hpiTab: -1,
            activeHPI: '',
            activePMH: 'Medical History',
            pmhTab: PMH_TAB_NAMES.indexOf('Medical History'),
        };
    }

    // go to the next page (change step = step + 1)
    continueHPITab = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        if (
            [-1, Object.keys(this.props.chiefComplaints).length - 1].includes(
                this.state.hpiTab
            )
        ) {
            this.nextFormClick();
            if (this.state.hpiTab != -1) return;
        }
        this.setState({
            hpiTab: this.state.hpiTab + 1,
            activeHPI: Object.keys(this.props.chiefComplaints)[
                this.state.hpiTab + 1
            ],
        });
    };

    // go to previous page (change step = step - 1)
    backHPITab = (e) => {
        e.preventDefault();
        if (this.state.hpiTab <= 0) this.previousFormClick();
        this.setState({
            hpiTab: this.state.hpiTab - 1,
            activeHPI: Object.keys(this.props.chiefComplaints)[
                this.state.hpiTab - 1
            ],
        });
        window.scrollTo(0, 0);
    };

    setHPITab = (e, tabIndex) => {
        e.preventDefault();
        this.setState({
            hpiTab: tabIndex,
            activeHPI: Object.keys(this.props.chiefComplaints)[tabIndex],
        });
        window.scrollTo(0, 0);
    };

    handlePMHTabChange = (e, { activeIndex }) => {
        this.setState({
            pmhTab: activeIndex,
            activePMH: PMH_TAB_NAMES[activeIndex],
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    handlePMHPrevTab = (e, { activeTabName }) => {
        const index = PMH_TAB_NAMES.indexOf(activeTabName);
        this.setState({
            pmhTab: index,
            activePMH: activeTabName,
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    handlePMHNextTab = (e, { activeTabName }) => {
        e.preventDefault();
        const index = PMH_TAB_NAMES.indexOf(activeTabName);
        this.setState({
            pmhTab: index,
            activePMH: activeTabName,
        });
        setTimeout((_e) => {
            this.setStickyHeaders();
        }, 0);
    };

    // panes for mobile view
    onPMHTabClick(activeTabName, windowWidth) {
        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        const socialHistoryMobile = windowWidth < SOCIAL_HISTORY_MOBILE_BP;

        let tabToDisplay;
        switch (activeTabName) {
            case 'Medical History':
                tabToDisplay = <MedicalHistoryContent mobile={collapseTabs} />;
                break;
            case 'Surgical History':
                tabToDisplay = <SurgicalHistoryContent mobile={collapseTabs} />;
                break;
            case 'Medications':
                tabToDisplay = <MedicationsContent mobile={collapseTabs} />;
                break;
            case 'Allergies':
                tabToDisplay = <AllergiesContent mobile={collapseTabs} />;
                break;
            case 'Social History':
                tabToDisplay = (
                    <SocialHistoryContent mobile={socialHistoryMobile} />
                );
                break;
            case 'Family History':
                tabToDisplay = <FamilyHistoryContent mobile={collapseTabs} />;
                break;
            case null:
                this.setState({
                    activePMH: 'Medical History',
                    pmhTab: 0,
                });
                break;
            default:
                tabToDisplay = <MedicalHistoryContent mobile={collapseTabs} />;
                break;
        }
        return tabToDisplay;
    }

    onPMHNextClick(activeTabName) {
        const index = PMH_TAB_NAMES.indexOf(activeTabName) + 1;
        this.setState({
            activePMH: PMH_TAB_NAMES[index],
            activeIndex: index,
        });
    }

    // brings users to the previous form when clicked
    onPMHPreviousClick(activeTabName) {
        const index = PMH_TAB_NAMES.indexOf(activeTabName) - 1;
        this.setState({
            activePMH: PMH_TAB_NAMES[index],
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
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
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
        switch (activeItem) {
            case 'CC':
                tabToDisplay = (
                    <HPIContent
                        nextFormClick={this.nextFormClick}
                        step={-1}
                        continue={this.continueHPITab}
                        back={this.backHPITab}
                        activeTab={this.state.activeHPI}
                        onTabClick={this.setHPITab}
                    />
                );
                break;
            case 'HPI':
                tabToDisplay = Object.keys(this.props.chiefComplaints)
                    .length ? (
                    <HPIContent
                        nextFormClick={this.nextFormClick}
                        step={this.state.hpiTab}
                        continue={this.continueHPITab}
                        back={this.backHPITab}
                        activeTab={this.state.activeHPI}
                        onTabClick={this.setHPITab}
                    />
                ) : (
                    <>
                        Please select at least one Chief Complaint in the CC tab
                        in order to view an HPI questionnaire.
                        <Button
                            icon
                            labelPosition='left'
                            floated='left'
                            onClick={this.previousFormClick}
                            className='hpi-previous-button'
                        >
                            Previous Form
                            <Icon name='angle left' />
                        </Button>
                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            onClick={this.nextFormClick}
                            className='hpi-next-button'
                        >
                            Next Form
                            <Icon name='angle right' />
                        </Button>
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
            case 'Generated Note':
                tabToDisplay = (
                    <GenerateNote previousFormClick={this.previousFormClick} />
                );
                break;
            case 'Plan':
                tabToDisplay = (
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
                        step={this.state.hpiTab}
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

NotePage.propTypes = {
    activeItem: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        chiefComplaints: state.chiefComplaints,
    };
};

export default connect(mapStateToProps)(NotePage);
