import MedicalHistoryNoteRow from "./MedicalHistoryNoteRow";
import MedicalHistoryNoteItem from "./MedicalHistoryNoteItem";
import React from 'react';
import MedicalHistoryContentHeader from "./MedicalHistoryContentHeader";
import GridContent from 'components/tools/GridContent.js';
import {CONDITIONS} from 'constants/constants'
import HPIContext from 'contexts/HPIContext.js'
import ConditionInput from 'components/tools/ConditionInput.js'
import {adjustValue} from './util';
import {medicalMapping} from 'constants/word-mappings';

//Component that manages the layout of the medical history tab content
export default class MedicalHistoryContent extends React.Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        //Checks if all response choices exist and adds new ones
        const { response_choice, isPreview } = this.props;
        const response_choice_list = []
        // const seenConditions = {};
        if (!isPreview) {
            const values = this.context["Medical History"]
            var conditions = []
            // Creates list of conditions present in Medical History context 
            for (var value in values) {
                let name = values[value]['Condition'].toLowerCase();
                conditions.push(name);
                // seenConditions.add(adjustValue(name, medicalMapping));
            }
            for (var response_index in response_choice) {
                var response = response_choice[response_index]
                var condition_index = conditions.indexOf(response.toLowerCase())
                // seenConditions[adjustValue(response, medicalMapping)] = condition_index;
                if (condition_index === -1) {
                    var condition_index = (Object.keys(values).length).toString()
                    values[condition_index] = {
                        "index": condition_index,
                        "Condition": response,
                        "Yes": false,
                        "No": false,
                        "Onset": "",
                        "Comments": ""
                    }
                }
                response_choice_list.push(condition_index)
            }
            
            this.context.onContextChange("Medical History", values)
            
        }
        this.state = {
            // seenConditions,
            response_choice: response_choice_list
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
        this.generateListItems = this.generateListItems.bind(this); 
        this.addSeenCondition = this.addSeenCondition.bind(this); 
        this.addRow = this.addRow.bind(this);
    } 

    componentDidMount() {
        const values = this.context["Medical History"];
        const seenConditions = {};
        Object.keys(values).forEach((val, i) => {
            let name = values[val]['Condition'];
            seenConditions[adjustValue(name, medicalMapping)] = i;
        });
        this.setState({ seenConditions });

    }

    //handles input field events
    handleChange(event, data){
        let conditions_array = Object.keys(this.context['Medical History']).map((value) => this.context['Medical History'][value]["Condition"]);
        let index = conditions_array.indexOf(data.condition);
        const values = this.context["Medical History"];
        values[index][data.placeholder] = data.value;
        this.context.onContextChange("Medical History", values);
    }

    //handles toggle button events
    handleToggleButtonClick(event, data){
        let conditions_array = Object.keys(this.context['Medical History']).map((value) => this.context['Medical History'][value]["Condition"]);
        let index = conditions_array.indexOf(data.condition);
        const values = this.context["Medical History"]
        const responses = ["Yes", "No"]
        const prevState = values[index][data.title];
        values[index][data.title] = ! prevState;
        for (var response_index in responses) {
            var response = responses[response_index]
            if (data.title !== response) values[index][response] = false
        }
        this.context.onContextChange("Medical History", values);

        let textAreas = document.getElementsByClassName(`text-area-${index}`);
        for (let i = 0; i < textAreas.length; i++) {
            data.title === responses[0] ? textAreas[i].style.display = "block" : textAreas[i].style.display = "none"; 
        }
    }

    addSeenCondition = (value, index) => {
        const { seenConditions } = this.state;
        seenConditions[value] = index;
        this.setState({ seenConditions });   
    }

    addRow() {
        let values = this.context[this.props.value_type]
        let last_index = Object.keys(values).length.toString()
        values[last_index] = {
            'Condition': "",
            "Yes": false,
            "No": false,
            "Onset": "",
            "Comments": ""
        }
        this.context.onContextChange(this.props.value_type, values);
    }

    render(){ 
        const mobile = this.props.mobile;
        // The second OR statement gets the list of Conditions in the "Medical History" context
        let list_values;
        if (this.props.isPreview) {
            list_values = this.props.values;
        } else {
            list_values = this.props.response_choice 
                ? this.state.response_choice 
                : (Object.keys(this.context['Medical History'])) || CONDITIONS
        }
        const rows = this.generateListItems(list_values, mobile); 

        return(
            <GridContent
                isPreview={this.props.isPreview}
                numColumns={4}
                contentHeader={<MedicalHistoryContentHeader />}
                rows={rows}
                question_type = {(this.props.response_choice ? "hpi" : "add_row")}
                value_type = "Medical History"
                mobile={mobile}
                addRow={this.addRow}
                name={"medical history"}
            />
        );
    }

    generateListItems(conditions, mobile) { 
        const { isPreview } = this.props;
        const { seenConditions } = this.state;
        return mobile ?
            conditions.map((condition, index) => {
                if (isPreview) {
                    return (
                        <MedicalHistoryNoteItem
                            key={index}
                            isPreview={isPreview}
                            condition={<ConditionInput 
                                key={index} 
                                index={index}
                                category={"Medical History"}
                                isPreview={isPreview}
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                                condition={condition}/>}
                            onset={''}
                            comments={''}
                            onChange={() => {}}
                            onToggleButtonClick={() => {}}
                            yesActive={false}
                            noActive={false}
                        />
                    );
                } else {
                    return (
                        <MedicalHistoryNoteItem
                            key={index}
                            condition={<ConditionInput 
                                key={index} 
                                index={index}
                                category={"Medical History"}
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                                condition={this.context["Medical History"][condition]['Condition']}/>}
                            onset={this.context["Medical History"][index]["Onset"]}
                            comments={this.context["Medical History"][index]["Comments"]}
                            onChange={this.handleChange}
                            onToggleButtonClick={this.handleToggleButtonClick}
                            yesActive={this.context["Medical History"][index]["Yes"]}
                            noActive={this.context["Medical History"][index]["No"]}
                        />
                    );
                }
            }) :
            conditions.map((condition_index, index) => {
                if (isPreview) {
                    return (
                        <MedicalHistoryNoteRow
                            key={index}
                            isPreview={isPreview}
                            condition={<ConditionInput 
                                key={index} 
                                isPreview={isPreview}
                                index={condition_index} 
                                category={"Medical History"} 
                                condition={condition_index}
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                            />}
                            onset={''}
                            comments={''}
                            onChange={() => {}}
                            onToggleButtonClick={() => {}}
                            yesActive={false}
                            noActive={false}
                        />
                    )
                } else {
                    return (
                        <MedicalHistoryNoteRow
                            key={index}
                            condition={<ConditionInput 
                                key={index} 
                                index={condition_index} 
                                category={"Medical History"} 
                                seenConditions={seenConditions}
                                addSeenCondition={this.addSeenCondition}
                                condition={this.context["Medical History"][condition_index]['Condition']}
                            />}
                            onset={this.context["Medical History"][condition_index]["Onset"]}
                            comments={this.context["Medical History"][condition_index]["Comments"]}
                            onChange={this.handleChange}
                            onToggleButtonClick={this.handleToggleButtonClick}
                            yesActive={this.context["Medical History"][condition_index]["Yes"]}
                            noActive={this.context["Medical History"][condition_index]["No"]}
                        />
                    )
                }
            });
    }
}

