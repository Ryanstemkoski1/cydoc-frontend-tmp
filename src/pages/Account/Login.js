import React, { Component } from 'react';
import {Form, Grid, Header, Segment, Button, Container, Image, Menu} from "semantic-ui-react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import NotesContext from "../../contexts/NotesContext";
import { client } from "constants/api.js"
import LogoLight from '../../assets/logo-light.png'
import LogoName from '../../assets/logo-name.png'
import "./Account.css"

import blue1 from '../../assets/alicia-logos/blue1.png';
import blue2 from '../../assets/alicia-logos/blue2.png';
import blue3 from '../../assets/alicia-logos/blue3.png';
import blue4 from '../../assets/alicia-logos/blue4.png';
import blue5 from '../../assets/alicia-logos/blue5.png';
import whitetext from '../../assets/alicia-logos/whitetext.png';
import halfblue from '../../assets/alicia-logos/halfblue.png';


// Component that manages the layout of the login page
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

    handleChange(e, { name, value }) {
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
            .then((user) => {
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

            this.setState({ redirect: true })
        } else {
            alert(response.data.Message)
        }

    };

    render() {
        if (this.state.redirect) {
            return (
                <NotesContext.Consumer>
                    {(context) => {
                        context.loadNotes(this.context.user._id)
                        return (<Redirect push to="/dashboard" />)
                    }}
                </NotesContext.Consumer>
            );
        }

        const { username, password } = this.state;
        return (

            // renders a one-column grid centered in the middle of the screen with login form
            // TODO: Make this into a container or card
            <Container className="login">
                <Container textAlign="center">
                    {/* <Image size="tiny" spaced href='/home' src={LogoLight} />
                    <Image size="small" spaced href='/home' src={LogoName} /> */}
                    <Image size="medium" spaced centered href='/home' src={blue3} />
                </Container>

                <Segment clearing raised>
                    <Container className={"login-header"} color='black' textAlign='center'>
                        Log in
                    </Container>
                    <Form size='mini' onSubmit={this.handleSubmit}>
                        <Form.Input
                            fluid
                            label='Username'
                            name='username'
                            value={username}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            fluid
                            type={"password"}
                            label='Password'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                        />
                        <Grid padded verticalAlign={"middle"} >
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Link style={{color:'#007db3'}}as={Button} to="/register" floated='left' className="make-an-account-button"
                                    >
                                        Make an Account
                                    </Link>
                                </Grid.Column>
                                <Grid.Column textAlign={"right"}>
                                    <Button style={{backgroundColor:'#0000ff', color:'white'}} size='small'>
                                        Log in
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

const Login = LoginPage;

export default Login;
