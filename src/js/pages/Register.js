import React, {Component} from 'react';
import { Form, Grid, Header, Segment, Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {loginRequest} from "../actions";
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
            username: "yasab",
            password: "basay",
            email: "yasa@b.aig",
            phoneNumber: "123456789",
            firstName: "Yasab",
            lastName: "Aig",
            workplace: "Duck",
            inPatient: false,
            institutionType: "Yasa",
            address: "Yasa",
            backupEmail: "yasab27@gmail.com",
            role: "The Boss",
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, {name, value}){
        console.log(name + ": " + value);
        let newState = this.state;
        newState[name] = value;
        console.log(newState);
        this.setState(newState);
        console.log(this.state);
    }


    //TODO: Make an actual registration page
    handleSubmit = () => {
        const user = {
            username: "yasab",
            password: "basay",
            email: "yasa@b.aig",
            phoneNumber: "123456789",
            firstName: "Yasab",
            lastName: "Aig",
            workplace: "Duck",
            inPatient: false,
            institutionType: "Yasa",
            address: "Yasa",
            backupEmail: "yasab27@gmail.com",
            role: "The Boss"
        };

        client.post("", user)
            .then(res => {
                const user = res.data;
                console.log(JSON.stringify(user))
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    render() {
        if(this.state.redirect){
            return(<Redirect push to= "/home" />)
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
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    type={"password"}
                                    label='password'
                                    name='password'
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                                <Form.Group>
                                    <Form.Input
                                        fluid
                                        label='first name'
                                        name='firstName'
                                        value={this.state.firstName}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label='last name'
                                        name='lastName'
                                        value={this.state.lastName}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                
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
