import React, { Component } from 'react';
import {Form, Header, Segment} from "semantic-ui-react";

export default class AddNote extends Component {
    render() {
        return (
            <Segment>
                <Header>
                    Create Note
                </Header>
                <Form>
                    <Form.Input placeholder={'Name'}/>
                    <Form.Button basic>
                        create
                    </Form.Button>
                </Form>
            </Segment>
        );
    }
}