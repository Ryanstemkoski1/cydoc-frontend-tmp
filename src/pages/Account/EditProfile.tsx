import React, { useCallback, useEffect, useState } from 'react';
import { Segment, Container, Header, Modal, Button } from 'semantic-ui-react';
import UserForm from './UserForm';
import getUserAttributes from 'auth/getUserAttributes';
import updateUserAttributes from 'auth/updateUserAttributes';
import './Account.css';
import { doctorClient, managerClient } from 'constants/api';
import getUUID from 'auth/getUUID';
import getDoctorsOfManager from 'auth/getDoctorsOfManager';
import { isLivemode } from 'auth/livemode';
import useUser from 'hooks/useUser';
import useAuth from 'hooks/useAuth';
import { DbUser } from 'types/users';
import { stringFromError } from 'modules/error-utils';

const initializeFormFields = (role: DbUser['role'], email: string) => {
    if (role === 'clinician') {
        return {
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

const DeleteModal = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const { isManager } = useUser();
    const { signOut } = useAuth();

    const [loading, setLoading] = useState(false);

    const deleteDoctors = async () => {
        const doctors = await getDoctorsOfManager('manager');
        for (let i = 0; i < doctors.length; i++) {
            await doctorClient.delete('/doctors/' + doctors[i], {
                data: JSON.stringify({
                    stripeMode: isLivemode(),
                }),
            });
        }
    };

    const deleteSelf = useCallback(async () => {
        setLoading(true);
        const client = isManager ? managerClient : doctorClient;
        const path = isManager ? '/managers/' : '/doctors/';
        alert('not implemented');
        // const uuid = await getUUID(role);
        // try {
        //     await client.delete(path + uuid, {
        //         data: JSON.stringify({
        //             stripeMode: isLivemode(),
        //         }),
        //     });
        //     signOut();
        // } catch (err) {
        //     alert('Error deleting from database.');
        // }
        setLoading(false);
    }, [signOut, isManager]);

    const deleteSelfAndSub = useCallback(async () => {
        setLoading(true);
        try {
            await deleteDoctors();
            await deleteSelf();
        } catch (err) {
            alert('Error deleting from database.');
        }
        setLoading(false);
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
                    {isManager && (
                        <Button
                            basic
                            color='red'
                            content='Delete self and managed doctors'
                            type='button'
                            onClick={deleteSelfAndSub}
                            size={'small'}
                            loading={loading}
                            disabled={loading}
                            style={{ marginTop: '10px' }}
                        />
                    )}
                </div>
            </Modal.Content>
        </Modal>
    );
};

const EditProfile = () => {
    const { user } = useUser();
    const role = user?.role || 'clinician';

    const [callFinished, setCallFinished] = useState(false);
    const [userInfo, setUserInfo] = useState(
        initializeFormFields(role, user?.email || '')
    );
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

    // retrieve user attributes from Cognito and Dynamo when component is mounted
    useEffect(() => {
        const getAttributes = async () => {
            try {
                const getUserAttributesResponse = await getUserAttributes(role);
                // setUserInfo({
                //     ...userInfo,
                //     firstName: getUserAttributesResponse.firstName,
                //     middleName: getUserAttributesResponse.middleName,
                //     lastName: getUserAttributesResponse.lastName,
                //     email: getUserAttributesResponse.email,
                //     countryCode: '+1',
                //     phoneNumber: getUserAttributesResponse.phoneNumber.slice(2),
                //     birthday: getUserAttributesResponse.birthday,
                // });
            } catch (err) {
                alert(
                    `Error retrieving user information: ${stringFromError(err)}`
                );
                return;
            } finally {
                setCallFinished(true);
            }
        };
        getAttributes();
        // need to disable the warning below to prevent this function from continuously running
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // save user information in Cognito and Dynamo
    const handleSubmit = useCallback(
        async (userInfo: any) => {
            try {
                const phoneNumber = userInfo.countryCode + userInfo.phoneNumber;
                // update info in Cognito and in Dynamo
                await updateUserAttributes(role, {
                    ...userInfo,
                    phoneNumber,
                });
            } catch (err) {
                alert(
                    `Error updating user information: ${stringFromError(err)}`
                );
            }
        },
        [role]
    );

    return (
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
    );
};

export default EditProfile;
