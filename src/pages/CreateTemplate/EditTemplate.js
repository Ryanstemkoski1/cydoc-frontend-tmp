import React, { Component } from 'react';
import NavMenu from '../../components/navigation/NavMenu';
import EditTemplateForm from './EditTemplateForm';
import './TemplateForm.css';

// Component for editing the questions of a template
export default class EditTemplate extends Component {
    render() {
        return (
            <>
                <div className='nav-menu-container'>
                    <NavMenu />
                </div>
                <EditTemplateForm />
            </>
        );
    }
}
