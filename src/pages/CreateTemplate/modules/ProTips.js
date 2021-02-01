import React, { useState, useEffect } from 'react';
import { Popup, Button, Icon } from 'semantic-ui-react';
import { PROTIPS_BUTTON_BP } from 'constants/breakpoints';

import '../TemplateForm.css';

const ProTips = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateDimensions = () => {
            let width = typeof window !== 'undefined' ? window.innerWidth : 0;
            setWidth(width);
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const content = (
        <ul>
            <li>Only Yes/No questions can have follow-up questions.</li>
            <li>
                The advanced question types “Family History,” “Past Medical
                History,” “Medications,” and “Past Surgical History” will create
                questions that automatically synchronize data with the
                corresponding Patient History sections - so be sure to use these
                question types if you are asking about family history, a
                patient’s diagnoses, medications, or surgeries.
            </li>
            <li>
                You can change question order by drag-and-drop using the
                <Icon name='arrows alternate' /> icon.
            </li>
            <li>
                You can change the question hierarchy using drag-and-drop too.
            </li>
            <li>
                You can link up to existing questionnaires. For example, if you
                want to ask standard pain questions, you can link to the
                existing “Pain” questionnaire.
            </li>
            <li>
                <em>Sentence to Generate</em> is a required template for
                generating sentences based on the patient’s response to the
                question. The patient’s response will be inserted where it says
                ‘RESPONSE.’ Feel free to use gender-neutral ‘their’ which will
                be converted to his/her based on the patient’s preferred gender.
            </li>
        </ul>
    );
    return (
        <Popup
            id='protips-container'
            wide='very'
            on='click'
            position='top right'
            content={content}
            trigger={
                <Button
                    id='protips-btn'
                    circular
                    icon='lightbulb outline'
                    // value must explicitly be null to be an icon button
                    content={width > PROTIPS_BUTTON_BP ? 'Pro Tips' : null}
                />
            }
        />
    );
};

export default ProTips;
