import React, {Component} from 'react';
import {Button, Form, Grid, Header, Segment} from "semantic-ui-react";

class Login extends Component {
    render() {
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
                    <Form size='mini'>
                        <Segment clearing raised style={{borderColor: "white"}}>
                            <Form.Input
                                fluid
                                label='username'
                                placeholder='name@domain.com'
                            />
                            <Form.Input
                                fluid
                                label='password'
                                type='password'
                            />
                            <br/>
                            <Button color='violet' size='small' floated='left'>
                                Log in
                            </Button>
                            <Button color='grey' size='small' floated='right'>
                                Sign up
                            </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;
