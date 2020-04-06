import React, {Component} from 'react';
import {Segment, Header} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../content/medications/MedicationsContent";
import AllergiesContent from "../content/allergies/AllergiesContent";
import FamilyHistoryContent from "../content/familyhistory/FamilyHistoryContent";
import PropTypes from 'prop-types';
import SocialHistoryContent from "../content/socialhistory/SocialHistoryContent";
import PhysicalExamContent from "../content/physicalexam/PhysicalExamContent";
import constants from '../constants/constants';
import {allergies, medications, surgicalHistory} from '../constants/States'
import ReviewOfSystemsContent from "../content/reviewofsystems/ReviewOfSystemsContent";
import HPIContent from "../content/hpi/knowledgegraph/HPIContent";
import PatientHistoryContent from "../content/patienthistory/PatientHistoryContent";
import GenerateNote from '../content/generatenote/GenerateNote';
import DiscussionPlan from '../content/discussionplan/DiscussionPlan';
import { NOTE_PAGE_MOBILE_BP } from '../constants/breakpoints';
import '../../css/components/notePage.css';

//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        //bind methods
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleMedicalHistoryChange = this.handleMedicalHistoryChange.bind(this);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
        //initialize state
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            "Medical History": constants.MEDICAL_HISTORY.STATE,
            "Social History": constants.SOCIAL_HISTORY.STATE,
            "Allergies": allergies.state,
            "Medications": medications.state,
            "Surgical History": surgicalHistory.state,
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    updateState(name, values){
        //sets the state given a tab name and an object that represents the new state of that tab
        let newState = this.state;
        newState[name] = values;
        this.setState(newState);
    }

    //individual handlers for each tab
    handleSurgicalHistoryChange = (data, values) => this.updateState("Surgical History", values);

    handleMedicationsChange = (data, values) => this.updateState("Medications", values);

    handleAllergiesChange = (data, values) => this.updateState("Allergies", values);

    handleMedicalHistoryChange = (data, values) => this.updateState("Medical History", values);

    handleSocialHistoryChange = (data, values) => this.updateState("Social History", values);

    render() {
        const { windowWidth } = this.state;

        const mobile = windowWidth < NOTE_PAGE_MOBILE_BP;
        //get content based on which tab is active
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);

        return (
            //Renders a white page that contains the tab name as the header and the
            //corresponding content to the active tab
            <Segment className={mobile ? `note-page-container-mobile` : `note-page-container`}>
                <Header as="h3" textAlign="center">
                    {this.props.activeItem.toLowerCase()}
                </Header>
                {tabToDisplay}
            </Segment>
        );
    }

    getTabToDisplay(activeItem) {
        //Instantiates and returns the correct content component based on the active tab
        //passes in the corresponding handler and values prop
        let tabToDisplay;
        switch (activeItem) {
            case "HPI":
                tabToDisplay = (<HPIContent />);
                break;
            case "Medical History":
                tabToDisplay = (<MedicalHistoryContent
                    onMedicalHistoryChange={this.handleMedicalHistoryChange}
                    values={this.state["Medical History"]}/>);
                break;
            case "Surgical History":
                tabToDisplay = (<SurgicalHistoryContent
                    onSurgicalHistoryChange={this.handleSurgicalHistoryChange}
                    values={this.state["Surgical History"]}
                />);
                break;
            case "Medications":
                tabToDisplay = (<MedicationsContent
                    onMedicationsChange={this.handleMedicationsChange}
                    values={this.state["Medications"]}
                />);
                break;
            case "Allergies":
                tabToDisplay = (<AllergiesContent
                    onAllergiesChange={this.handleAllergiesChange}
                    values={this.state["Allergies"]}
                />);
                break;
            case "Family History":
                tabToDisplay = (<FamilyHistoryContent/>);
                break;
            case "Social History":
                tabToDisplay = (<SocialHistoryContent
                    onSocialHistoryChange={this.handleSocialHistoryChange}
                    values={this.state["Social History"]}
                />);
                break;
            case "Physical Exam":
                tabToDisplay = (<PhysicalExamContent/>);
                break;
            case "Review of Systems":
                tabToDisplay = (<ReviewOfSystemsContent />);
                break;
            case "Patient History":
                tabToDisplay = (<PatientHistoryContent />);
                break;
            case "Generate Note":
                tabToDisplay = (<GenerateNote />);
                break;
            case "Plan":
                tabToDisplay = (<DiscussionPlan />)
                break;
            default:
                tabToDisplay = (<HPIContent />);
                break;
        }
        return tabToDisplay;
    }

};

NotePage.propTypes = {
  activeItem: PropTypes.string
};