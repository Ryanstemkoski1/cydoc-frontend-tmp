import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Segment, Container, Header, Modal, Button } from 'semantic-ui-react';
import AuthContext from '../../contexts/AuthContext';
import UserForm from './UserForm';
import NavMenu from '../../components/navigation/NavMenu';
import getUserAttributes from 'auth/getUserAttributes';
import updateUserAttributes from 'auth/updateUserAttributes';
import './Account.css';
import { doctorClient, managerClient } from 'constants/api';
import getUUID from 'auth/getUUID';
import getDoctorsOfManager from 'auth/getDoctorsOfManager';
import { isLivemode } from 'auth/livemode';

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

const DeleteModal = ({ open, setOpen }) => {
    const context = useContext(AuthContext);
    const role = context.role;
    const [loading, setLoading] = useState(false);

    const deleteDoctors = async () => {
        try {
            const doctors = await getDoctorsOfManager('manager');
            for (let i = 0; i < doctors.length; i++) {
                await doctorClient.delete('/doctors/' + doctors[i].uuid, {
                    data: JSON.stringify({
                        stripeMode: isLivemode(),
                    }),
                });
            }
        } catch (err) {
            alert('Error deleting doctor from database.');
        }
    };

    const deleteSelf = useCallback(async () => {
        setLoading(true);
        const client = role === 'doctor' ? doctorClient : managerClient;
        const path = role === 'doctor' ? '/doctors/' : '/managers/';
        const uuid = await getUUID(role);
        try {
            await client.delete(path + uuid, {
                data: JSON.stringify({
                    stripeMode: isLivemode(),
                }),
            });
            context.logOut();
        } catch (err) {
            alert('Error deleting from database.');
        }
        setLoading(false);
    }, [context, role]);

    const deleteSelfAndSub = useCallback(async () => {
        setLoading(true);
        try {
            await deleteDoctors();
            await deleteSelf();
        } catch (err) {
            alert('Error deleting from database.');
        }
    }, [deleteSelf]);

    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={() => {
                setOpen(false);
            }}
            open={open}
            closeIcon={
                <div
                    style={{
                        float: 'right',
                        fontSize: '18px',
                        margin: '18px',
                        cursor: 'pointer',
                    }}
                >
                    X
                </div>
            }
        >
            <Modal.Header>Confirm Deletion</Modal.Header>
            <Modal.Content>
                <p>
                    Click below to permanently delete your account and cancel
                    any active subscriptions.
                </p>
                <div style={{ width: '50%' }}>
                    <Button
                        basic
                        color='red'
                        content='Confirm Deletion'
                        type='button'
                        onClick={deleteSelf}
                        size={'small'}
                        loading={loading}
                        disabled={loading}
                    />
                    {role === 'manager' && (
                        <Button
                            basic
                            color='red'
                            content='Delete self and managed doctors'
                            type='button'
                            onClick={deleteSelfAndSub}
                            size={'small'}
                            loading={loading}
                            disabled={loading}
                        />
                    )}
                </div>
            </Modal.Content>
        </Modal>
    );
};

const EditProfile = () => {
    const context = useContext(AuthContext);
    const user = context.user;
    const role = context.role;

    const [callFinished, setCallFinished] = useState(false);
    const [userInfo, setUserInfo] = useState(
        initializeFormFields(role, user.username, user.email)
    );
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

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
                <DeleteModal
                    open={confirmDeleteModalOpen}
                    setOpen={setConfirmDeleteModalOpen}
                />
                <Segment clearing raised>
                    <Header as='h2' textAlign='center' content='Edit Profile' />
                    <UserForm
                        userInfo={userInfo}
                        doneLoading={callFinished}
                        handleSubmit={handleSubmit}
                        buttonAriaLabel='Save-Profile-Info'
                        buttonText='Save'
                    />
                    {callFinished && (
                        <Button
                            basic
                            color='red'
                            content='Delete Account'
                            type='button'
                            onClick={() => {
                                setConfirmDeleteModalOpen(true);
                            }}
                        />
                    )}
                </Segment>
            </Container>
        </>
    );
};

export default EditProfile;
