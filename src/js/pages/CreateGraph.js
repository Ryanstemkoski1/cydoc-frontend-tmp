import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import NewTemplateTitle from '../components/NewTemplateTitle';
import '../../css/components/navMenu.css';
import '../../css/components/newTemplate.css';

export default class CreateGraph extends Component {
    render() {
        return (
            <Fragment>
                <div className='nav-menu-container'>
                    <NavMenu />
                </div>
                <div className='new-template-form-container'>
                    <NewTemplateTitle />
                </div>
            </Fragment>
        );
    }
}