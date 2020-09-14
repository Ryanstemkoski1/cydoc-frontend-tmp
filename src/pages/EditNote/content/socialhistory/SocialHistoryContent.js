import React, {Fragment} from "react";
import {Grid, TextArea, Form, Segment} from "semantic-ui-react";
import {SOCIAL_HISTORY} from "constants/constants";
import HPIContext from 'contexts/HPIContext.js';
import Tobacco from './Tobacco';
import Alcohol from './Alcohol';
import RecreationalDrugs from './RecreationalDrugs';

export default class SocialHistoryContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.handleInterestedToggleButtonClick = this.handleInterestedToggleButtonClick.bind(this);
        this.handleTriedToggleButtonClick = this.handleTriedToggleButtonClick.bind(this);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.handleSecondaryFieldsChange = this.handleSecondaryFieldsChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.substanceUseContentHeader = SOCIAL_HISTORY.SUBSTANCE_USE_CONTENT_HEADER;
        this.secondaryFields = SOCIAL_HISTORY.SECONDARY_FIELDS;
        this.substanceUseFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS;
    }

    //handles changes in substance use portion
    handleSocialHistoryChange(event, data) {
        const values = this.context["Social History"];
        values[data.condition][data.field] = data.value;
        this.context.onContextChange("Social History", values);
    }

    //handles changes in secondary fields (living situation, diet, exercise)
    handleSecondaryFieldsChange(event, data) {
        const values = this.context["Social History"];
        values[data.field] = data.value;
        this.context.onContextChange("Social History", values);
    }

    //handles button for usage in substance use portion
    handleToggleButtonClick(event, data) {
        const values = this.context["Social History"];
        const responses = ['Yes', 'In the Past', 'Never Used'];
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        for (var response_index in responses) {
            let response = responses[response_index]
            if (data.title !== response) values[data.condition][response] = false
        }
        this.context.onContextChange("Social History", values);
    }

    //handles button for interested in quitting question in substance use portion
    handleInterestedToggleButtonClick(event, data) {
        const values = this.context["Social History"];
        const responses = ['Yes', 'Maybe', 'No'];
        console.log(data);
        const prevState = values[data.condition]["InterestedInQuitting"][data.title];
        values[data.condition]["InterestedInQuitting"][data.title] = ! prevState;
        for (var response_index in responses) {
            let response = responses[response_index]
            if (data.title !== response) values[data.condition]["InterestedInQuitting"][response] = false;
            console.log(values[data.condition]["InterestedInQuitting"][response]);
        }
        this.context.onContextChange("Social History", values);        
    }

    //handles button for tried to quit question in substance use portion
    handleTriedToggleButtonClick(event, data) {
        const values = this.context["Social History"];
        const responses = ['Yes', 'No'];
        const prevState = values[data.condition]["TriedToQuit"][data.title];
        values[data.condition]["TriedToQuit"][data.title] = ! prevState;
        for (var response_index in responses) {
            let response = responses[response_index]
            if (data.title !== response) values[data.condition]["TriedToQuit"][response] = false
        }
        this.context.onContextChange("Social History", values);
    }

    //generates a collection for the living situation, diet, exercise portion
    generateSecondaryFieldRows() {
        return (
            this.secondaryFields.map(
            (label, index) =>
                <Grid.Column key={index} computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>{label}</label>
                        <TextArea
                            onChange={this.handleSecondaryFieldsChange}
                            value={this.context["Social History"][label]}
                            field={label}
                            rows={2}
                        />
                    </Form>
                </Grid.Column>
            )
        );
    }

    // renders Tobacco, Alcohol, and RecreationalDrugs components 
    render() {
        
        const secondaryFieldRows = this.generateSecondaryFieldRows();
        // console.log(this.context["Social History"]);
        // console.log(SOCIAL_HISTORY.STATE);
        
        return (
            <Fragment>
                <Segment>
                    <Tobacco mobile={this.props.mobile} values={this.context["Social History"]} onChange={this.handleSocialHistoryChange} onToggleButtonClick={this.handleToggleButtonClick} onInterestedButtonClick={this.handleInterestedToggleButtonClick} onTriedButtonClick={this.handleTriedToggleButtonClick} onTableBodyChange={this.context.onContextChange.bind(this.context, 'Social History')} />
                </Segment>
                <Segment>
                    <Alcohol mobile={this.props.mobile} values={this.context["Social History"]} onChange={this.handleSocialHistoryChange} onToggleButtonClick={this.handleToggleButtonClick} onInterestedButtonClick={this.handleInterestedToggleButtonClick} onTriedButtonClick={this.handleTriedToggleButtonClick}/>
                </Segment>
                <Segment>
                    <RecreationalDrugs mobile={this.props.mobile} values={this.context["Social History"]} onChange={this.handleSocialHistoryChange} onToggleButtonClick={this.handleToggleButtonClick} onInterestedButtonClick={this.handleInterestedToggleButtonClick} onTriedButtonClick={this.handleTriedToggleButtonClick}/>
                </Segment>
                <Segment>
                    <Grid columns={2} stackable>
                        {secondaryFieldRows}
                    </Grid>
                </Segment>
            </Fragment>
        )
    }
}

