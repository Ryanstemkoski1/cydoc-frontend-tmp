import React from 'react';
import {Container, Divider, Header} from 'semantic-ui-react';
import MedicalHistoryContent from "./MedicalHistoryContent";
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";

export default () => (
    <Container>
        <Header as="h3" textAlign="centered">
            medical history
        </Header>
        <br />
        <MedicalHistoryContentHeader />
        <Divider />
        <MedicalHistoryContent />
    </Container>
);

