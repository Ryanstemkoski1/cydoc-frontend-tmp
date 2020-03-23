import React, {Component, Fragment} from 'react';
import { Form, Grid, Header, Segment, Button, Label} from "semantic-ui-react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import AuthContext from "../contexts/AuthContext";
import NotesContext from "../contexts/NotesContext";
import constants from "../constants/registration_constants"
import {client} from "../constants/api.js"

const degreeOptions = constants.degrees.map((degree) => ({key: degree, value: degree, text: degree}))
const specialtyOptions = constants.specialties.map((specialty) => ({key: specialty, value: specialty, text: specialty}))
const workfeatOptions = constants.workplaceFeatures.map((workfeat) => ({key: workfeat, value: workfeat, text: workfeat}))

//Component that manages the layout of the login page
export default class Register extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            formInfo: {
                username: "",
                password: "",
                email: "",
                phoneNumber: "",
                firstName: "",
                lastName: "",
                workplace: "",
                inPatient: null,
                institutionType: "",
                address: "",
                backupEmail: "",
                role: "",
                studentStatus: "",
                degreesCompleted: ["", "", ""],
                degreesInProgress: ["", "", ""],
                specialties: ["", ""],
                workplaceFeatures: []
            },
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, {name, value}){
        let newState = this.state;
        newState.formInfo[name] = value;
        this.setState(newState);
    }

    handleArrayChange(e, {name, index, value}){
        let newState = this.state;
        newState.formInfo[name][index] = value;
        this.setState(newState);
    }


    //TODO: Make an actual registration page
    handleSubmit = () => {

        let user = this.state.formInfo

        client.post("/user/new", user)
            .then(res => {
                const user = res.data;
                console.log(JSON.stringify(user))
                this.setState({redirect: true})
            })
            .catch(err => {
                console.log(err.response)
            })
    }


    additionalFields = () => {
        if (this.state.formInfo.role === 'healthcare professional') {
            return (
                <Fragment>
                    <label style={{fontSize: "10px"}}>student status</label>
                    <Form.Group>
                        <Form.Radio style={{fontSize: "10px"}}
                            label='student'
                            value='y'
                            name='studentStatus'
                            checked={this.state.formInfo.studentStatus === 'y'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio style={{fontSize: "10px"}}
                            label='non-student'
                            value='n'
                            name='studentStatus'
                            checked={this.state.formInfo.studentStatus === 'n'}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <label style={{fontSize: "10px"}}>degrees completed</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[0]}
                            name='degreesCompleted'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[1]}
                            name='degreesCompleted'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[2]}
                            name='degreesCompleted'
                            index={2}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <label style={{fontSize: "10px"}}>degrees in progress</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[0]}
                            name='degreesInProgress'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[1]}
                            name='degreesInProgress'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[2]}
                            name='degreesInProgress'
                            index={2}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <label style={{fontSize: "10px"}}>specialties</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={specialtyOptions}
                            value={this.state.formInfo.specialties[0]}
                            name='specialties'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={specialtyOptions}
                            value={this.state.formInfo.specialties[1]}
                            name='specialties'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <Form.Input
                        fluid
                        label='workplace'
                        name='workplace'
                        value={this.state.formInfo.workplace}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Dropdown
                        label='workplace features'
                        selection
                        multiple
                        options={workfeatOptions}
                        value={this.state.formInfo.workplaceFeatures}
                        name='workplaceFeatures'
                        onChange={this.handleChange}
                    />
                </Fragment>
            )
        }
        else {
            return (
                null
            )
        }
    }

    render() {

        if(this.state.redirect){
            return(<Redirect push to= "/login" />)
        }

        const { username, password } = this.state;
        return (
            //renders a one-column grid centered in the middle of the screen with login form
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle' centered>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header color='grey' textAlign='center' style={{fontSize: "60px", letterSpacing: "4.8px"}}>
                        cydoc
                    </Header>
                    <Header as='h4' color='grey' textAlign='center'>
                        sign up
                    </Header>
                    <Segment clearing raised style={{borderColor: "white"}}>
                        <Form size='mini' onSubmit={this.handleSubmit}>
                                <Form.Input
                                    fluid
                                    label='username'
                                    placeholder='username'
                                    name='username'
                                    value={this.state.formInfo.username}
                                    onChange={this.handleChange}
                                    required
                                    minLength={3}
                                />
                                <Form.Input
                                    fluid
                                    type={"password"}
                                    label='password'
                                    name='password'
                                    value={this.state.formInfo.password}
                                    onChange={this.handleChange}
                                    required
                                />
                                <Form.Group>
                                    <Form.Input
                                        fluid
                                        label='first name'
                                        name='firstName'
                                        value={this.state.formInfo.firstName}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    <Form.Input
                                        fluid
                                        label='last name'
                                        name='lastName'
                                        value={this.state.formInfo.lastName}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        fluid
                                        type='email'
                                        label='email'
                                        name='email'
                                        value={this.state.formInfo.email}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    <Form.Input
                                        fluid
                                        type='email'
                                        label='backup email'
                                        name='backupEmail'
                                        value={this.state.formInfo.backupEmail}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        fluid
                                        label='address'
                                        name='address'
                                        value={this.state.formInfo.address}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    <Form.Input
                                        fluid
                                        width={6}
                                        type='tel'
                                        label='phone number'
                                        name='phoneNumber'
                                        value={this.state.formInfo.phoneNumber}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <label style={{fontSize: "10px"}}>
                                    I am a:
                                </label>
                                <Form.Group>
                                    <Form.Radio style={{fontSize: "10px"}}
                                        label='patient'
                                        value='patient'
                                        name='role'
                                        checked={this.state.formInfo.role === 'patient'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio style={{fontSize: "10px"}}
                                        label='healthcare professional'
                                        value='healthcare professional'
                                        name='role'
                                        checked={this.state.formInfo.role === 'healthcare professional'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio style={{fontSize: "10px"}}
                                        label='administrator'
                                        value='administrator'
                                        name='role'
                                        checked={this.state.formInfo.role === 'administrator'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                {this.additionalFields()}
                                <Form.Button color='violet' size='small' floated='left'>
                                    Sign Up
                                </Form.Button>
                                
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}
