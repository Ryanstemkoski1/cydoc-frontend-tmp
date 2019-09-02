import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../ToggleButton";
import React from 'react';

export default () => (
    <Grid columns={4} verticalAlign='middle' >
        <Grid.Row>
            <Grid.Column>
                Myocardial Infarction
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
        </Grid.Row>
    </Grid>
);
