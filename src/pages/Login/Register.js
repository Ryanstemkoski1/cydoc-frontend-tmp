import React from 'react';
import UserForm from './UserForm';
import { client } from "constants/api.js";

class Register extends React.Component {

    handleSubmit = (user) => {
        return client.post("/user/new", user)
    }

    render() {
        return (
            <UserForm
                username=""
                password=""
                passwordConfirm=""
                email=""
                phoneNumber=""
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
            />
        );
    }
}

export default Register;