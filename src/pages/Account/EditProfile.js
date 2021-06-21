import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import AuthContext from '../../contexts/AuthContext';
import UserForm from './UserForm';
import NavMenu from '../../components/navigation/NavMenu';
import getUserAttributes from 'auth/getUserAttributes';
import updateUserAttributes from 'auth/updateUserAttributes';
import './Account.css';

const initializeFormFields = (role, username, email) => {
    if (role === 'doctor') {
        return {
            username,
            role,
            firstName: '',
            middleName: '',
            lastName: '',
            email,
            countryCode: '+1',
            phoneNumber: '',
            phoneNumberIsMobile: true,
            birthday: '',
            isStudent: '',
            degreesCompleted: ['', '', ''],
            degreesInProgress: ['', '', ''],
            specialties: ['', '', ''],
            workplace: '',
        };
    } else if (role === 'manager') {
        return {
            username,
            role,
            firstName: '',
            middleName: '',
            lastName: '',
            email,
            countryCode: '+1',
            phoneNumber: '',
            phoneNumberIsMobile: true,
            birthday: '',
            workplace: '',
        };
    }
};

const EditProfile = () => {
    const context = useContext(AuthContext);
    const user = context.user;
    const role = context.role;

    const [callFinished, setCallFinished] = useState(false);
    const [userInfo, setUserInfo] = useState(
        initializeFormFields(role, user.username, user.email)
    );

    // retrieve user attributes from Cognito and Dynamo when component is mounted
    useEffect(() => {
        const getAttributes = async (role) => {
            try {
                const getUserAttributesResponse = await getUserAttributes(role);
                setUserInfo({
                    ...userInfo,
                    username: getUserAttributesResponse.username,
                    firstName: getUserAttributesResponse.firstName,
                    middleName: getUserAttributesResponse.middleName,
                    lastName: getUserAttributesResponse.lastName,
                    email: getUserAttributesResponse.email,
                    countryCode: '+1',
                    phoneNumber: getUserAttributesResponse.phoneNumber.slice(2),
                    birthday: getUserAttributesResponse.birthday,
                });
            } catch (err) {
                alert(
                    `Error retrieving user information: ${
                        err.message || JSON.stringify(err)
                    }`
                );
                return;
            } finally {
                setCallFinished(true);
            }
        };
        getAttributes(role);
        // need to disable the warning below to prevent this function from continuously running
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // save user information in Cognito and Dynamo
    const handleSubmit = useCallback(
        async (userInfo) => {
            try {
                const phoneNumber = userInfo.countryCode + userInfo.phoneNumber;
                // update info in Cognito and in Dynamo
                await updateUserAttributes(role, {
                    ...userInfo,
                    phoneNumber,
                });
            } catch (err) {
                alert(
                    `Error updating user information: ${
                        err.message || JSON.stringify(err)
                    }`
                );
            }
        },
        [role]
    );

    return (
        <>
            <NavMenu />
            <Container className='sign-up'>
                <Segment clearing raised>
                    <Header as='h2' textAlign='center' content='Edit Profile' />
                    <UserForm
                        userInfo={userInfo}
                        doneLoading={callFinished}
                        handleSubmit={handleSubmit}
                        buttonAriaLabel='Save-Profile-Info'
                        buttonText='Save'
                    />
                </Segment>
            </Container>
        </>
    );
};

export default EditProfile;
