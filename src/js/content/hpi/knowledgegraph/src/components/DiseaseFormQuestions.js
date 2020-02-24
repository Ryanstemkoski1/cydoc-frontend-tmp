import React from 'react'
import QuestionAnswer from "./QuestionAnswer";

class DiseaseFormQuestions extends React.Component {
    constructor() {
        super()
        this.state = {
            parent: ''
        } 
    } 

    render() {
        let question = this.props.question
        let symptom = question.search("SYMPTOM")
        if (symptom > -1) {
            question = question.substring(0,symptom) + this.props.category.toLowerCase() + question.substring(symptom+7)
        }
        let response_choice = ''
        const {responseType} = this.props
        if (responseType === "CLICK-BOXES" || responseType.slice(-3,responseType.length) === 'POP') {
            let click = question.search("CLICK")
            // if CLICK exists
            if (click > 0) {
                response_choice = question.slice(click + 6, -1)  // slice off the click options
                question = question.slice(0, click)     // slice off the question
            } else { // if it's a CLICK-BOX without CLICK indicated on the question
                let select = question.search('\\[')
                if (select > 0) {
                    response_choice = question.slice(select + 1, -1)
                    question = question.slice(0, select)
                }
            }
            response_choice = response_choice.split(",")
            for (let response_index in response_choice) {
                response_choice[response_index] = response_choice[response_index].trim()
            }
        } else if (responseType === "YES-NO") {
            response_choice = ["Yes", "No"]
        } else response_choice = []

        return (
            <div style={{marginTop: 30, marginLeft: this.props.accordion ? 23:0}}>
                <QuestionAnswer
                    question={question}
                    responseType={this.props.responseType}
                    response_choice={response_choice}
                    handler={this.handler}
                    notLast={this.props.notLast}
                    children={this.props.children}
                    accordion={this.props.accordion} 
                    category_code = {this.props.category_code}
                    uid = {this.props.uid}
                />
            </div>
        )
    }
}

export default DiseaseFormQuestions