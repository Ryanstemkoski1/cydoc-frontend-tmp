import React from 'react';
import AuthContext from '../../contexts/AuthContext';
import UserForm from './UserForm';
import { client } from "constants/api.js";

class EditProfile extends React.Component {

    static contextType = AuthContext;

    // gets passed into UserForm handle submit
    // saves information in the database for an existing user
    handleSubmit = (user) => {
        return client.put(`/user/${this.context.user._id}`, user)
    }

    // initial values for UserForm given by existing user information
    // fields will be pre-filled so that user can make changes if need be 
    render() {
        const user = this.context.user;
        return (
            <UserForm
                username={user.username}
                password={user.password}
                passwordConfirm={user.passwordConfirm}
                email={user.email}
                phoneNumber={user.phoneNumber}
                firstName={user.firstName}
                lastName={user.lastName}
                workplace={user.workplace}
                inPatient={user.inPatient === undefined ? null : user.inPatient}
                institutionType={user.institutionType}
                address={user.address}
                backupEmail={user.backupEmail}
                role={user.role}
                studentStatus={user.studentStatus === undefined? "" : user.studentStatus}
                degreesCompleted={user.degreesCompleted === undefined ? ["", "", ""] : user.degreesCompleted}
                degreesInProgress={user.degreesInProgress === undefined ? ["", "", ""] : user.degreesInProgress}
                specialties={user.specialties === undefined ? ["", "", ""] : user.specialties}
                workplaceFeatures={user.workplaceFeatures === undefined ? [] : user.workplaceFeatures}
                title="edit profile"
                buttonText="Save"
                handleSubmit={this.handleSubmit}
                show={false}
                pushTo="/dashboard"
            />
        )
    }
}

export default EditProfile;