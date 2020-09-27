import React, { Fragment } from 'react';
import { Accordion, Divider, Form, Grid, Header, Icon, Input, Button } from "semantic-ui-react";
import PhysicalExamGroup from './PhysicalExamGroup';
import constants from 'constants/physical-exam-constants.json'
import HPIContext from 'contexts/HPIContext.js';
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";
import {PHYSICAL_EXAM_MOBILE_BP} from "constants/breakpoints.js";

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
        let isActiveIndex = []
        // Initializing boolean array of false for each section in the physical exam content
        for (let i  = 0; i < constants.sections.length + 1; i++){
            isActiveIndex.push(false)
        }
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            isActiveIndex
        }
        this.updateDimensions = this.updateDimensions.bind(this);
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

    handleClick = (e, data) => {
        const { active, index } = data
        let newIsActiveState = this.state.isActiveIndex
        newIsActiveState[index] = !active
        this.setState({activeIndex: newIsActiveState})
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

    renderSegments = (groups) => {
        const segments = [
        <Segment>
            <Form>
                <Grid stackable columns="equal">
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
        </Segment>]
        groups.forEach((section) =>
            segments.push(<Segment>
                <PhysicalExamGroup name={section.name} rows={section.rows} />
            </Segment>)
        )
        return segments
    }
    
    renderMobileSections = (groups) => {
        const { isActiveIndex } = this.state
        const segments = [
            {
                key: 'Vitals',
                title: {
                    content: "Vitals",
                    icon: 'dropdown'
                },
                active: isActiveIndex[0],
                onTitleClick: this.handleClick,
                content: {
                    content: (
                        <>
                        <Header as="h2">Vitals</Header>
                        <Divider />
                        <Form>
                            <Grid stackable columns="equal">
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
                                    <Form.Field inline>
                                        <label>
                                            <Header as='h5'>
                                                Heart Rate
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "Heart Rate", "bpm", "right")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline>
                                        <label>
                                            <Header as='h5'>
                                                RR
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "RR")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline>
                                        <label>
                                            <Header as='h5'>
                                                Temperature
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "Temperature", "℃", "right")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>
                                            <Header as='h5'>
                                                Oxygen Saturation
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "Oxygen Saturation")}
                                    </Form.Field>
                                </Grid.Column>
                            </Grid>
                        </Form>
                        </>
                    )
                }
            }
        ]
        for (let i = 1; i < groups.length + 1; i++) {
            segments.push(
                {
                    key: groups[i - 1].name,
                    title: {
                        content: groups[i - 1].name,
                        icon: 'dropdown'
                    },
                    active: isActiveIndex[i],
                    onTitleClick: this.handleClick,
                    content: {
                        content: (
                            <PhysicalExamGroup name={groups[i - 1].name} rows={groups[i - 1].rows} />
                        )
                    }
                }
            )
        }
        return segments
    }

    render() {
        const windowWidth = this.state.windowWidth
        return (
            <>
                {windowWidth != 0 && windowWidth < PHYSICAL_EXAM_MOBILE_BP ?
                    <Accordion styled fluid panels = {this.renderMobileSections(constants.sections)}/>
                :
                    <>
                {this.renderSegments(constants.sections)}
                    </>
                }
            </>
        )
    }

}