import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React from 'react'

export default function MedicalHistoryNoteRow(props) {
    return (<Grid.Row>
        <Grid.Column>
            {props.condition}
        </Grid.Column>
        <Grid.Column>
            <ToggleButton title="Yes"/>
            <ToggleButton title="No"/>
        </Grid.Column>
        <Grid.Column>
            <Form>
                <TextArea placeholder='Onset'/>
            </Form>
        </Grid.Column>
        <Grid.Column>
            <Form>
                <TextArea placeholder='Comments'/>
            </Form>
        </Grid.Column>
    </Grid.Row>)
}


