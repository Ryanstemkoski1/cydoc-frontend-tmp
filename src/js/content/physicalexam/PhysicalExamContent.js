import React, {Fragment} from 'react';
import {Divider, Header, Form, Grid, Input, Button} from "semantic-ui-react";
import PhysicalExamGroup from './PhysicalExamGroup';

//Component that manages content for the Physical Exam tab
export default class PhysicalExamContent extends React.Component {
    render() {
        return(
            <Fragment>
                <Header as="h4">Vitals</Header>
                <Divider />

                <Form>
                  <Grid columns='equal'>
                      <Grid.Column>
                        <h5>Blood Pressure (mmHg)</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>systolic</label>
                        </Form.Field>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>diatolic</label>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <h5>Heart Rate</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>bpm</label>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <h5>RR</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label></label>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <h5>Temperature</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>℉</label>
                        </Form.Field>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>℃</label>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <h5>Oxygen Saturation</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label></label>
                        </Form.Field>
                      </Grid.Column>
                  </Grid>
                </Form>

                <Header as={"h4"}>General</Header>
                <Divider/>

                <Form>
                  <Grid columns={5}>
                      <Grid.Column>
                        <h5>Height</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>feet</label>
                        </Form.Field>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>inches</label>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <h5>Weight</h5>
                        <Form.Field inline>
                            <Input style={{width: "100px"}} />
                            <label>lbs</label>
                        </Form.Field>
                      </Grid.Column>
                  </Grid>
                </Form>

                <Header as={"h4"}>Head</Header>
                <Divider/>

                <PhysicalExamGroup content={
                    <Grid columns="equal">
                        <Grid.Row>
                            <Grid.Column>
                                <Button toggle active={false} onClick={this.handleClick} style={{width: "190px"}}>Normocephalic</Button>
                            </Grid.Column>
                        
                        </Grid.Row>
                    </Grid>
                    
                    
                }/>

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