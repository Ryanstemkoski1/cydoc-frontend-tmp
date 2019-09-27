import React, {Component} from 'react';
import {Button, Form, Grid, Header, Segment} from "semantic-ui-react";
import axios from 'axios';

//Component that manages the layout of the login page
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', submittedUsername: '', submittedPassword: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // handleChange = (e, { name, value }) => this.setState({ [name]: value });
    handleChange(e, {name, value}){
        console.log(name + ": " + value);
        let newState = this.state;
        newState[name] = value;
        console.log(newState);
        this.setState(newState);
        console.log(this.state);
    }


    handleSubmit = () => {
        const { username, password } = this.state;
        this.setState({ submittedUsername: username, submittedPassword: password });
        // e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post("http://127.0.0.1:5000/login", user)
            .then(res => {
                console.log(res);
                console.log(res.data);
            });
    };

    render() {
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
                                <Form.Button color='grey' size='small' floated='right' >
                                    Sign up
                                </Form.Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;
