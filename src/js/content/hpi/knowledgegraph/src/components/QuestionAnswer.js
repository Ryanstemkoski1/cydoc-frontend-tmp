import React from 'react'
import "../css/Button.css"
import ButtonTag from "./ButtonTag";
import YesNo from "./YesNo";
import HandleInput from "./HandleInput"
import HandleNumericInput from "./HandleNumericInput";
import TimeInput from "./TimeInput";
import FamilyHistoryContent from "../../../../familyhistory/FamilyHistoryContent";
import MedicalHistoryContent from "../../../../medicalhistory/MedicalHistoryContent";
import MedicationsContent from "../../../../medications/MedicationsContent";
import SurgicalHistoryContent from "../../../../surgicalhistory/SurgicalHistoryContent";
import HPIContext from "../../../../../contexts/HPIContext";

class QuestionAnswer extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = {
            response_array: [],
            startDate: new Date(),
            scale: 0,
            input: ""
        } 
        const values = this.context["hpi"]
        if (values[this.props.category_code][this.props.uid]["response"] === "") {
            values[this.props.category_code][this.props.uid]["response_type"] = this.props.responseType
            if (this.props.responseType === 'CLICK-BOXES' || this.props.responseType === 'MEDS-POP') {
                values[this.props.category_code][this.props.uid]["response"] = []
            }
            this.context.onContextChange("hpi", values)
        }
    } 

    onChange = date => this.setState({ date })

    render() {
        let button_map = []
        const {responseType} = this.props
        if (responseType === "YES-NO") {
            button_map.push(
                <YesNo
                    key={this.props.question} 
                    children={this.props.children} 
                    uid={this.props.uid}
                    category_code = {this.props.category_code}
                />
            )
        }
        else if (responseType === "SHORT-TEXT") {
            button_map.push(<HandleInput key={this.props.question} 
                                         type={this.props.responseType}
                                         answers={this.props.answers}
                                         uid={this.props.uid}
                                         category_code = {this.props.category_code}
                                          />)
        }
        else if (responseType === 'TIME') {
            button_map.push(<TimeInput key={this.props.question} 
                                       answers={this.props.answers}
                                       uid={this.props.uid}
                                       category_code = {this.props.category_code}
                                        />)
        }
        else if (responseType === 'LIST-TEXT') {
            button_map.push(<HandleInput key={this.props.question}
                                         type={this.props.responseType}
                                         answers={this.props.answers}
                                         uid={this.props.uid}
                                         category_code = {this.props.category_code}
                                          />
                                          )
        }

        else if (responseType === 'CLICK-BOXES'|| responseType === 'MEDS-POP') {
            button_map = this.props.response_choice.map(item =>
                <ButtonTag
                    key={item}
                    name={item} 
                    children={this.props.children}
                    answers={this.props.answers}
                    uid={this.props.uid}
                    category_code = {this.props.category_code}
                />
            )
        }
        else if (responseType === 'AGE') {
            button_map.push( <HandleNumericInput
                key={this.props.question}
                answers={this.props.answers} 
                max={120}
                uid={this.props.uid}
                category_code = {this.props.category_code}
            /> )}
        else if (responseType === "NUMBER") {
            button_map.push(<HandleNumericInput
                key={this.props.question}
                answers={this.props.answers} 
                max={10}
                uid={this.props.uid}
                category_code = {this.props.category_code}
            />)
        }
        else if (responseType === "FH-POP") {
            button_map.push(<FamilyHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
            />) 
        }
        else if (responseType === "PMH-POP") {
            button_map.push(<MedicalHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
            />)
        } 
        else if (responseType === "MEDS-BLANK") {
            button_map.push(<MedicationsContent
                key={this.props.question}
                response_choice={this.props.response_choice}
                answers={this.props.answers}
            />)
        }
        else if (responseType === "PSH-BLANK") {
            button_map.push(<SurgicalHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
                answers={this.props.answers}
            />)
        }
        if (this.props.accordion) {
            return (
                <div>
                <div style={{marginLeft: 135}}> {this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
                </div>
            )
        }
        return (
            <div style={{marginBottom: 20}}> 
                <div> {this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
                </div>
        )
    }
}
export default QuestionAnswer