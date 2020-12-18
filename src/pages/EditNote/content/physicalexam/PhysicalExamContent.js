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
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
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
    
    renderPanels = (groups) => {
        const isMobileView = this.state.windowWidth <= PHYSICAL_EXAM_MOBILE_BP
        const panels = [
            {
                key: 'Vitals',
                title: {
                    className: "dropdown-title",
                    content: "Vitals",
                    icon: 'dropdown'
                },
                content: {
                    content: (
                        <>
                        <Form>
                            <Grid stackable columns="3">
                                <Grid.Column>
                                    <Header as="h5">
                                        Blood Pressure (mmHg)
                                    </Header>
                                    <Form.Field>
                                        {this.generateNumericInput("Vitals", "Systolic Blood Pressure", "systolic", "right")}
                                    </Form.Field>
                                    <Form.Field>
                                        {this.generateNumericInput("Vitals", "Diastolic Blood Pressure", "diastolic", "right")}
                                    </Form.Field>
                                </Grid.Column>
                                
                                    <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5'>
                                                Heart Rate
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "Heart Rate", "bpm", "right")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5'>
                                                RR
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "RR")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
                                        <label>
                                            <Header as='h5'>
                                                Temperature
                                            </Header>
                                        </label>
                                        {this.generateNumericInput("Vitals", "Temperature", "℃", "right")}
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field inline={isMobileView}>
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
            panels.push(
                {
                    key: groups[i - 1].name,
                    title: {
                        className: "dropdown-title",
                        content: groups[i - 1].name,
                        icon: 'dropdown'
                    },
                    content: {
                        content: (
                            <PhysicalExamGroup name={groups[i - 1].name} rows={groups[i - 1].rows} />
                        )
                    }
                }
            )
        }
        return panels
    }

    nextFormClick = () => this.props.nextFormClick();

    previousFormClick = () => this.props.previousFormClick();

    render() {
        return (
            <>
                <Accordion styled fluid panels = {this.renderPanels(constants.sections)} />

                <Button icon floated='left' onClick={this.previousFormClick} className='small-physical-previous-button'>
                <Icon name='arrow left'/>
                </Button>
                <Button icon labelPosition='left' floated='left' onClick={this.previousFormClick} className='physical-previous-button'>
                Previous Form
                <Icon name='arrow left'/>
                </Button>

                <Button icon floated='right' onClick={this.nextFormClick} className='small-physical-next-button'>
                <Icon name='arrow right'/>
                </Button>
                <Button icon labelPosition='right' floated='right' onClick={this.nextFormClick} className='physical-next-button'>
                Next Form
                <Icon name='arrow right'/>
                </Button>

            </>            
        )
    }

}

            
