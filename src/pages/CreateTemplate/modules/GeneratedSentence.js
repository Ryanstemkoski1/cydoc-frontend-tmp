import React from 'react';
import { Input } from 'semantic-ui-react';
import '../TemplateForm.css';

const GeneratedSentence = ({
    answerInfo,
    placeholders,
    onChange,
    useNonanswer,
    label = 'Text to Generate',
    responseText = 'RESPONSE',
}) => {
    return (
        <>
            <label>{label}</label>
            <div className='blank-template'>
                <Input
                    answer='startResponse'
                    className='fill-in-the-blank-input'
                    value={answerInfo.startResponse}
                    placeholder={placeholders.startEg}
                    onChange={onChange}
                />
                <span className='answer-label'>{responseText}</span>
                <Input
                    answer='endResponse'
                    className='fill-in-the-blank-input'
                    value={answerInfo.endResponse}
                    placeholder={placeholders.endEg}
                    onChange={onChange}
                />
            </div>
            {useNonanswer && (
                <div className='blank-template'>
                    <Input
                        answer='negStartResponse'
                        className='fill-in-the-blank-input'
                        value={answerInfo.negStartResponse}
                        placeholder={placeholders.negStartEg}
                        onChange={onChange}
                    />
                    <span className='answer-label'>UNSELECTED</span>
                    <Input
                        answer='negEndResponse'
                        className='fill-in-the-blank-input'
                        value={answerInfo.negEndResponse}
                        placeholder={placeholders.negEndEg}
                        onChange={onChange}
                    />
                </div>
            )}
        </>
    );
};

export default GeneratedSentence;
