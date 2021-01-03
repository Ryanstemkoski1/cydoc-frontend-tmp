import React from 'react';
import QuestionAnswer from './QuestionAnswer';
import HPIContext from 'contexts/HPIContext.js';
import diseaseCodes from '../../../../../../../constants/diseaseCodes';

class DiseaseFormQuestions extends React.Component {
    static contextType = HPIContext;

    // Can we change this so that it doesn't need to re-render each time the component is updated?
    render() {
        let values = this.context['hpi'];
        let currNode = values['nodes'][this.props.node];
        let question = currNode['text'];
        let responseType = currNode['responseType'];
        let uid = currNode['uid'];
        let symptom = question.search('SYMPTOM');
        let disease = question.search('DISEASE');
        let diseaseName = Object.keys(diseaseCodes).find(
            (key) => diseaseCodes[key] === this.props.category
        );
        // "SYMPTOM" and "DISEASE" should be replaced by the name of the current disease if it is part of the question text.
        if (symptom > -1) {
            question =
                question.substring(0, symptom) +
                diseaseName.toLowerCase() +
                question.substring(symptom + 7);
        }
        if (disease > -1) {
            question =
                question.substring(0, disease) +
                diseaseName.toLowerCase() +
                question.substring(disease + 7);
        }
        let responseChoice = '';
        // Create buttons for users to click as their answer
        if (
            responseType === 'CLICK-BOXES' ||
            responseType.slice(-3, responseType.length) === 'POP' ||
            responseType === 'nan'
        ) {
            let click = question.search('CLICK');
            let select = question.search('\\[');
            let endSelect = question.search('\\]');
            // if CLICK exists
            if (click > 0) {
                responseChoice = question.slice(click + 6, endSelect); // slice off the click options
                question = question.slice(0, click); // slice off the question
            } else {
                // if it's a CLICK-BOX without CLICK indicated on the question
                if (select > 0) {
                    responseChoice = question.slice(select + 1, endSelect);
                    question = question.slice(0, select);
                }
            }
            responseChoice = responseChoice.split(',');
            for (let responseIndex in responseChoice) {
                responseChoice[responseIndex] = responseChoice[
                    responseIndex
                ].trim();
            }
        } else if (responseType === 'YES-NO' || responseType === 'NO-YES') {
            responseChoice = ['Yes', 'No'];
        } else responseChoice = [];
        return (
            <div style={{ marginTop: 30 }}>
                <QuestionAnswer
                    key={uid}
                    question={question}
                    responseType={responseType}
                    responseChoice={responseChoice}
                    node={this.props.node}
                />
            </div>
        );
    }
}

export default DiseaseFormQuestions;
