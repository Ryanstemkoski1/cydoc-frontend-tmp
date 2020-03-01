import React, {Component} from 'react';
import { Form, Grid, Header, Segment, Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {loginRequest} from "../actions";
import {Redirect} from "react-router";
import AuthContext from "../contexts/AuthContext";
import NotesContext from "../contexts/NotesContext";

import {client} from "../constants/api.js"


//Component that manages the layout of the login page
class LoginPage extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submittedUsername: '',
            submittedPassword: '',
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


    handleSubmit = async () => {
        const { username, password } = this.state;
        this.setState({ submittedUsername: username, submittedPassword: password });

        const payload = {
            username: this.state.username,
            password: this.state.password
        };

        const response = await client.post("/login", payload)
        .then(res => {
            const user = res;
            console.log(user)
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .then((user)=> {
            //dispatch({type: LOGIN_REQUEST, payload: user.data})
            return user;
        })
        .catch(err => {
            return err.response;
        })
        
        if (response == null) {
            alert("null response")
            return
        }
        if (response.status === 200) {
            console.log(this)
            this.context.storeLoginInfo(response.data.user, response.data.jwt.accessToken)

            this.setState( { redirect : true } )
        } else {
            alert(response.data.Message)
        }
        
    };

    //TODO: Make an actual registration page
    handleRegister = () => {
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
            return (
                <NotesContext.Consumer>
                    {(context) => {
                        context.loadNotes(this.context.user._id)
                        return(<Redirect push to= "/home" />)
                    }}
                </NotesContext.Consumer>
            );
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
                        log in or sign up
                    </Header>
                    <Segment clearing raised style={{borderColor: "white"}}>
                        <Form size='mini' onSubmit={this.handleSubmit}>
                                <Form.Input
                                    fluid
                                    label='username'
                                    placeholder='username'
                                    name='username'
                                    value={username}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    type={"password"}
                                    label='password'
                                    name='password'
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <Form.Button color='violet' size='small' floated='left'>
                                    Log in
                                </Form.Button>
                                
                        </Form>
                        <Button color='grey' size='small' floated='right' onClick={this.handleRegister}>
                                    Sign up
                        </Button>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

const Login = LoginPage;

export default Login;
