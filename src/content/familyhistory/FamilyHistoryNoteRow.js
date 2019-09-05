import {Checkbox, Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React from "react";

export default function FamilyHistoryNoteRow(props) {
    return (
        <Grid.Row>
            <Grid.Column>
                {props.condition}
            </Grid.Column>
            <Grid.Column>
                <ToggleButton title="Yes"/>
                <ToggleButton title="No"/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea placeholder='Family Member'/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Checkbox label="Yes"/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea placeholder='Comments'/>
                </Form>
            </Grid.Column>
        </Grid.Row>
    )
}
