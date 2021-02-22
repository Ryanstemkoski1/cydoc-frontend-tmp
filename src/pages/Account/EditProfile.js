import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import AuthContext from '../../contexts/AuthContext';
import UserForm from './UserForm';
import NavMenu from '../../components/navigation/NavMenu';
import getUserAttributes from 'auth/getUserAttributes';
import updateUserAttributes from 'auth/updateUserAttributes';
import './Account.css';

const EditProfile = () => {
    const context = useContext(AuthContext);
    const user = context.user;
    const role = context.role;

    const [callFinished, setCallFinished] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: user.username,
        role,
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        countryCode: '+1',
        phoneNumber: '',
        isPhoneNumberMobile: true,
        dob: '',
        address: '',
        studentStatus: '',
        degreesCompleted: ['', '', ''],
        degreesInProgress: ['', '', ''],
        specialties: ['', '', ''],
        workplace: '',
        workplaceFeatures: [],
    });

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
                const fullPhoneNumber =
                    userInfo.countryCode + userInfo.phoneNumber;
                // update info in Cognito and in Dynamo
                await updateUserAttributes(role, {
                    ...userInfo,
                    fullPhoneNumber,
                });

                alert('Profile information successfully updated');
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
