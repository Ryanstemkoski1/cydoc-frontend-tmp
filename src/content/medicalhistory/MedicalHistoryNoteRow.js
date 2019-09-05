import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, { Component } from 'react'

export default class MedicalHistoryNoteRow extends Component {

    render(){
        return (<Grid.Row >
                <Grid.Column>
                    {this.props.condition}
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


