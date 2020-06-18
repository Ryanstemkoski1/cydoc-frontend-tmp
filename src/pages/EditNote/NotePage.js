import React, { Component, Fragment } from 'react';
import { Segment, Header, Container} from 'semantic-ui-react';
import MedicalHistoryContent from "./content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "./content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "./content/medications/MedicationsContent";
import AllergiesContent from "./content/allergies/AllergiesContent";
import FamilyHistoryContent from "./content/familyhistory/FamilyHistoryContent";
import PropTypes from 'prop-types';
import SocialHistoryContent from "./content/socialhistory/SocialHistoryContent";
import PhysicalExamContent from "./content/physicalexam/PhysicalExamContent";
import ReviewOfSystemsContent from "./content/reviewofsystems/ReviewOfSystemsContent";
import HPIContent from "./content/hpi/knowledgegraph/HPIContent";
import PatientHistoryContent from "./content/patienthistory/PatientHistoryContent";
import GenerateNote from './content/generatenote/GenerateNote';
import DiscussionPlan from './content/discussionplan/DiscussionPlan';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';
import './NotePage.css';

//Component that manages the content displayed based on the activeItem prop
// and records the information the user enters as state

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        //bind methods
        this.updateDimensions = this.updateDimensions.bind(this);
        //initialize state
        this.state = {
            windowWidth: 0,
            windowHeight: 0
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



    getTabToDisplay(activeItem) {
        //Instantiates and returns the correct content component based on the active tab
        //passes in the corresponding handler and values prop
        let tabToDisplay;
        switch (activeItem) {
            case "HPI":
                tabToDisplay = (<HPIContent />);
                break;
            case "Patient History":
                tabToDisplay = (<PatientHistoryContent />);
                break;
            case "Physical Exam":
                tabToDisplay = (<PhysicalExamContent />);
                break;
            case "Review of Systems":
                tabToDisplay = (<ReviewOfSystemsContent />);
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

    render() {
        const { windowWidth } = this.state;
        const mobile = windowWidth < NOTE_PAGE_MOBILE_BP;

        //get content based on which tab is active
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);

        return (
            //Renders a white page that contains the tab name as the header and the
            //corresponding content to the active tab
            /*
            <Header as="h3" textAlign="center">
                    {this.props.activeItem}
                </Header>
                className={mobile ? `note-page-container-mobile` : `note-page-container`}
             */
            <Container style={{
                margin: "20px 0 0 0",
            }}>
                {tabToDisplay}
            </Container>
        );
    }

};

NotePage.propTypes = {
    activeItem: PropTypes.string
};