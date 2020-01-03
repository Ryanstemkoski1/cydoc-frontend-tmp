import {Form, Grid, Input, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';

//Component that defines the layout for the Substance Use portion
export default class SocialHistoryNoteRow extends Component {
    render() {
        const values = this.props.values;
        const condition = this.props.condition;
        const firstField = this.props.firstField;
        const secondField = this.props.secondField;
        return (<Grid.Row>
            <Grid.Column width={2}>
                {this.props.condition}
            </Grid.Column>
            <Grid.Column width={4}>
                <ToggleButton
                    onToggleButtonClick={this.props.onToggleButtonClick}
                    condition={condition}
                    title="Yes"
                    size={"small"}
                    compact={true}
                    active={values[condition]["Yes"]}
                />
                <ToggleButton
                    onToggleButtonClick={this.props.onToggleButtonClick}
                    condition={condition}
                    title="In the Past"
                    size={"small"}
                    compact={true}
                    active={values[condition]["In the Past"]}
                />
                <ToggleButton
                    onToggleButtonClick={this.props.onToggleButtonClick}
                    condition={condition}
                    title="Never Used"
                    size={"small"}
                    compact={true}
                    active={values[condition]["Never Used"]}
                />
            </Grid.Column>
            <Grid.Column width={2}>
                <Form >
                    <Form.Field>
                        <label>{this.props.firstField}</label>
                        <Input
                            onChange={this.props.onChange}
                            field={this.props.firstField}
                            condition={this.props.condition}
                            value={values[condition][firstField]}
                        />
                    </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.Field>
                        <label>{this.props.secondField}</label>
                        <Input
                            onChange={this.props.onChange}
                            field={this.props.secondField}
                            condition={this.props.condition}
                            value={values[condition][secondField]}
                        />
                    </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column width={4}>
                <Form>
                    <Form.Field>
                        <label>Comments</label>
                        <TextArea
                            onChange={this.props.onChange}
                            field={"Comments"}
                            condition={this.props.condition}
                            value={values[condition]["Comments"]}
                        />
                    </Form.Field>
                </Form>
            </Grid.Column>
        </Grid.Row>)
    }
}

SocialHistoryNoteRow.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
}