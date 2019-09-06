import React, {Fragment} from "react";
import {Divider, Grid} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SecondarySocialHistoryNoteRow from "./SecondarySocialHistoryNoteRow";
import YesNoContent from "../YesNoContent";
import fields from "./fields"

export default class SocialHistoryContent extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubstanceUseChange = this.handleSubstanceUseChange.bind(this);
        this.handleSecondaryFieldsChange = this.handleSecondaryFieldsChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.generateSubstanceUseRows = this.generateSubstanceUseRows.bind(this);
        this.substanceUseContentHeader = fields.substanceUseContentHeader;
;        this.secondaryFields = fields.secondaryFields;
        this.substanceAbuseFields = fields.substanceAbuseFields;
        this.state = {
            tobacco: {},
            alcohol: {},
            recreationalDrugs: {},
        }
    }

    handleSubstanceUseChange(event, data) {
        console.log(data);
        let newState = this.state;
        newState[data.condition][data.field] = data.value;
        this.setState(newState);
    }

    handleSecondaryFieldsChange(event, data) {
        console.log(data);
        let newState = this.state;
        newState[data.field] = data.value;
        this.setState(newState);
    }

    generateSecondaryFieldRows() {
        return this.secondaryFields.map(
            (label) => <SecondarySocialHistoryNoteRow
                onChange={this.handleSecondaryFieldsChange}
                label={label}/>
        );
    }

    generateSubstanceUseRows() {
        return Object.keys(this.substanceAbuseFields).map(
            (label) => <SocialHistoryNoteRow onChange={this.handleSubstanceUseChange}
                                             condition={this.substanceAbuseFields[label].condition}
                                             firstField={this.substanceAbuseFields[label].firstField}
                                             secondField={this.substanceAbuseFields[label].secondField}/>
        );
    }

    render() {
        const rowToAdd = (<SocialHistoryNoteRow
            onChange={this.handleSubstanceUseChange}
            condition=""
            firstField={this.substanceAbuseFields.substanceAbuse.firstField}
            secondField={this.substanceAbuseFields.substanceAbuse.secondField}/>);

        const substanceUseRows = this.generateSubstanceUseRows();
        const secondaryFieldRows = this.generateSecondaryFieldRows();
        return(
            <Fragment>
                <YesNoContent contentHeader={this.substanceUseContentHeader} customNoteRow={rowToAdd} listItems={substanceUseRows} numColumns={5}/>
                <Divider/>
                <br/>
                <Grid columns={2}>
                    {secondaryFieldRows}
                </Grid>
            </Fragment>
        )
    }
}
