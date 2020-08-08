import {Form, Grid, Input } from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import '../familyhistory/FamilyHistory.css';
import HPIContext from 'contexts/HPIContext.js';

//Component that defines the layout for the Substance Use portion

export default class SocialHistoryNoteItem extends Component {

    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.includeQuitYear = this.includeQuitYear.bind(this);
        this.quittingQuestions = this.quittingQuestions.bind(this);
        this.additionalFields = this.additionalFields.bind(this);
    }

    includeQuitYear() {

        const { values, condition, onChange, quitYear, fields } = this.props;

        if (values[condition]["In the Past"]) {
            return (
                <Grid.Column computer={5} tablet={8} mobile={16}>
                    <Form.Field>
                        <label>{fields.quitYear}</label>
                        <Input
                            field={quitYear}
                            condition={condition}
                            value={values[condition][fields.quitYear]}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Grid.Column>
            )
        }
    }

    quittingQuestions() {

        const { values, condition, onInterestedButtonClick, onTriedButtonClick } = this.props;

        if (values[condition]["Yes"]) {
            return (
                <div>
                    <Grid.Row>
                        <Form className="family-hx-note-item">
                            <Form.Group inline className="condition-header">
                                <div className="condition-name">
                                    Are you interested in quitting?
                                </div>
                                <div>
                                    <ToggleButton
                                        onToggleButtonClick={onInterestedButtonClick}
                                        condition={condition}
                                        title="Yes"
                                        size={"small"}
                                        compact={true}
                                        active={values[condition]["InterestedInQuitting"]["Yes"]}
                                    />
                                    <ToggleButton
                                        onToggleButtonClick={onInterestedButtonClick}
                                        condition={condition}
                                        title="Maybe"
                                        size={"small"}
                                        compact={true}
                                        active={values[condition]["InterestedInQuitting"]["Maybe"]}
                                    />
                                    <ToggleButton
                                        onToggleButtonClick={onInterestedButtonClick}
                                        condition={condition}
                                        title="No"
                                        size={"small"}
                                        compact={true}
                                        active={values[condition]["InterestedInQuitting"]["No"]}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Grid.Row>
                    <Grid.Row>
                        <Form className="family-hx-note-item">
                            <Form.Group inline className="condition-header">
                                <div className="condition-name">
                                    Have you tried to quit before?
                                </div>
                                <div>
                                    <ToggleButton
                                        onToggleButtonClick={onTriedButtonClick}
                                        condition={condition}
                                        title="Yes"
                                        size={"small"}
                                        compact={true}
                                        active={values[condition]["TriedToQuit"]["Yes"]}
                                    />
                                    <ToggleButton
                                        onToggleButtonClick={onTriedButtonClick}
                                        condition={condition}
                                        title="No"
                                        size={"small"}
                                        compact={true}
                                        active={values[condition]["TriedToQuit"]["No"]}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Grid.Row>
                </div>
            )
        }
    }

    additionalFields() {

        const { values, condition, onChange } = this.props;
        // const showTextAreas = values[condition]["Yes"] || values[condition]["In the Past"] ? "display" : "hide";

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                // <div className={`condition-info ${showTextAreas}`}>
                <div> 
                    <br />
                    <Grid>
                        {this.includeQuitYear()}
                    </Grid>
                    <br />
                    {this.props.additionalFields()}
                    <br />
                    <Grid stackable columns="equal">
                        <Grid.Row>
                            <Grid.Column computer={5} tablet={8} mobile={16}>
                                <Form.TextArea
                                    className="text-area"
                                    label="Comments"
                                    field={"Comments"}
                                    condition={condition}
                                    value={values[condition]["Comments"]}
                                    onChange={onChange}
                                    placeholder="Comments"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        {this.quittingQuestions()}
                    </Grid>
                </div>
            )
        }
    }

    render() {
        
        const { values, condition, onToggleButtonClick } = this.props;
        // console.log(values);
        // console.log(condition);
        // console.log(values[condition]);

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
                   {this.additionalFields()}
                </Form>
            </Grid.Row>
        );
    }
}

// TODO: update this
SocialHistoryNoteItem.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
    thirdField: PropTypes.string.isRequired
    
    // onChange={this.props.onChange}
    // onToggleButtonClick={this.props.onToggleButtonClick}
    // condition={this.tobaccoFields.condition}
    // fields={this.tobaccoFields}
    // values={this.props.values}
}