import React from 'react';
import QuestionAnswer from './QuestionAnswer';
import { DoctorView, HpiStateProps, ResponseTypes } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import { HpiState } from 'redux/reducers/hpiReducer';
import { YesNoResponse } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

interface DiseaseFormQuestionsProps {
    node: string;
    category: DoctorView;
}

class DiseaseFormQuestions extends React.Component<Props> {
    // Can we change this so that it doesn't need to re-render each time the component is updated?
    render() {
        const { node, category } = this.props;
        const values: HpiState = this.props.hpi;
        const currNode = values.nodes[node];
        const { text, responseType } = currNode;
        let question = text;
        const uid = currNode.uid;
        // 'SYMPTOM' and 'DISEASE' should be replaced by the name of the current disease if it is part of the question text.
        question = question.replace('SYMPTOM', category.toLowerCase());
        question = question.replace('DISEASE', category.toLowerCase());
        let responseChoice: string[];
        let sliceClick = '';
        // Create buttons for users to click as their answer
        if (
            [
                ResponseTypes.CLICK_BOXES,
                ResponseTypes.MEDS_POP,
                ResponseTypes.FH_POP,
                ResponseTypes.PMH_POP,
                ResponseTypes.PSH_POP,
            ].includes(responseType)
        ) {
            const click = question.search('CLICK');
            const select = question.search('\\[');
            const endSelect = question.search('\\]');
            // if CLICK exists
            if (click > 0) {
                sliceClick = question.slice(click + 6, endSelect); // slice off the click options
                question = question.slice(0, click); // slice off the question
            } else if (select > 0) {
                // if it's a CLICK-BOX without CLICK indicated on the question
                sliceClick = question.slice(select + 1, endSelect);
                question = question.slice(0, select);
            }
            responseChoice = sliceClick.split(',');
            for (const responseIndex in responseChoice) {
                responseChoice[responseIndex] = responseChoice[
                    responseIndex
                ].trim();
            }
        } else if (
            responseType === ResponseTypes.YES_NO ||
            responseType === ResponseTypes.NO_YES
        ) {
            responseChoice = [YesNoResponse.Yes, YesNoResponse.No];
        } else responseChoice = [];
        return (
            <div style={{ marginTop: 30 }}>
                <QuestionAnswer
                    key={uid}
                    question={question}
                    responseType={responseType}
                    responseChoice={responseChoice}
                    node={node}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DiseaseFormQuestionsProps;

export default connect(mapStateToProps)(DiseaseFormQuestions);
