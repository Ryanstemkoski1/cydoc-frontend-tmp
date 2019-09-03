import React, {Component} from 'react';
import {Segment, Divider, Header, Container} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/medicalhistory/MedicalHistoryContent";
import MedicalHistoryContentHeader from "../content/MedicalHistoryContentHeader";
import SurgicalHistoryContent from "../content/surgicalhistory/SurgicalHistoryContent";
import MedicationsContent from "../content/medications/MedicationsContent";
import AllergiesContent from "../content/allergies/AllergiesContent";

export default class NotePage extends Component {
    render() {
        return (
            <Container>
                <br/>
                <Segment>
                    <Header as="h3" textAlign="center">
                        medical history
                    </Header>
                    <br/>
                    <MedicalHistoryContentHeader/>
                    <Divider/>
                    <SurgicalHistoryContent />
                    <MedicationsContent />
                    <AllergiesContent />
                </Segment>
                <br />
            </Container>
        );
    }
};

