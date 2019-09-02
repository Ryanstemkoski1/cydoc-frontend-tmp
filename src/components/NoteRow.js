import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../components/ToggleButton";
import React, { Component } from 'react'

export default class NoteRow extends Component {

    render(){
        const condition = this.props.condition;
        return (<Grid.Row >
                <Grid.Column>
                    {condition}
                </Grid.Column>
                <Grid.Column>
                    <ToggleButton title="Yes"/>
                    <ToggleButton title="No"/>
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <TextArea placeholder='Onset' />
                    </Form>
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        <TextArea placeholder='Comments' />
                    </Form>
                </Grid.Column>
            </Grid.Row>)
    }
}


