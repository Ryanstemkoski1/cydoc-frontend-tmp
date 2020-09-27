import React, { Fragment } from 'react';
import { Form, Grid, Input, Button, Icon } from "semantic-ui-react";
import PhysicalExamGroup from './PhysicalExamGroup';
import constants from 'constants/physical-exam-constants.json'
import HPIContext from 'contexts/HPIContext.js';
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
    }

    handleChange = (category, name, value) => {
        const values = this.context["Physical Exam"]
        values[category][name] = value
        this.context.onContextChange("Physical Exam", values)
    }

    generateNumericInput = (category, name, label = null, labelPosition = null) => {
        return (
            <Input
                type="number"
                label={label}
                labelPosition={labelPosition}
                style={{ width: "100px" }}
                name={name}
                value={this.context["Physical Exam"][category][name]}
                onChange={(e, { name, value }) => this.handleChange(category, name, value)} />
        )
    }

    renderGroups = (groups) => {
        return groups.map((section) =>
            <Segment>
                <PhysicalExamGroup name={section.name} rows={section.rows} />
            </Segment>
        )
    }

    render() {
        return (
            <>
            <Segment>
                <Form>
                    <Grid columns="equal">
                        <Grid.Column>
                            <h5>Blood Pressure (mmHg)</h5>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "Systolic Blood Pressure", "systolic", "right")}
                            </Form.Field>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "Diastolic Blood Pressure", "diastolic", "right")}
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <h5>Heart Rate</h5>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "Heart Rate", "bpm", "right")}
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <h5>RR</h5>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "RR")}
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <h5>Temperature</h5>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "Temperature", "℃", "right")}
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <h5>Oxygen Saturation</h5>
                            <Form.Field>
                                {this.generateNumericInput("Vitals", "Oxygen Saturation")}
                            </Form.Field>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Segment>
        {this.renderGroups(constants.sections)}
        <Button icon labelPosition='right' floated='right'>
            Next Form
            <Icon name='right arrow'/>
        </Button>
        </>

    )
    }

}