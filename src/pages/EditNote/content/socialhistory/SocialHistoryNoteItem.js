import {Form, Grid, Input, Divider } from 'semantic-ui-react';
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import HPIContext from 'contexts/HPIContext.js';
import '../../../../components/tools/TableContent.css';

//Component that defines the layout for the Substance Use portion

export default class SocialHistoryNoteItem extends Component {

    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            invalidYear: false,
        };
        this.includeQuitYear = this.includeQuitYear.bind(this);
        this.quittingQuestions = this.quittingQuestions.bind(this);
        this.additionalFields = this.additionalFields.bind(this);
    }

    onYearChange = (e) => {
        this.setState({ invalidYear: e.target.value !== "" && !/^(19\d\d|20[0-2]\d)$/.test(e.target.value) });
    }

    // asks users to enter the quit year if they stopped using alcohol, drugs, etc.
    includeQuitYear() {

        const { values, condition, onChange, fields } = this.props;

        if (values[condition]["In the Past"]) {
            return (
                <Grid.Column computer={5} tablet={8} mobile={16}>
                    <Form.Field className='table-year-input'>
                        {fields.quitYear}
                        <Input
                            type="number"
                            field={fields.quitYear}
                            onBlur={this.onYearChange}
                            condition={condition}
                            value={values[condition][fields.quitYear]}
                            onChange={onChange}
                        />
                        {this.state.invalidYear && (
                            <p className='error'>Please enter a year between 1900 and 2020</p>
                        )}
                    </Form.Field>
                </Grid.Column>
            )
        }
    }

    // if user is currently using alcohol, drugs, etc. ask if they have tried to quit and if they are interested in quitting
    quittingQuestions() {

        const { values, condition, onInterestedButtonClick, onTriedButtonClick } = this.props;
        console.log(values[condition]["InterestedInQuitting"]["Yes"]);

        if (values[condition]["Yes"]) {
            return (
                <Grid stackable>
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
                </Grid>
            )
        }
    }

    // adds quitYear, additionalFields from props (specific to section), and quittingQuestions based on user responses to "Yes, In the Past, No"
    additionalFields() {

        const { values, condition, onChange } = this.props;

        if (values[condition]["Yes"] || values[condition]["In the Past"]) {
            return (
                <div> 
                    <Divider hidden />
                    <Grid stackable>
                        {this.includeQuitYear()}
                    </Grid>
                    <Divider hidden />
                    {this.props.additionalFields()}
                    <Divider hidden />
                    {this.quittingQuestions()}
                    <Divider hidden />
                    <Grid.Row>
                        <div className="condition-name">Comments</div>
                        <Form.TextArea inline className='condition-header'
                            field={"Comments"}
                            condition={condition}
                            value={values[condition]["Comments"]}
                            onChange={onChange}
                            placeholder= {this.props.mobile ? "Comments" : null}
                        />
                    </Grid.Row>
                </div>
            )
        }
    }

    // renders a SocialHistoryNoteItem with three toggle buttons to describe a user's current drinking/drug use/tobacco habits and additional fields as specified above
    render() {
        
        const { values, condition, onToggleButtonClick, onChange } = this.props;

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
                    {values[condition]['Yes'] || values[condition]['In the Past'] ? <Divider hidden /> : null}
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
    thirdField: PropTypes.string.isRequired,
    quitYear: PropTypes.string.isRequired
    
    // onChange={this.props.onChange}
    // onToggleButtonClick={this.props.onToggleButtonClick}
    // condition={this.tobaccoFields.condition}
    // fields={this.tobaccoFields}
    // values={this.props.values}
}