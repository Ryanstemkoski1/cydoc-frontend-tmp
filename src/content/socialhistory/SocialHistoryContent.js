import React, {Fragment} from "react";
import {Divider, Grid} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SecondarySocialHistoryNoteRow from "./SecondarySocialHistoryNoteRow";
import YesNoContent from "../YesNoContent";
import constants from "../../constants"

export default class SocialHistoryContent extends React.Component {
    constructor(props) {
        super(props);
        this.handleSocialHistoryChange = this.handleSocialHistoryChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.generateSubstanceUseRows = this.generateSubstanceUseRows.bind(this);
        this.substanceUseContentHeader = constants.socialhistory.substanceUseContentHeader;
;       this.secondaryFields = constants.socialhistory.secondaryFields;
        this.substanceAbuseFields = constants.socialhistory.substanceAbuseFields;
    }

    handleSocialHistoryChange(event, data){
        console.log(data);
        const values = this.props.values;
        values[data.condition][data.field] = data.value;
        console.log(values);
        this.props.onSocialHistoryChange(data, values);
    }


    generateSecondaryFieldRows() {
        return this.secondaryFields.map(
            (label, index) => <SecondarySocialHistoryNoteRow
                key={index}
                onChange={this.handleSecondaryFieldsChange}
                label={label}/>
        );
    }

    generateSubstanceUseRows(props) {
        return Object.keys(this.substanceAbuseFields).map(
            (label, index) => <SocialHistoryNoteRow onChange={this.handleSocialHistoryChange}
                                                    key={index}
                                                    condition={this.substanceAbuseFields[label].condition}
                                                    firstField={this.substanceAbuseFields[label].firstField}
                                                    secondField={this.substanceAbuseFields[label].secondField}
                                                    values={props.values}/>
        );
    }

    render() {
        const rowToAdd = (<SocialHistoryNoteRow
            onChange={this.handleSubstanceUseChange}
            condition=""
            firstField={this.substanceAbuseFields.substanceAbuse.firstField}
            secondField={this.substanceAbuseFields.substanceAbuse.secondField}/>);

        const substanceUseRows = this.generateSubstanceUseRows(this.props);
        const secondaryFieldRows = this.generateSecondaryFieldRows();
        return(
            <Fragment>
                <YesNoContent value={this.props.value} contentHeader={this.substanceUseContentHeader} customNoteRow={rowToAdd} listItems={substanceUseRows} numColumns={5}/>
                <Divider/>
                <br/>
                <Grid columns={2}>
                    {secondaryFieldRows}
                </Grid>
            </Fragment>
        )
    }
}
