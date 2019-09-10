import React from "react";
import {Form, Grid, Input} from "semantic-ui-react";
import PropTypes from "prop-types";

//Functional component that defines the layout for the diet, living situation, exercise portion
export default function SecondarySocialHistoryNoteRow(props) {
    return <Grid.Row>
        <Grid.Column width={3}>
            {props.label}
        </Grid.Column>
        <Grid.Column>
            <Form>
                <Form.Field>
                    <Input onChange={props.onChange} field={props.label}/>
                </Form.Field>
            </Form>
        </Grid.Column>
    </Grid.Row>;
}

SecondarySocialHistoryNoteRow.propTypes = {label: PropTypes.string};