import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import NewTemplateForm from '../components/NewTemplateForm';
import '../../css/components/navMenu.css';
import '../../css/components/newTemplate.css';

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