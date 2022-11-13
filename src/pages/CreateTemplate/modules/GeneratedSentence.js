import React from 'react';
import { Input } from 'semantic-ui-react';
import '../TemplateForm.css';

const GeneratedSentence = ({ answerInfo, placeholders, onChange }) => {
    return (
        <>
            <label>Sentence to Generate</label>
            <Input
                answer='startResponse'
                className='fill-in-the-blank-input'
                value={answerInfo.startResponse}
                placeholder={placeholders.startEg}
                onChange={onChange}
            />
            <span className='answer-label'>RESPONSE</span>
            <Input
                answer='endResponse'
                className='fill-in-the-blank-input'
                value={answerInfo.endResponse}
                placeholder={placeholders.endEg}
                onChange={onChange}
            />
        </>
    );
};

export default GeneratedSentence;
