import React from 'react'
import QuestionAnswer from "./QuestionAnswer";

class DiseaseFormQuestions extends React.Component {
    constructor() {
        super()
        this.state = {
            parent: ''
        }
        this.handler = this.handler.bind(this)
    }

    handler(value, id) {
        return this.props.handler(value, id, this.props.category, this.props.uid, this.props.question)
    }

    render() {
        let question = this.props.question
        let response = ''
        if (this.props.responseType === "CLICK-BOXES") {
            let click = question.search("CLICK")
            if (click > 0) {
                response = question.slice(click + 6, -1)
                question = question.slice(0, click)
            } else {
                let select = question.search('\\[')
                if (select > 0) {
                    response = question.slice(select + 1, -1)
                    question = question.slice(0, select)
                }
            }
            response = response.split(",")
        } else if (this.props.responseType === "YES-NO") {
            response = ["Yes", "No"]
        } else response = []


        return (
            <div style={{marginTop: 30}}>
                <QuestionAnswer
                    question={question}
                    responseType={this.props.responseType}
                    response={response}
                    handler={this.handler}
                    notLast={this.props.notLast}
                />
            </div>
        )
    }
}

export default DiseaseFormQuestions