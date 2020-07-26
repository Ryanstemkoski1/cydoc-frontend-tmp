import {Form, Grid, Input, TextArea} from "semantic-ui-react";
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';

// TODO: make toggle buttons for quitting questions work (and in NoteItem)

//Component that defines the layout for the Substance Use portion
export default class SocialHistoryNoteRow extends Component {

    includeQuitYear() {

        const values = this.props.values;
        const condition = this.props.condition;
        const thirdField = this.props.thirdField;

        if (values[condition]["In the Past"]) {
            return (
                <Grid.Column>
                    <Form>
                        <Form.Field>
                            <label>{thirdField}</label>
                            <Input
                                onChange={this.props.onChange}
                                field={thirdField}
                                condition={condition}
                                value={values[condition][thirdField]}
                            />
                        </Form.Field>
                    </Form>
                </Grid.Column>
            )
        }
    }

    quittingQuestions() {

        const values = this.props.values;
        const condition = this.props.condition;

        if (values[condition]["Yes"]) {
            return(
                <div>
                    <Grid.Row>
                        <Grid.Column>Are you interested in quitting?</Grid.Column>
                        <Grid.Column width={4}>
                            <ToggleButton
                                title="Yes"
                                size={"small"}
                                compact={true}
                            />
                            <ToggleButton
                                title="Maybe"
                                size={"small"}
                                compact={true}
                            />
                            <ToggleButton
                                title="No"
                                size={"small"}
                                compact={true}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>Have you tried to quit before?</Grid.Column>
                        <Grid.Column width={4}>
                            <ToggleButton
                                title="Yes"
                                size={"small"}
                                compact={true}
                            />
                            <ToggleButton
                                title="No"
                                size={"small"}
                                compact={true}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </div>
            )
        }
    }

    additionalFields() {
        
        const values = this.props.values;
        const condition = this.props.condition;
        const firstField = this.props.firstField;
        const secondField = this.props.secondField;
        const fourthField = this.props.fourthField;
        const fifthField = this.props.fifthField;

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <>
                    <Grid.Column width={2}>
                        <Form>
                            <Form.Field>
                                <label>{firstField}</label>
                                <Input
                                    onChange={this.props.onChange}
                                    field={firstField}
                                    condition={condition}
                                    value={values[condition][firstField]}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <Form.Field>
                                <label>{secondField}</label>
                                <Input
                                    onChange={this.props.onChange}
                                    field={secondField}
                                    condition={condition}
                                    value={values[condition][secondField]}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <Form.Field>
                                <label>{fourthField}</label>
                                <Input
                                    onChange={this.props.onChange}
                                    field={fourthField}
                                    condition={condition}
                                    value={values[condition][fourthField]}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Form>
                            <Form.Field>
                                <label>{fifthField}</label>
                                <Input
                                    onChange={this.props.onChange}
                                    field={fifthField}
                                    condition={condition}
                                    value={values[condition][fifthField]}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    {this.includeQuitYear()}
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
                    {this.quittingQuestions()}
                </>
            )
        }
    }

    render() {
        
        const values = this.props.values;
        const condition = this.props.condition;
        
        return (
            <Grid.Row>
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
                {this.additionalFields()}
            </Grid.Row>
        )
    }
}

SocialHistoryNoteRow.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
    thirdField: PropTypes.string.isRequired
}