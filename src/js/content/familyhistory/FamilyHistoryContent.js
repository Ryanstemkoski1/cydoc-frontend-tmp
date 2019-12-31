import React, {Component, Fragment} from 'react';
import GridContent from "../../components/GridContent";
import FamilyHistoryContentHeader from "./FamilyHistoryContentHeader";
import {Input} from "semantic-ui-react";
import FamilyHistoryNoteRow from "./FamilyHistoryNoteRow";
import {CONDITIONS} from '../../constants/constants'
import HPIContext from "../../contexts/HPIContext"

//TODO: finish the styling for this page
//Component that manages the layout for the Family History page.
export default class FamilyHistoryContent extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
    }

    //handles input field events
    handleChange(event, data){
        //console.log(event);
        const values = this.context["Family History"];
        values[data.condition][data.placeholder] = data.value;
        this.context.onContextChange("Family History", values);
    }

    //handles toggle button events
    handleToggleButtonClick(event, data){
        const values = this.context["Family History"];
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        this.context.onContextChange("Family History", values);
    }

    render(){
        //Create collection of rows
        const listItems = CONDITIONS.map((condition, index) => 
            <FamilyHistoryNoteRow   key={index}
                                    condition={condition}
                                    familyMember={this.context["Family History"][condition]["Family Member"]}
                                    comments={this.context["Family History"][condition]["Comments"]}
                                    onChange={this.handleChange}
                                    onToggleButtonClick={this.handleToggleButtonClick}
                                    yesActive={this.context["Family History"][condition]["Yes"]}
                                    noActive={this.context["Family History"][condition]["No"]}
                                    CODActive={this.context["Family History"][condition]["Cause of Death"]}
            />)
        //Create the row to be added with addRow button
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<FamilyHistoryNoteRow condition={inputField}/>);

        return(
            <Fragment>
                <GridContent
                    numColumns={5}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    customNoteRow={customNoteRow} />
            </Fragment>
        )
    }
}