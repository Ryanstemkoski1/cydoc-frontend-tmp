import React, { useContext } from 'react';
import TemplateTitlePage from './TemplateTitlePage';
import HPITemplateContext from '../../contexts/HPITemplateContext';
import { getNewTemplate } from './util';
import { Link } from 'react-router-dom';

import { Input } from 'semantic-ui-react';

// Component for first step of creating new HPI template
const CreateGraph = () => {
    const { updateTemplate } = useContext(HPITemplateContext);

    const inputComponent = (props) => (
        <Input {...props} className='input-title' />
    );

    const onSubmit = (title) => {
        updateTemplate({
            ...getNewTemplate(),
            title,
        });
    };

    const redirectElement = (
        <span className='template-redirect'>
            Already have a template?{' '}
            <Link to='/templates/old'>Edit it here.</Link>
        </span>
    );

    return (
        <TemplateTitlePage
            header='New History of Present Illness Template'
            label='Enter a short title for your new template.'
            inputComponent={inputComponent}
            onSubmit={onSubmit}
            redirectElement={redirectElement}
        />
    );
};

export default CreateGraph;
