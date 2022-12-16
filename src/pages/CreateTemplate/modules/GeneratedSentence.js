import React from 'react';
import { Input } from 'semantic-ui-react';
import '../TemplateForm.css';

const GeneratedSentence = ({
    answerInfo,
    placeholders,
    onChange,
    useNonanswer,
    label = 'Sentence to Generate',
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
                    placeholder={
                        useNonanswer
                            ? placeholders.negStartEg
                            : placeholders.endEg
                    }
                    onChange={onChange}
                />
                {useNonanswer && (
                    <>
                        <span className='answer-label'>UNSELECTED</span>
                        <Input
                            answer='endResponse'
                            className='fill-in-the-blank-input'
                            value={answerInfo.endResponse}
                            placeholder={placeholders.negEndEg}
                            onChange={onChange}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default GeneratedSentence;
