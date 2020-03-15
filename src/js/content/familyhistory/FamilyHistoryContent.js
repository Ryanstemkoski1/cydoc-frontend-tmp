import React, {Component, Fragment} from 'react';
import GridContent from "../../components/GridContent";
import FamilyHistoryContentHeader from "./FamilyHistoryContentHeader";
import {Input} from "semantic-ui-react";
import FamilyHistoryNoteRow from "./FamilyHistoryNoteRow";
import FamilyHistoryNoteItem from "./FamilyHistoryNoteItem";
import {CONDITIONS} from '../../constants/constants'
import HPIContext from "../../contexts/HPIContext"
import {FAMILY_HISTORY_MOBILE_BP} from "../../constants/breakpoints.js";

//TODO: finish the styling for this page
//Component that manages the layout for the Family History page.
export default class FamilyHistoryContent extends Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        const {response_choice} = this.props
        const values = this.context["Family History"]
        for (var response_index in response_choice) {
            var response = response_choice[response_index]
            if (!values.hasOwnProperty(response)) {
                values[response] = {
                    "Yes": false,
                    "No": false,
                    "Family Member": "",
                    "Cause of Death": false,
                    "Comments": ""
                }
            }
        }
        this.context.onContextChange("Family History", values)
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
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
        const responses = ["Yes", "No"]
        const prevState = values[data.condition][data.title];
        values[data.condition][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[data.condition][response] = false
        }
        this.context.onContextChange("Family History", values);
    }

    render(){
        const { windowWidth } = this.state;
        const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
        //Create collection of rows
        // Use second OR statement so that the information may be auto-populated in the Family History tab
        var list_values = this.props.response_choice || Object.keys(this.context["Family History"]) || CONDITIONS;

        const listItems = mobile ?
        list_values.map((condition, index) =>
            <FamilyHistoryNoteItem
                key={index}
                condition={condition}
                familyMember={this.context["Family History"][condition]["Family Member"]}
                comments={this.context["Family History"][condition]["Comments"]}
                onChange={this.handleChange}
                onToggleButtonClick={this.handleToggleButtonClick}
                yesActive={this.context["Family History"][condition]["Yes"]}
                noActive={this.context["Family History"][condition]["No"]}
                CODActive={this.context["Family History"][condition]["Cause of Death"]}
            />)
        : list_values.map((condition, index) =>
            <FamilyHistoryNoteRow
                key={index}
                condition={condition}
                familyMember={this.context["Family History"][condition]["Family Member"]}
                comments={this.context["Family History"][condition]["Comments"]}
                onChange={this.handleChange}
                onToggleButtonClick={this.handleToggleButtonClick}
                yesActive={this.context["Family History"][condition]["Yes"]}
                noActive={this.context["Family History"][condition]["No"]}
                CODActive={this.context["Family History"][condition]["Cause of Death"]}
            />);
        //Create the row to be added with addRow button
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<FamilyHistoryNoteRow condition={inputField}/>);

        return(
            <Fragment>
                <GridContent
                    numColumns={5}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    customNoteRow={customNoteRow}
                    conditions={list_values}
                    mobile={mobile}
                />
            </Fragment>
        );
    }
}