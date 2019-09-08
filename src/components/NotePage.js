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

export default class NotePage extends Component {
    constructor(props) {
        super(props);
        this.newOnChange = this.newOnChange.bind(this);
        this.state = {
            value: "Hello",
        }
    }


    newOnChange(event, data){
        let newState = this.state;
        // newState[pageName] = data;
        newState.value = data.value;
        this.setState(newState);
        console.log(this.state.value);
    }

    getTabToDisplay(activeItem) {
        let tabToDisplay;
        switch (activeItem) {
            case "Medical History":
                tabToDisplay = (<MedicalHistoryContent
                    onChange={this.newOnChange}
                    value={this.state.value}/>);
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