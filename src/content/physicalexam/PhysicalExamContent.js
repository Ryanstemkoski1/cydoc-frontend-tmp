import React, {Fragment} from 'react';
import {Divider, Header} from "semantic-ui-react";

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {
    render() {
        return(
            <Fragment>
                <Header as="h4">Vitals</Header>
                <Divider />
                <Header as={"h4"}>General</Header>
                <Divider/>
                <Header as={"h4"}>Head</Header>
                <Divider/>
                <Header as={"h4"}>Eyes</Header>
                <Divider/>
                <Header as={"h4"}>Ears</Header>
                <Divider/>
                <Header as={"h4"}>Nose/Throat</Header>
                <Divider/>
                <Header as={"h4"}>Neck</Header>
                <Divider/>
                <Header as={"h4"}>Pulmonary</Header>
                <Divider/>
                <Header as={"h4"}>Cardiac</Header>
                <Divider/>
                <Header as={"h4"}>Pulses</Header>
                <Divider/>
                <Header as={"h4"}>Gastrointestinal</Header>
                <Divider/>
                <Header as={"h4"}>Tendon Reflexes</Header>
                <Divider/>
                <Header as={"h4"}>Extremities</Header>
                <Divider/>
                <Header as={"h4"}>Skin</Header>
            </Fragment>
        )
    }

}