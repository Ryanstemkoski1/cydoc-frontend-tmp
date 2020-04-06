import React, {Fragment} from "react";
import {Divider, Grid, TextArea, Form} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SocialHistoryNoteItem from "./SocialHistoryNoteItem";
import GridContent from "../../components/GridContent";
import {SOCIAL_HISTORY} from "../../constants/constants"
import HPIContext from "../../contexts/HPIContext"


export default class SocialHistoryContent extends React.Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.handleSecondaryFieldsChange = this.handleSecondaryFieldsChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.generateSubstanceUseRows = this.generateSubstanceUseRows.bind(this);
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

    //handles button in substance use portion
    handleToggleButtonClick(event, data){
        const values = this.context["Social History"];
        const responses = ['Yes', 'In the Past', 'Never Used']
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[data.condition][response] = false
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

    //Generates a collection of Grid.Row for the substance use portion
    generateSubstanceUseRows() {
        return (this.props.mobile ? (
            Object.keys(this.substanceUseFields).map(
                (label, index) =>
                    <SocialHistoryNoteItem
                        onChange={this.handleSocialHistoryChange}
                        key={index}
                        onToggleButtonClick={this.handleToggleButtonClick}
                        condition={this.substanceUseFields[label].condition}
                        firstField={this.substanceUseFields[label].firstField}
                        secondField={this.substanceUseFields[label].secondField}
                        values={this.context["Social History"]}
                    />
                )
            ) : (
            Object.keys(this.substanceUseFields).map(
                (label, index) =>
                    <SocialHistoryNoteRow
                        onChange={this.handleSocialHistoryChange}
                        key={index}
                        onToggleButtonClick={this.handleToggleButtonClick}
                        condition={this.substanceUseFields[label].condition}
                        firstField={this.substanceUseFields[label].firstField}
                        secondField={this.substanceUseFields[label].secondField}
                        values={this.context["Social History"]}
                    />
            )
        ));
    }

    render() {

        //a blank row to allow addition of drugs
        //TODO: make add row button aligned with the firstField
        const rowToAdd = (<SocialHistoryNoteRow
            onChange={this.handleSubstanceUseChange}
            condition=""
            firstField={this.substanceUseFields["Substance Abuse"].firstField}
            secondField={this.substanceUseFields["Substance Abuse"].secondField}/>);

        const substanceUseRows = this.generateSubstanceUseRows();
        const secondaryFieldRows = this.generateSecondaryFieldRows();
        return(
            <Fragment>
                <GridContent
                    value={this.props.value}
                    contentHeader={this.substanceUseContentHeader}
                    customNoteRow={rowToAdd}
                    rows={substanceUseRows}
                    numColumns={5}
                    mobile={this.props.mobile}
                />
                {this.props.mobile ? <div/> : <Divider/>}
                <br/>
                <Grid columns={2} stackable>
                    {secondaryFieldRows}
                </Grid>
            </Fragment>
        )
    }
}
