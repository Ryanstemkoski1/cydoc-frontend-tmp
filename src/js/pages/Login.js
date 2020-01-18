import React, {Component} from 'react';
import { Form, Grid, Header, Segment, Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {loginRequest} from "../actions";
import {Redirect} from "react-router";
import AuthContext from "../contexts/AuthContext";
import axios from 'axios'
import api from "../constants/api";


function mapDispatchToProps(dispatch) {
    return {
        loginRequest: user => dispatch(loginRequest(user))
    };
}

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

        const user = {
            username: this.state.username,
            password: this.state.password
        };

        const response = await this.props.loginRequest(user)
        console.log(response)
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
            inPatient: "No?",
            institutionType: "Yasa",
            address: "Yasa",
            backupEmail: "yasab27@gmail.com",
            role: "The Boss"
        };

        axios.post(api.register.prod, user)
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
            return <Redirect push to= "/home" />;
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
const Login = connect(null, mapDispatchToProps)(LoginPage);

export default Login;
