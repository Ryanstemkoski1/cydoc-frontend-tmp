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
        // this.handler = this.handler.bind(this)
        // this.handlePop = this.handlePop.bind(this)
        const values = this.context["hpi"]
        values[this.props.category_code][this.props.uid]["response"] = (this.props.responseType === 'CLICK-BOXES' || this.props.responseType === 'MEDS-POP') ? [] : ""
        values[this.props.category_code][this.props.uid]["response_type"] = this.props.responseType
        this.context.onContextChange("hpi", values)
    }

    // handler(value, id, child) {
    //     return this.props.handler(value, id, child)
    // }

    onChange = date => this.setState({ date })

    render() {
        let button_map = []
        const {responseType} = this.props
        if (responseType === "YES-NO") {
            button_map.push(
                <YesNo
                    key={this.props.question}
                    // handler={this.handler}
                    children={this.props.children}
                    answers={this.props.answers}
                    uid={this.props.uid}
                    category_code = {this.props.category_code}
                />
            )
        }
        else if (responseType === "SHORT-TEXT") {
            button_map.push(<HandleInput key={this.props.question}
                                        //  handler={this.handler}
                                         type={this.props.responseType}
                                         answers={this.props.answers}
                                         uid={this.props.uid}
                                         category_code = {this.props.category_code}
                                          />)
        }
        else if (responseType === 'TIME') {
            button_map.push(<TimeInput key={this.props.question}
                                    //    handler={this.handler}
                                       answers={this.props.answers}
                                       uid={this.props.uid}
                                       category_code = {this.props.category_code}
                                        />)
        }
        else if (responseType === 'LIST-TEXT') {
            button_map.push(<HandleInput key={this.props.question}
                                        //  handler={this.handler}
                                         type={this.props.responseType}
                                         answers={this.props.answers}
                                         uid={this.props.uid}
                                         category_code = {this.props.category_code}
                                          />)
        }

        else if (responseType === 'CLICK-BOXES') {
            button_map = this.props.response_choice.map(item =>
                <ButtonTag
                    key={item}
                    name={item}
                    // handler={this.handler}
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
                // handler={this.handler}
                max={120}
                uid={this.props.uid}
                category_code = {this.props.category_code}
            /> )}
        else if (responseType === "NUMBER") {
            button_map.push(<HandleNumericInput
                key={this.props.question}
                answers={this.props.answers}
                // handler={this.handler}
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
            // test: able to edit context from this component
            // if (this.context["Family History"].hasOwnProperty('diabetes')) {
            //     this.context["Family History"]['diabetes']["Family Member"] = "Yes"
            //     console.log(this.context["Family History"]['diabetes'])
            // }
        }
        else if (responseType === "PMH-POP") {
            button_map.push(<MedicalHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
            />)
        }
        else if (responseType === "MEDS-POP") {
            button_map = this.props.response_choice.map(item =>
                <ButtonTag
                    key={item}
                    name={item}
                    answers={this.props.answers}
                />
            )
            button_map.push(<MedicationsContent
                key={this.props.question}
                response_choice={this.props.response_choice}
                answers={this.props.answers}
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
                {/* <svg style={{position: 'absolute'}}
                             width="153.9000380516052" height="200" pointerEvents="none"
                             position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml">
                    <path d="M 60 11 L 100 11 "
                          pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style={{}}
                          fill="none" stroke="#005583" strokeWidth="1"> </path>
                    <path pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml"
                          d="M100,11 L90.0950870803,7 L94.501886283,11 L89.9117721307,14
                            L100,11"
                          className="" stroke="#005583" fill="#005583"> </path>
                    <path
                        d="M 60 11"
                        pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style={{}}
                        fill="none" stroke="#005583" strokeWidth="1"> </path>
                        </svg> */}
                {/* <div style={{marginLeft: 123}}> */}
                <div> {this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
                </div>
        )
    }
}
export default QuestionAnswer