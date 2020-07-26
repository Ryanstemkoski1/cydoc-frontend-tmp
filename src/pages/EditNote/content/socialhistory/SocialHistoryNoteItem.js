import {Form, Grid, Input, Dropdown} from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import '../familyhistory/FamilyHistory.css';
import tobaccoProducts from 'constants/SocialHistory/tobaccoProducts';
import drinkTypes from 'constants/SocialHistory/drinkTypes';
import drinkSizes from 'constants/SocialHistory/drinkSizes'
import drugNames from 'constants/SocialHistory/drugNames';
import modesOfDelivery from 'constants/SocialHistory/modesOfDelivery';

//Component that defines the layout for the Substance Use portion

const dropDowns = ["Products Used", "Drink Type", "Drink Size", "Drug Name", "Mode of Delivery"];

export default class SocialHistoryNoteItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ProductsUsed: tobaccoProducts,
            DrinkType: drinkTypes,
            DrinkSize: drinkSizes,
            DrugName: drugNames,
            ModeofDelivery: modesOfDelivery,
        }
    }

    includeQuitYear() {

        const { values, condition, onChange, quitYear, fields } = this.props;
        // TODO: figure out why values[condition]["Quit Year"] is undefined

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

        const { values, condition } = this.props;

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
                                        title="Yes"
                                        size={"small"}
                                        compact={true}
                                    />
                                    <ToggleButton
                                        title="No"
                                        size={"small"}
                                        compact={true}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Grid.Row>
                </div>
            )
        }
    }

    // TODO: make it so you can "add row" for drugs and alcohol
    // TODO: have an onChange for drop downs
    additionalFields() {

        const space = /\s/g;
        const { values, condition, onChange, fields } = this.props;
        const showTextAreas = values[condition]["Yes"] || values[condition]["In the Past"] ? "display" : "hide";

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <div className={`condition-info ${showTextAreas}`}>
                    <Grid stackable columns="equal">
                        {Object.keys(fields).map(key => (
                            key !== "condition" && key !== "quitYear" && ! dropDowns.includes(fields[key]) ?
                            <Grid.Column computer={5} tablet={8} mobile={16}>
                                <Form.Field>
                                    <label>{fields[key]}</label>
                                    <Input
                                        field={fields[key]}
                                        condition={condition}
                                        value={values[condition][key]}
                                        onChange={onChange}
                                    />
                                </Form.Field>
                            </Grid.Column> : dropDowns.includes(fields[key]) ? 
                            <Grid.Column>
                                <label>{fields[key]}</label>
                                <Dropdown
                                    placeholder={fields[key]}
                                    fluid
                                    multiple
                                    search
                                    selection
                                    options={this.state[fields[key].replace(space, "")]}
                                />
                            </Grid.Column> : null
                        ))}
                        {this.includeQuitYear()}
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

SocialHistoryNoteItem.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
    thirdField: PropTypes.string.isRequired
}