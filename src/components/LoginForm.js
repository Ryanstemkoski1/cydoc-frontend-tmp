import React from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

const LoginForm = () => (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' centered>
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h1' color='grey' textAlign='center'>
                cydoc
            </Header>
            <Header as='h4' color='grey' textAlign='center'>
                login or sign up
            </Header>
            <Form size='mini'>
                <Segment clearing>
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
                    <br />
                    <Button color='violet'  size='small' floated='left'>
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

export default LoginForm