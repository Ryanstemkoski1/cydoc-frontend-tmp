import React, { Component, Fragment } from 'react';
import NavMenu from '../../components/navigation/NavMenu';
import NewTemplateForm from './NewTemplateForm';
import './NewTemplate.css';

export default class EditGraph extends Component {
    render() {
        return (
            <Fragment>
                <div className='nav-menu-container'>
                    <NavMenu />
                </div>
                <div className='new-template-form-container'>
                    <NewTemplateForm />
                </div>
            </Fragment>
        );
    }
}
