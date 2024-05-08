import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Header, Segment, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TemplateForm.css';

// Base component for template titles
const TemplateTitlePage = (props) => {
    const [title, setTitle] = useState('');
    const router = useRouter();
    const {
        label,
        header,
        inputComponent,
        errorMessage,
        redirectElement,
        ...otherProps
    } = props;

    const onChange = (_e, { value }) => setTitle(value);

    const editGraph = () => {
        otherProps.onSubmit(title);
        router.push('/templates/edit');
    };

    return (
        <>
            <Segment className='template-title container'>
                <Header
                    as='h2'
                    textAlign='center'
                    content={header}
                    className='template-header'
                />
                <Form className='center' onSubmit={editGraph}>
                    <label className='template-instructions'>{label}</label>
                    {inputComponent({
                        onChange,
                        value: title,
                        placeholder: 'Template title',
                    })}
                    <Button
                        basic
                        circular
                        icon='arrow right'
                        onClick={editGraph}
                        disabled={title === ''}
                        aria-label='submit'
                    />
                    {errorMessage !== '' && (
                        <p className='error'>{errorMessage}</p>
                    )}
                    {redirectElement}
                </Form>
            </Segment>
        </>
    );
};

TemplateTitlePage.propTypes = {
    label: PropTypes.string,
    header: PropTypes.string.isRequired,
    inputComponent: PropTypes.func.isRequired,
    redirectElement: PropTypes.element,
    onSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
};

export default TemplateTitlePage;
