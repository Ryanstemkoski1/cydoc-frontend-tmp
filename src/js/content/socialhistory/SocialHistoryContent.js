import React, {Fragment} from "react";
import {Divider, Grid} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SecondarySocialHistoryNoteRow from "./SecondarySocialHistoryNoteRow";
import GridContent from "../../components/GridContent";
import {SOCIAL_HISTORY} from "../../constants/constants"


export default class SocialHistoryContent extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.generateSubstanceUseRows = this.generateSubstanceUseRows.bind(this);
        this.substanceUseContentHeader = SOCIAL_HISTORY.SUBSTANCE_USE_CONTENT_HEADER;
        this.secondaryFields = SOCIAL_HISTORY.SECONDARY_FIELDS;
        this.substanceUseFields = SOCIAL_HISTORY.SUBSTANCE_USE_FIELDS;
    }

    //handles changes in substance use portion
    handleSocialHistoryChange(event, data){
        console.log(data);
        const values = this.props.values;
        values[data.condition][data.field] = data.value;
        console.log(values);
        this.props.onSocialHistoryChange(data, values);
    }

    //handles button in substance use portion
    handleToggleButtonClick(event, data){
        const values = this.props.values;
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        this.props.onSocialHistoryChange(data, values);
    }

    //generates a collection for the living situation, diet, exercise portion
    generateSecondaryFieldRows() {
        return this.secondaryFields.map(
            (label, index) => <SecondarySocialHistoryNoteRow
                key={index}
                onChange={this.handleSecondaryFieldsChange}
                label={label}/>
        );
    }

    //Generates a collection of Grid.Row for the substance use portion
    generateSubstanceUseRows() {
        return Object.keys(this.substanceUseFields).map(
            (label, index) => <SocialHistoryNoteRow onChange={this.handleSocialHistoryChange}
                                                    key={index}
                                                    onToggleButtonClick={this.handleToggleButtonClick}
                                                    condition={this.substanceUseFields[label].condition}
                                                    firstField={this.substanceUseFields[label].firstField}
                                                    secondField={this.substanceUseFields[label].secondField}
                                                    values={this.props.values}/>
        );
    }

    render() {

        //a blank row to allow addition of drugs
        //TODO: make add row button aligned with the firstField
        const rowToAdd = (<SocialHistoryNoteRow
            onChange={this.handleSubstanceUseChange}
            condition=""
            firstField={this.substanceUseFields.substanceAbuse.firstField}
            secondField={this.substanceUseFields.substanceAbuse.secondField}/>);

        const substanceUseRows = this.generateSubstanceUseRows();
        const secondaryFieldRows = this.generateSecondaryFieldRows();
        return(
            <Fragment>
                <GridContent value={this.props.value}
                             contentHeader={this.substanceUseContentHeader}
                             customNoteRow={rowToAdd}
                             rows={substanceUseRows}
                             numColumns={5}/>
                <Divider/>
                <br/>
                <Grid columns={2}>
                    {secondaryFieldRows}
                </Grid>
            </Fragment>
        )
    }
}
