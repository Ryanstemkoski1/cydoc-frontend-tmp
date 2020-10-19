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
import HPIContext from 'contexts/HPIContext.js';
import ListText from "./listText";
import { PATIENT_HISTORY_MOBILE_BP } from 'constants/breakpoints';

class QuestionAnswer extends React.Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context)
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            response_array: [],
            startDate: new Date(),
            scale: 0,
            input: ""
        } 
        const values = this.context["hpi"]
        // Initialize response values 
        // Specifies whether the response type will be '' or [] form 
        // TODO: Make more efficient and streamlined. 
        if (this.props.am_child) {
            if (values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] === "") {
                values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response_type'] = this.props.responseType 
                if (this.props.responseType === 'CLICK-BOXES' || this.props.responseType === 'MEDS-POP') {
                    values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = []
                }
                else if (this.props.responseType === 'TIME') values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = ["", ""]
                else if (this.props.responseType === 'LIST-TEXT') values[this.props.category_code][this.props.uid]['children'][this.props.child_uid]['response'] = {1: "", 2: "", 3: ""}
             } }
        else if (values[this.props.category_code][this.props.uid]["response"]=== "") {
            values[this.props.category_code][this.props.uid]["response_type"] = this.props.responseType
            if (this.props.responseType === 'CLICK-BOXES' || this.props.responseType === 'MEDS-POP') {
                values[this.props.category_code][this.props.uid]["response"] = []
            }
            else if (this.props.responseType === "TIME") values[this.props.category_code][this.props.uid]["response"] = ["", ""]
            else if (this.props.responseType === 'LIST-TEXT') values[this.props.category_code][this.props.uid]["response"] = {1: "", 2: "", 3: ""}
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.context.onContextChange("hpi", values);
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

    render() {
        const {responseType} = this.props;
        const { windowWidth } = this.state;

        const collapseTabs = windowWidth < PATIENT_HISTORY_MOBILE_BP;
        let button_map = [];
        if (responseType === "YES-NO" || responseType === "NO-YES") {
            button_map.push(
                <YesNo
                    key={this.props.question}
                    uid={this.props.uid}
                    category_code = {this.props.category_code}
                    has_children = {this.props.has_children}
                    am_child={this.props.am_child}
                    child_uid={this.props.child_uid}
                /> )}
        else if (responseType === "SHORT-TEXT" || responseType === "LONG-TEXT") {
            button_map.push(<HandleInput key={this.props.question} 
                                         type={this.props.responseType}
                                         answers={this.props.answers}
                                         uid={this.props.uid}
                                         category_code = {this.props.category_code}
                                         am_child={this.props.am_child}
                                         child_uid={this.props.child_uid}
                                          />)
        }
        else if (responseType === 'TIME') {
            button_map.push(<TimeInput key={this.props.question} 
                                       answers={this.props.answers}
                                       uid={this.props.uid}
                                       category_code = {this.props.category_code}
                                       am_child={this.props.am_child}
                                       child_uid={this.props.child_uid}
                                        />)
        }
        else if (responseType === 'LIST-TEXT') {
            button_map.push(<ListText
                key={this.props.uid}
                type={this.props.responseType} 
                uid={this.props.uid}
                category_code = {this.props.category_code}
                am_child={this.props.am_child}
                child_uid={this.props.child_uid}
                 />)
        }
        else if (responseType === 'CLICK-BOXES'|| responseType === 'MEDS-POP' || responseType === 'nan') {
            button_map = this.props.response_choice.map(item =>
                <ButtonTag
                    key={item}
                    name={item} 
                    answers={this.props.answers}
                    uid={this.props.uid}
                    category_code = {this.props.category_code}
                    am_child={this.props.am_child}
                    child_uid={this.props.child_uid}
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
                am_child={this.props.am_child}
                child_uid={this.props.child_uid}
            /> )}
        else if (responseType === "NUMBER") {
            button_map.push(<HandleNumericInput
                key={this.props.question}
                answers={this.props.answers} 
                max={10}
                uid={this.props.uid}
                category_code = {this.props.category_code}
                am_child={this.props.am_child}
                child_uid={this.props.child_uid}
            />)
        }
        else if (responseType === "FH-POP") {
            button_map.push(<FamilyHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
                fh_pop={true}
            />) 
        }
        else if (responseType === "PMH-POP") {
            button_map.push(<MedicalHistoryContent
                key={this.props.question}
                response_choice={this.props.response_choice}
                collapseTabs={collapseTabs}
            />)
        } 
        else if (responseType === "MEDS-BLANK") {
            button_map.push(<MedicationsContent
                key={this.props.question}
                pop={true}
                mobile={collapseTabs}
            />)
        }
        else if (responseType === "PSH-BLANK") {
            button_map.push(<SurgicalHistoryContent
                key={this.props.question}
                pop={true}
            />)
        } 
        // TODO: deprecate since it's the exact same as the last return
        if (this.props.accordion) {
            return (
                <div>{this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
            )
        }
        if (this.props.question === 'nan') { 
            return ( 
            <div> answer questions about {this.context["hpi"][this.props.category_code][this.props.uid]['children_category']} 
                <div style={{marginTop: 7}}>{button_map}</div> 
            </div> )
        }
        return (
            <div style={{marginBottom: 20}}> 
                <div> {this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
            </div>
        )
    }
}
export default QuestionAnswer