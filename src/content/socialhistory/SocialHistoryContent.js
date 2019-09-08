import React, {Fragment} from "react";
import {Divider, Grid} from "semantic-ui-react";
import SocialHistoryNoteRow from "./SocialHistoryNoteRow";
import SecondarySocialHistoryNoteRow from "./SecondarySocialHistoryNoteRow";
import YesNoContent from "../YesNoContent";
import constants from "../../constants"

export default class SocialHistoryContent extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSubstanceUseChange = this.handleSubstanceUseChange.bind(this);
        this.handleSecondaryFieldsChange = this.handleSecondaryFieldsChange.bind(this);
        this.generateSecondaryFieldRows = this.generateSecondaryFieldRows.bind(this);
        this.generateSubstanceUseRows = this.generateSubstanceUseRows.bind(this);
        this.substanceUseContentHeader = constants.socialhistory.substanceUseContentHeader;
;        this.secondaryFields = constants.socialhistory.secondaryFields;
        this.substanceAbuseFields = constants.socialhistory.substanceAbuseFields;
        // this.state = {
        //     tobacco: {},
        //     alcohol: {},
        //     recreationalDrugs: {},
        //     value: this.props.value
        // }
    }


    handleSecondaryFieldsChange(event, data) {
        // console.log(data);
        let newState = this.state;
        newState[data.field] = data.value;
        this.setState(newState);
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
            (label, index) => <SocialHistoryNoteRow onChange={props.onChange}
                                                    key={index}
                                                    condition={this.substanceAbuseFields[label].condition}
                                                    firstField={this.substanceAbuseFields[label].firstField}
                                                    secondField={this.substanceAbuseFields[label].secondField}
                                                    value={props.value}/>
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
