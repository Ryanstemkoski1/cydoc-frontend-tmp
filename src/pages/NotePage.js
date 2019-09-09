import React, {Component} from 'react';
import {Segment, Container, Header} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../content/medications/MedicationsContent";
import AllergiesContent from "../content/allergies/AllergiesContent";
import FamilyHistoryContent from "../content/familyhistory/FamilyHistoryContent";
import PropTypes from 'prop-types';
import SocialHistoryContent from "../content/socialhistory/SocialHistoryContent";
import PhysicalExamContent from "../content/physicalexam/PhysicalExamContent";
import constants from '../constants';
import {allergies, medications, surgicalHistory} from '../StateShapes'

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        this.handleMedicalHistoryChange = this.handleMedicalHistoryChange.bind(this);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
        console.log(constants.medicalhistory.state);
        this.state = {
            "Medical History": constants.medicalhistory.state,
            "Social History": constants.socialhistory.state,
            "Allergies": allergies.state,
            "Medications": medications.state,
            "Surgical History": surgicalHistory.state
        }
    }

    updateState(name, values){
        let newState = this.state;
        newState[name] = values;
        this.setState(newState);
    }
    handleSurgicalHistoryChange = (data, values) => this.updateState("Surgical History", values);

    handleMedicationsChange = (data, values) => this.updateState("Medications", values);

    handleAllergiesChange = (data, values) => this.updateState("Allergies", values);

    handleMedicalHistoryChange = (data, values) => this.updateState("Medical History", values);

    handleSocialHistoryChange = (data, values) => this.updateState("Social History", values);

    render() {
        const tabToDisplay = this.getTabToDisplay(this.props.activeItem);

        return (
            <Container>
                <br/>
                <Segment style={{borderColor: "white"}} padded={"very"}>
                    <Header as="h3" textAlign="center">
                        {this.props.activeItem.toLowerCase()}
                    </Header>
                    {tabToDisplay}
                </Segment>
                <br />
            </Container>
        );
    }

    getTabToDisplay(activeItem) {
        let tabToDisplay;
        switch (activeItem) {
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
            default:
                tabToDisplay = (<MedicalHistoryContent
                    onMedicalHistoryChange={this.handleMedicalHistoryChange}
                    values={this.state["Medical History"]}/>);
        }
        return tabToDisplay;
    }

};

NotePage.propTypes = {
  activeItem: PropTypes.string
};