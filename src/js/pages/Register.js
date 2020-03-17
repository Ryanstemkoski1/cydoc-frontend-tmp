import React, {Component} from 'react';
import { Form, Grid, Header, Segment, Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import AuthContext from "../contexts/AuthContext";
import NotesContext from "../contexts/NotesContext";

import {client} from "../constants/api.js"


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
                role: ""
            },
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, {name, value}){
        let newState = this.state;
        newState.formInfo[name] = value;
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
                                <Form.Input
                                    fluid
                                    label='workplace'
                                    name='workplace'
                                    value={this.state.formInfo.workplace}
                                    onChange={this.handleChange}
                                    required
                                />
                                <Form.Group>
                                    <Form.Input
                                        fluid
                                        label='intstitution type'
                                        name='institutionType'
                                        value={this.state.formInfo.institutionType}
                                        onChange={this.handleChange}
                                        required
                                    />
                                    <Form.Select
                                        fluid
                                        width={6}
                                        options={[{key: "y", value: true, text: "yes"}, {key: "n", value: false, text: "no"}]}
                                        label='inpatient?'
                                        name='inPatient'
                                        value={this.state.formInfo.inPatient}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Input
                                    fluid
                                    label='role'
                                    name='role'
                                    value={this.state.formInfo.role}
                                    onChange={this.handleChange}
                                    required
                                />
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
