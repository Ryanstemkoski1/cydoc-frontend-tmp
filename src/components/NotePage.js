import React, {Component} from 'react';
import {Segment, Container, Header} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/medicalhistory/MedicalHistoryContent";
import SurgicalHistoryContent from "../content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../content/medications/MedicationsContent";
import AllergiesContent from "../content/allergies/AllergiesContent";

export default class NotePage extends Component {
    render() {
        let tabToDisplay;
        switch(this.props.activeItem) {
            case "Medical History":
                tabToDisplay = (<MedicalHistoryContent/>);
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
            default:
                tabToDisplay = (<MedicalHistoryContent/>);

            // code block
        }
        return (
            <Container>
                <br/>
                <Segment style={{borderColor: "white"}}>
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

