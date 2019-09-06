import React, {Component} from "react";
import {Form, Grid} from "semantic-ui-react";
import PropTypes from "prop-types";

export default class SecondarySocialHistoryNoteRow extends Component {
    render() {
        return <Grid.Row>
            <Grid.Column width={3}>
                {this.props.label}
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.Field>
                        <input/>
                    </Form.Field>
                </Form>
            </Grid.Column>
        </Grid.Row>;
    }
}

SecondarySocialHistoryNoteRow.propTypes = {label: PropTypes.string};