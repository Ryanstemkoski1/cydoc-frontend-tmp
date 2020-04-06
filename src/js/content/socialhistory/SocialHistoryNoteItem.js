import {Form, Grid, Input} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import "../../../css/content/familyHistory.css";

//Component that defines the layout for the Substance Use portion
export default class SocialHistoryNoteItem extends Component {
    render() {
        const { values, condition, firstField, secondField, onToggleButtonClick, onChange } = this.props;

        const showTextAreas = values[condition]["Yes"] || values[condition]["In the Past"] ? "display" : "hide";

        return (
            <Grid.Row>
                <Form className="family-hx-note-item">
                    <Form.Group inline className="condition-header">
                        <div className="condition-name">
                            {condition}
                        </div>
                        <div>
                            <ToggleButton
                                onToggleButtonClick={onToggleButtonClick}
                                condition={condition}
                                title="Yes"
                                size={"small"}
                                compact={true}
                                active={values[condition]["Yes"]}
                            />
                            <ToggleButton
                                onToggleButtonClick={onToggleButtonClick}
                                condition={condition}
                                title="In the Past"
                                size={"small"}
                                compact={true}
                                active={values[condition]["In the Past"]}
                            />
                            <ToggleButton
                                onToggleButtonClick={onToggleButtonClick}
                                condition={condition}
                                title="Never Used"
                                size={"small"}
                                compact={true}
                                active={values[condition]["Never Used"]}
                            />
                        </div>
                    </Form.Group>
                    <div className={`condition-info ${showTextAreas}`}>
                        <Grid stackable columns="equal">
                            <Grid.Column computer={5} tablet={8} mobile={16}>
                                <Form.Field>
                                    <label>{firstField}</label>
                                    <Input
                                        field={firstField}
                                        condition={condition}
                                        value={values[condition][firstField]}
                                        onChange={onChange}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={5} tablet={8} mobile={16}>
                                <Form.Field>
                                    <label>{secondField}</label>
                                    <Input
                                        field={secondField}
                                        condition={condition}
                                        value={values[condition][secondField]}
                                        onChange={onChange}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={6} tablet={16} mobile={16}>
                                <Form.TextArea
                                    className="text-area"
                                    label="Comments"
                                    field={"Comments"}
                                    condition={condition}
                                    value={values[condition]["Comments"]}
                                    onChange={onChange}
                                    placeholder="Comments"
                                    rows={2}
                                />
                            </Grid.Column>
                        </Grid>
                    </div>
                </Form>
            </Grid.Row>
        );
    }
}

SocialHistoryNoteItem.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
}