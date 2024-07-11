'use client';

import React from 'react';
import EditTemplateForm from './EditTemplateForm';
import './TemplateForm.css';
import useSignInRequired from '@hooks/useSignInRequired';

// Component for editing the questions of a template
const EditTemplate = () => {
    useSignInRequired(); // this route is private, sign in required
    return <EditTemplateForm />;
};

export default EditTemplate;
