import React from 'react'
import QuestionAnswer from "./QuestionAnswer";
import HPIContext from 'contexts/HPIContext.js';
import { useDispatch } from 'react-redux';

class DiseaseFormQuestions extends React.Component {
    static contextType = HPIContext

    // Can we change this so that it doesn't need to re-render each time the component is updated? 
    render() { 
        var values = this.context['hpi']
        var curr_node = values['nodes'][this.props.node]
        var question = curr_node['text']
        var response_type = curr_node['responseType']
        var uid = curr_node['uid']
        // var question = question_text 
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
        // Create buttons for users to click as their answer 
        if (response_type === "CLICK-BOXES" || response_type.slice(-3,response_type.length) === 'POP' || response_type === 'nan') {
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
        } else if (response_type === "YES-NO" || response_type==="NO-YES") {
            response_choice = ["Yes", "No"]
        } else response_choice = []
        return (
            <div style={{marginTop: 30}}>
                <QuestionAnswer
                    key={uid}
                    question={question}
                    responseType={response_type}
                    response_choice={response_choice}
                    node={this.props.node}
                />
            </div>
        )
    }
}

export default DiseaseFormQuestions