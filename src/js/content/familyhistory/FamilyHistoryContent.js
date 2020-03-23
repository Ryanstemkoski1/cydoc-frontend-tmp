import React, {Component, Fragment} from 'react';
import GridContent from "../../components/GridContent";
import FamilyHistoryContentHeader from "./FamilyHistoryContentHeader";
import FamilyHistoryNoteRow from "./FamilyHistoryNoteRow";
import FamilyHistoryNoteItem from "./FamilyHistoryNoteItem";
import {CONDITIONS} from '../../constants/constants'
import HPIContext from "../../contexts/HPIContext"
import ConditionInput from "../../components/ConditionInput"
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

        //Checks if all response choices exist and adds new ones
        const {response_choice} = this.props
        const values = this.context["Family History"]
        var conditions = []
        // Creates list of conditions present in Family History
        for (var value in values) {
            conditions.push(values[value]['Condition'].toLowerCase())
        }
        for (var response_index in response_choice) {
            var response = response_choice[response_index]
            var condition_index = conditions.indexOf(response.toLowerCase())
            if (condition_index === -1) {
                var index = (Object.keys(values).length).toString()
                values[index] = {
                    "Condition": response,
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
        let index = data.condition.props.index
        const values = this.context["Family History"];
        values[index][data.placeholder] = data.value;
        this.context.onContextChange("Family History", values);
    }

    //handles toggle button events
    handleToggleButtonClick(event, data){
        let index = data.condition.props.index
        const values = this.context["Family History"];
        const responses = ["Yes", "No"]
        const prevState = values[index][data.title];
        values[index][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[index][response] = false
        }
        this.context.onContextChange("Family History", values);
    }

    render(){
        const { windowWidth } = this.state;
        const mobile = windowWidth < FAMILY_HISTORY_MOBILE_BP;
        //Create collection of rows
        // Use second OR statement so that the information may be auto-populated in the Family History tab
        var list_values = this.props.response_choice || Object.keys(this.context["Family History"])
        var conditions = Object.keys(this.context["Family History"]).map((value) => this.context['Family History'][value]['Condition'])
        var index_dict = {}
        if (this.props.response_choice) {
            for (var condition_index in list_values) {
                var condition = list_values[condition_index]
                index_dict[condition] = conditions.indexOf(condition) 
            }}
        const listItems = mobile ? 
        list_values.map((condition, index) => 
        <FamilyHistoryNoteItem   key={condition}
                                    condition={<ConditionInput key={condition} index={Object.keys(index_dict).length > 0 ? index_dict[condition] : index} category={"Family History"}/>}
                                    familyMember={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Family Member"]}
                                    comments={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Comments"]}
                                    onChange={this.handleChange}
                                    onToggleButtonClick={this.handleToggleButtonClick}
                                    yesActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Yes"]}
                                    noActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["No"]}
                                    CODActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Cause of Death"]}
            />
        ) :
        list_values.map((condition, index) =>
            <FamilyHistoryNoteRow   key={condition}
                                    index={Object.keys(index_dict).length > 0 ? index_dict[condition] : index}
                                    condition={<ConditionInput key={condition} index={Object.keys(index_dict).length > 0 ? index_dict[condition] : index} category={"Family History"}/>}
                                    familyMember={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Family Member"]}
                                    comments={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Comments"]}
                                    onChange={this.handleChange}
                                    onToggleButtonClick={this.handleToggleButtonClick}
                                    yesActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Yes"]}
                                    noActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["No"]}
                                    CODActive={this.context["Family History"][Object.keys(index_dict).length > 0 ? index_dict[condition] : index]["Cause of Death"]}
            />)

        return(
            <Fragment>
                <GridContent
                    numColumns={5}
                    contentHeader={<FamilyHistoryContentHeader />}
                    rows={listItems}
                    question_type = {(this.props.response_choice ? "hpi" : "add_row")}
                    value_type = "Family History" 
                    conditions={list_values}
                    mobile={mobile}
                />
            </Fragment>
        );
    }
}