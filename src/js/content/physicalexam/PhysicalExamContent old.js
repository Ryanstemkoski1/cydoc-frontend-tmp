import React, { Fragment } from 'react';
import { Divider, Header, Form, Grid, Input, Button } from "semantic-ui-react";
import PhysicalExamGroup from './PhysicalExamGroup';
import { MyContext } from './PhysicalExamGroup';
import SelectAllButton from './SelectAllButton'
import HPIContext from '../../contexts/HPIContext';
//import NumericInput from 'react-numeric-input';

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (category, name, value) => {
        const values = this.context["Physical Exam"]
        values[category][name] = value
        this.context.onContextChange("Physical Exam", values)
    }

    handleChange = (category, name, value) => {
        const values = this.context["Physical Exam"]
        values[category][name] = value
        this.context.onContextChange("Physical Exam", values)
    }

    generateInput = (category, name, label = null, labelPosition = null) => {
        return (
            <Input
                label={label}
                labelPosition={labelPosition}
                name={name}
                value={this.context["Physical Exam"][category][name]}
                onChange={(e, { name, value }) => this.handleChange(category, name, value)} />
        )
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

    generateButton = (category, name) => {
        return (
            <Button
                toggle
                ref={React.createRef()}
                content={name}
                name={name}
                category={category}
                active={this.context["Physical Exam"][category][name]}
                onClick={(e, { name, active }) => this.handleChange(category, name, !active)} />
        )
    }

    render() {
        return (
            <Fragment>
                <PhysicalExamGroup category="Vitals" abnormalFindings={false}>
                    <MyContext.Consumer>
                        {category =>
                            <Form>
                                <Grid columns="equal">
                                    <Grid.Column>
                                        <h5>Blood Pressure (mmHg)</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Systolic Blood Pressure", "systolic", "right")}
                                        </Form.Field>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Diastolic Blood Pressure", "diastolic", "right")}
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h5>Heart Rate</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Heart Rate", "bpm", "right")}
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h5>RR</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "RR")}
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h5>Temperature</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Temperature", "℃", "right")}
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h5>Oxygen Saturation</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Oxygen Saturation")}
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid>
                            </Form>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="General" abnormalFindings={false}>
                    <MyContext.Consumer>
                        {category =>
                            <Form>
                                <Grid columns={5}>
                                    <Grid.Column>
                                        <h5>Height</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Height", "inches", "right")}
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <h5>Weight</h5>
                                        <Form.Field>
                                            {this.generateNumericInput(category, "Weight", "lbs", "right")}
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid>
                            </Form>}
                    </MyContext.Consumer>
                </PhysicalExamGroup>


                <PhysicalExamGroup category="Head" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normocephalic")}
                                        {this.generateButton(category, "Atraumatic")}
                                    </Grid.Column>

                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Eyes" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "PERRLA")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Sclera anicteric")}
                                            {this.generateButton(category, "No redness")}
                                            {this.generateButton(category, "No discharge")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "EOMI")}
                                            {this.generateButton(category, "Visual acuity intact")}
                                            {this.generateButton(category, "Visual fields normal")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateInput(category, "Fundoscopy", "Fundoscopy")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Ears" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normal auditory acuity")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normal Rinne")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normal Weber")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateInput(category, "Otoscopy", "Otoscopy")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Nose/Throat" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Oropharynx Clear")}
                                            {this.generateButton(category, "MMM")}
                                            {this.generateButton(category, "Tongue pink and moist")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Tongue protrudes midline")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Symmetric palate elevation")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal swallowing")}
                                            {this.generateButton(category, "Normal phonation")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateInput(category, "Internal/External Nose", "Normal phonation")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Neck" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Supple")}
                                            {this.generateButton(category, "No Thyromegaly")}
                                            {this.generateButton(category, "No lymphadenopathy")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Pulmonary" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "CTAB")}
                                            {this.generateButton(category, "No wheezes, rales, or rhonchi")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normal percussion")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "No scars or skin lesion on back")}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "No CVAT")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Cardiac" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "RRR")}
                                            {this.generateButton(category, "Normal S1, S2")}
                                            {this.generateButton(category, "No murmurs")}
                                            {this.generateButton(category, "No rubs")}
                                            {this.generateButton(category, "No gallops")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal PMI")}
                                            {this.generateButton(category, "No bruits")}
                                            {this.generateButton(category, "Normal JVP")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Pulses" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal brachial")}
                                            {this.generateButton(category, "Normal radial")}
                                            {this.generateButton(category, "Normal ulnar")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "Normal dorsalis pedis")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Gastrointestinal" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal bowel sounds")}
                                            {this.generateButton(category, "No bruits")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "No hepatomegaly")}
                                            {this.generateButton(category, "No splenomegaly")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Soft")}
                                            {this.generateButton(category, "Nontender")}
                                            {this.generateButton(category, "Nondistended")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "No rebounding")}
                                            {this.generateButton(category, "No guarding")}
                                            {this.generateButton(category, "No masses")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Extremities" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "No dubbing")}
                                            {this.generateButton(category, "No cyanosis")}
                                            {this.generateButton(category, "No nail changes")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.generateButton(category, "No edema")}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Tendon Reflexes" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal biceps")}
                                            {this.generateButton(category, "Normal brachioradials")}
                                            {this.generateButton(category, "Normal triceps")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal patellar")}
                                            {this.generateButton(category, "Normal ankle jerk")}
                                            {this.generateButton(category, "Normal plantar")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>

                <PhysicalExamGroup category="Skin" abnormalFindings={true}>
                    <MyContext.Consumer>
                        {category =>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "Normal patellar")}
                                            {this.generateButton(category, "Normal ankle jerk")}
                                            {this.generateButton(category, "Normal plantar")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <SelectAllButton handleClick={this.handleClick}>
                                            {this.generateButton(category, "No tenting")}
                                            {this.generateButton(category, "Normal turgor")}
                                        </SelectAllButton>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        }
                    </MyContext.Consumer>
                </PhysicalExamGroup>
            </Fragment>
        )
    }

}