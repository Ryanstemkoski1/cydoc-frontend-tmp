import React from 'react'
import QuestionAnswer from "./QuestionAnswer";

class DiseaseFormQuestions extends React.Component {

    render() {
        let question = this.props.question
        let symptom = question.search("SYMPTOM")
        let disease = question.search("DISEASE")
        // "SYMPTOM" and "DISEASE" should be replaced by the name of the current disease if it is part of the question text.
        if (symptom > -1) {
            question = question.substring(0,symptom) + this.props.category.toLowerCase() + question.substring(symptom+7)
        }
        if (disease > -1) {
            question = question.substring(0, disease) + this.props.category.toLowerCase() + question.substring(disease + 7)
        }
        let response_choice = ''
        const {responseType} = this.props
        // Create buttons for users to click as their answer 
        if (responseType === "CLICK-BOXES" || responseType.slice(-3,responseType.length) === 'POP' || responseType === 'nan') {
            let click = question.search("CLICK")
            let select = question.search('\\[')
            let end_select = question.search('\\]')
            // if CLICK exists
            if (click > 0) {
                response_choice = question.slice(click + 6, end_select)  // slice off the click options
                question = question.slice(0, click)     // slice off the question
            } else { // if it's a CLICK-BOX without CLICK indicated on the question
                if (select > 0) {
                    response_choice = question.slice(select + 1, end_select)
                    question = question.slice(0, select)
                }
            }
            response_choice = response_choice.split(",")
            for (let response_index in response_choice) {
                response_choice[response_index] = response_choice[response_index].trim()
            }
        } else if (responseType === "YES-NO" || responseType==="NO-YES") {
            response_choice = ["Yes", "No"]
        } else response_choice = []
        return (
            <div style={{marginTop: 30, marginLeft: this.props.am_child ? 23:0}}>
                <QuestionAnswer
                    question={question}
                    responseType={this.props.responseType}
                    response_choice={response_choice}
                    handler={this.handler}
                    has_children={this.props.has_children} 
                    category_code = {this.props.category_code}
                    uid = {this.props.uid}
                    child_uid = {this.props.child_uid}
                    am_child={this.props.am_child}
                />
            </div>
        )
    }
}

export default DiseaseFormQuestions