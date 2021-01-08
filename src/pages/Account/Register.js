import React, { Component, Fragment } from 'react';

import UserForm from './UserForm';
import { client } from "constants/api.js";
import "./Account.css";
import NavMenu from '../../components/navigation/NavMenu';

class Register extends React.Component {

    // gets passed into UserForm handle submit
    // creates a new user in the database
    handleSubmit = (user) => {
        return client.post("/user/new", user)
    }

    // empty initial values for UserForm
    // additional fields (e.g. title, pushTo) that are passed as props
    render() {
        return (
            <Fragment>
                <div className='nav-menu-container'>
                    <NavMenu />
                </div>
                <UserForm
                    username=""
                    password=""
                    passwordConfirm=""
                    email=""
                    phoneNumber=""
                    secondaryNumber=""
                    firstName=""
                    lastName=""
                    workplace=""
                    inPatient={null}
                    institutionType=""
                    address=""
                    backupEmail=""
                    role=""
                    studentStatus=""
                    degreesCompleted={["", "", ""]}
                    degreesInProgress={["", "", ""]}
                    specialties={["", "", ""]}
                    workplaceFeatures={[]}
                    title="sign up"
                    buttonText="Sign Up"
                    handleSubmit={this.handleSubmit}
                    show={true}
                    pushTo="/login"
                    disableRegister={true}
                />
            </Fragment>
        );
    }
}

export default Register;
