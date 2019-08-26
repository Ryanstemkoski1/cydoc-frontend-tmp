import React from 'react';
import {
    Button,
    Form,
    Grid,
    Header,
    Message,
    Segment,
} from 'semantic-ui-react';
export default () => (
    <Grid verticalAlign="middle" columns={2} centered>
        <Grid.Row>
            <Grid.Column>
                <Header as="h1" textAlign="center">
                    cydoc
                </Header>
                <Header as="h3" textAlign="center">
                    login or register
                </Header>
                <Segment>
                    <Form size="large">
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="username"
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="password"
                            type="password"
                        />
                        <Button color="blue" fluid size="large">
                            Login
                        </Button>
                    </Form>
                </Segment>
                <Message>
                    Not registered yet? <a href="#">Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid.Row>
    </Grid>
);

