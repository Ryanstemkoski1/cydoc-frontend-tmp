import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React from 'react'
import PropTypes from 'prop-types';

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
                <TextArea placeholder='Onset' value={props.value} onChange={props.onChange}/>
            </Form>
        </Grid.Column>
        <Grid.Column>
            <Form>
                <TextArea placeholder='Comments'/>
            </Form>
        </Grid.Column>
    </Grid.Row>)
}

MedicalHistoryNoteRow.propTypes = {
  condition: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
  ])
} ;