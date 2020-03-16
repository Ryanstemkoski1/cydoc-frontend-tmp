import {Input} from "semantic-ui-react";
import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import React from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import GridContent from "../../components/GridContent";
import {CONDITIONS} from '../../constants/constants'
import HPIContext from "../../contexts/HPIContext"
import MedicalHistoryInput from "./MedicalHistoryInput"

//Component that manages the layout of the medical history tab content
export default class MedicalHistoryContent extends React.Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.generateListItems = this.generateListItems.bind(this);
        // this.handleConditionInput = this.handleConditionInput.bind(this);

        //Checks if all response choices exist and adds new ones
        const {response_choice} = this.props
        const values = this.context["Medical History"]
        var conditions = []
        // Creates list of conditions present in Medical History context 
        for (var value in values) {
            conditions.push(values[value]['Condition'])
        }
        for (var response_index in response_choice) {
            var response = response_choice[response_index]
            if (!conditions.hasOwnProperty(response)) {
                var index = (values.length).toString()
                values[index] = {
                    "Condition": response,
                    "Yes": false,
                    "No": false,
                    "Onset": "",
                    "Comments": ""
                }
            }
        }
        this.context.onContextChange("Medical History", values)
    }

    // handleConditionInput(event, data) {
    //     let values = this.context["Medical History"]
    //     values[data.index]["custom value"] = data.value
    //     this.context.onContextChange(this.props.value_type, values)
    // }

    //handles input field events
    handleChange(event, data){
        let conditions_array = Object.keys(this.context['Medical History']).map((value) => this.context['Medical History'][value]["Condition"])
        let index = conditions_array.indexOf(data.condition)
        const values = this.context["Medical History"];
        values[index][data.placeholder] = data.value;
        this.context.onContextChange("Medical History", values);
    }

    //handles toggle button events
    handleToggleButtonClick(event, data){
        let conditions_array = Object.keys(this.context['Medical History']).map((value) => this.context['Medical History'][value]["Condition"])
        let index = conditions_array.indexOf(data.condition)
        const values = this.context["Medical History"]
        const responses = ["Yes", "No"]
        const prevState = values[index][data.title];
        values[index][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[index][response] = false
        }
        this.context.onContextChange("Medical History", values);
    }

    render(){ 
        // The second OR statement gets the list of Conditions in the "Medical History" context
        let list_values = this.props.response_choice || (Object.keys(this.context['Medical History'])).map((value) => this.context['Medical History'][value]["Condition"]) || CONDITIONS
        const rows = this.generateListItems(list_values);
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<MedicalHistoryNoteRow condition={inputField}/>);

        return(
            <GridContent
                numColumns={4}
                contentHeader={<MedicalHistoryContentHeader />}
                rows={rows}
                customNoteRow={customNoteRow}
                question_type = {(this.props.response_choice ? "hpi" : "add_row")}
                value_type = "Medical History"
            />
        );
    }

    generateListItems(conditions) {
        return conditions.map((condition, index) =>
            <MedicalHistoryNoteRow key={index}
                                   condition={<MedicalHistoryInput key={index} index={index}/>}
                                   onset={this.context["Medical History"][index]["Onset"]}
                                   comments={this.context["Medical History"][index]["Comments"]}
                                   onChange={this.handleChange}
                                   onToggleButtonClick={this.handleToggleButtonClick}
                                   yesActive={this.context["Medical History"][index]["Yes"]}
                                   noActive={this.context["Medical History"][index]["No"]}
            />);
    }
}

