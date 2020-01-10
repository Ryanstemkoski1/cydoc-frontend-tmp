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

    handler(value, id, child) {
        return this.props.handler(value, id, this.props.category_code, this.props.uid, this.props.question,
            this.props.current_node, child, this.props.category, this.props.responseType)
    }

    render() {
        let question = this.props.question
        let response_choice = ''
        const {responseType} = this.props
        if (responseType === "CLICK-BOXES" || responseType.slice(-3,responseType.length) === 'POP') {
            let click = question.search("CLICK")
            if (click > 0) {
                response_choice = question.slice(click + 6, -1)
                question = question.slice(0, click)
            } else {
                let select = question.search('\\[')
                if (select > 0) {
                    response_choice = question.slice(select + 1, -1)
                    question = question.slice(0, select)
                }
            }
            response_choice = response_choice.split(",")
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
                    answers={this.props.responseDict[this.props.uid] !== undefined ?
                        this.props.responseDict[this.props.uid]['response'] : null }
                />
            </div>
        )
    }
}

export default DiseaseFormQuestions