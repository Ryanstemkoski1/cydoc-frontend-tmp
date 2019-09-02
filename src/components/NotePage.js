import React, {Component} from 'react';
import {Segment, Divider, Header, Container} from 'semantic-ui-react';
import MedicalHistoryContent from "../content/MedicalHistoryContent";
import MedicalHistoryContentHeader from "../content/MedicalHistoryContentHeader";

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
                    <MedicalHistoryContent/>
                </Segment>
            </Container>
        );
    }
};

