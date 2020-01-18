import React, { Component } from "react";
import PropTypes from 'prop-types';
import { medications } from "../../constants/States";
import {Input} from "semantic-ui-react";
import MedicationsNoteRow from "./MedicationsNoteRow";
import MedicationsContentHeader from "./MedicationsContentHeader";
import GridContent from "../../components/GridContent";
import HPIContext from "../../contexts/HPIContext"

//Component that manages content for the Medications page
export default class MedicationsContent extends Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.generateListItems = this.generateListItems.bind(this);
        const { response_choice } = this.props
        const values = this.context["Medications"]

        //Checks if all response choices exist and adds new ones
        for (var response_index in response_choice) {
            var response = response_choice[response_index]
            let isPresent = false;
            for (var medicationIndex in values) {
                if (values[medicationIndex]["Drug Name"] == response) {
                    isPresent = true;
                }

            }
            if (isPresent === false) {
                values.push({
                    "Drug Name": response,
                    "Start Date": "",
                    "Schedule": "",
                    "Dose": "",
                    "Reason for Taking": "",
                    "Side Effects": "",
                    "Comments": ""
                })
            }

        }
        this.context.onContextChange("Medications", values)
    }

    //handles input field events
    handleChange(event, data){
        //console.log(event);
        const values = this.context["Medications"];
        values[data.index][data.placeholder] = data.value;
        this.context.onContextChange("Medications", values);
    }

    generateListItems(medications) {
        return medications.map((name, index) => {
            for (let i in this.context["Medications"]) {
                if (this.context["Medications"][i]["Drug Name"] === name) {
                    return (
                        <MedicationsNoteRow  key={index}
                                                index={i}
                                                drugName={this.context["Medications"][i]["Drug Name"]}
                                                startDate={this.context["Medications"][i]["Start Date"]}
                                                onChange={this.handleChange}
                                                schedule={this.context["Medications"][i]["Schedule"]}
                                                dose={this.context["Medications"][i]["Dose"]}
                                                reason={this.context["Medications"][i]["Reason for Taking"]}
                                                sideEffects={this.context["Medications"][i]["Side Effects"]}
                                                comments={this.context["Medications"][i]["Comments"]}
                        />
                    )
                }
            }
            
        });
    }

    render() {

        let list_values = this.props.response_choice || Object.keys(this.context["Medications"]).map(index => this.context["Medications"][index]["Drug Name"])
        const rows = this.generateListItems(list_values);
        const inputField = (<Input placeholder="Condition"/>);
        const customNoteRow = (<MedicationsNoteRow/>);

        return(
            <GridContent
                numColumns='equal'
                contentHeader={<MedicationsContentHeader />}
                rows={rows}
                customNoteRow={customNoteRow}
            />
        );
    }
}