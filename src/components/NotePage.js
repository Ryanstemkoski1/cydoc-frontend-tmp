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

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        this.handleMedicalHistoryChange = this.handleMedicalHistoryChange.bind(this);
        this.handleChangeGeneral = this.handleChangeGeneral.bind(this);
        console.log(constants.medicalhistory.state);
        this.state = {
            "Medical History": constants.medicalhistory.state
        }
    }

    handleChangeGeneral(data, name){
        let newState = this.state;
        newState[name] = data;
        this.setState(newState);
    }


    handleMedicalHistoryChange(data, stuff){
        let newState = this.state;
        // newState[pageName] = data;
        newState.value = data.value;
        newState["Medical History"] = stuff;
        this.setState(newState);
        console.log(data);
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
                tabToDisplay = (<SurgicalHistoryContent/>);
                break;
            case "Medications":
                tabToDisplay = (<MedicationsContent/>);
                break;
            case "Allergies":
                tabToDisplay = (<AllergiesContent/>);
                break;
            case "Family History":
                tabToDisplay = (<FamilyHistoryContent/>);
                break;
            case "Social History":
                tabToDisplay = (<SocialHistoryContent/>);
                break;
            case "Physical Exam":
                tabToDisplay = (<PhysicalExamContent/>);
                break;
            default:
                tabToDisplay = (<MedicalHistoryContent/>);
        }
        return tabToDisplay;
    }

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
};

NotePage.propTypes = {
  activeItem: PropTypes.string
};