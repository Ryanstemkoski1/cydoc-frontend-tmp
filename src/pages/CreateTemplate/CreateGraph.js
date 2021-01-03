import React, { Component, Fragment } from 'react';
import NavMenu from "../../components/navigation/NavMenu";
import NewTemplateTitle from './NewTemplateTitle';
import './NewTemplate.css';

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