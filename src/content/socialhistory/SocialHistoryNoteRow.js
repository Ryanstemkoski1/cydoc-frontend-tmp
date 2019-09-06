import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React from 'react'
import PropTypes from 'prop-types';

export default function SocialHistoryNoteRow(props) {
    return (<Grid.Row>
        <Grid.Column width={2}>
            {props.condition}
        </Grid.Column>
        <Grid.Column width={5}>
            <ToggleButton title="Yes" size="tiny"/>
            <ToggleButton title="In the Past" size="tiny"/>
            <ToggleButton title="Never Used" size="tiny"/>
        </Grid.Column>
        <Grid.Column width={2}>
            <Form>
                <Form.Field>
                    <label>{props.firstField}</label>
                    <input />
                </Form.Field>
            </Form>
        </Grid.Column>
        <Grid.Column>
            <Form>
                <Form.Field>
                    <label>{props.secondField}</label>
                    <input />
                </Form.Field>
            </Form>
        </Grid.Column>
        <Grid.Column>
            <Form>
                <Form.Field>
                    <label>Comments</label>
                    <TextArea />
                </Form.Field>
            </Form>
        </Grid.Column>
    </Grid.Row>)
}

SocialHistoryNoteRow.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
}