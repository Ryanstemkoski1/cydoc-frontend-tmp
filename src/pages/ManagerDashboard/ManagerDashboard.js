import React, { useState } from 'react';
import {
    Button,
    Card,
    Container,
    Form,
    Header,
    Modal,
    Segment,
} from 'semantic-ui-react';
import NavMenu from 'components/navigation/NavMenu';
import './ManagerDashboard.css';
import managerDeleteUser from 'auth/managerDeleteUser';
import managerCreateUser from 'auth/managerCreateUser';
import getDoctorsOfManager from 'auth/getDoctorsOfManager';
import { doctorClient } from 'constants/api.js';

// manager dashboard view to view/add/remove doctor accounts
const ManagerDashboard = () => {
    const [isInviteDoctorOpen, setIsInviteDoctorOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [duplicateUsername, setDuplicateUsername] = useState(false);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);

    const switchFullUserInfoView = (username, view) => {
        const show = view === 'show';
        const extraInfo = document.querySelectorAll(`.${username}`);
        extraInfo.forEach((item) => {
            item.style.display = show ? 'block' : 'none';
        });
        const viewMoreButton = document.querySelector(`.${username}-view-more`);
        const viewLessButton = document.querySelector(`.${username}-view-less`);
        const removeButton = document.querySelector(`.${username}-remove`);
        viewMoreButton.style.display = show ? 'none' : 'inline-block';
        viewLessButton.style.display = show ? 'inline-block' : 'none';
        removeButton.style.display = show ? 'inline-block' : 'none';
    };

    const handleUsernameChange = (e, { value }) => {
        setUsername(value);
        setDuplicateUsername(false);
    };

    const handleEmailChange = (e, { value }) => {
        setEmail(value);
    };

    const handleFirstNameChange = (e, { value }) => {
        setFirstName(value);
    };

    const handleLastNameChange = (e, { value }) => {
        setLastName(value);
    };

    const createDoctor = async () => {
        const createUserResponse = await managerCreateUser(
            username,
            email,
            firstName,
            lastName
        );
        if (
            createUserResponse?.status === 'ERROR' &&
            createUserResponse?.message.includes('User account already exists')
        ) {
            setDuplicateUsername(true);
        } else {
            setIsInviteDoctorOpen(false);
        }
    };

    const removeDoctor = () => {
        const deleteUsername = userToRemove[0];
        const deleteUUID = userToRemove[1];
        setUserToRemove('');
        managerDeleteUser(deleteUsername, deleteUUID);
    };

    const getDoctors = async () => {
        // TODO: don't hardcode 'manager' as input of getDoctorsOfManager -- find way to get actual role of current user
        const docs = await getDoctorsOfManager('manager');
        const docInfo = [];
        for (let i = 0; i < docs.length; i++) {
            // currDoctor is current doctor UUID
            let currDoctor = docs[i];
            await doctorClient
                .get(`doctors/${currDoctor}`)
                .then((response) => {
                    let doctor = response.data.Item;
                    docInfo.push(doctor);
                })
                .catch((err) => {
                    alert(
                        `Error retrieving doctor: ${
                            err.message || JSON.stringify(err)
                        }`
                    );
                });
        }
        setDisplayedDoctors(docInfo);
    };

    const doctors = [];
    getDoctors();
    for (let i = 0; i < displayedDoctors.length; i++) {
        let currentDoctor = displayedDoctors[i];
        if (currentDoctor == undefined) {
            break;
        }
        const uuid = currentDoctor.doctorUUID;
        const isStudent = currentDoctor.isStudent;
        const docUsername = currentDoctor.username;
        const docEmail = currentDoctor.email;
        const docFirstName = currentDoctor.firstName;
        const docMiddleName =
            currentDoctor.middleName == undefined
                ? ''
                : currentDoctor.middleName;
        const docLastName = currentDoctor.lastName;
        const docPhoneNumber =
            currentDoctor.phoneNumber == undefined
                ? ''
                : currentDoctor.phoneNumber;
        const docBirthday =
            currentDoctor.birthday == undefined ? '' : currentDoctor.birthday;
        // source: https://www.w3docs.com/snippets/javascript/how-to-remove-empty-elements-from-an-array-in-javascript.html
        const docSpecialties =
            currentDoctor.specialties == undefined
                ? []
                : currentDoctor.specialties.filter(Boolean);
        const docDegreesInProgress =
            currentDoctor.degreesInProgress == undefined
                ? []
                : currentDoctor.degreesInProgress.filter(Boolean);
        doctors.push({
            header: (
                <Card.Header
                    textAlign='left'
                    content={`${docFirstName} ${docMiddleName} ${docLastName}`}
                />
            ),
            meta: (
                <Card.Meta
                    textAlign='left'
                    content={`${docEmail}, ${docPhoneNumber}`}
                />
            ),
            description: (
                <Card.Description textAlign='left'>
                    <Card.Description>
                        <strong>Specialties: </strong>
                        {docSpecialties.join()}
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Institutions: </strong>
                        Institution 1, Institution 2, Institution 3
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Student? </strong>
                        {isStudent}
                    </Card.Description>
                    {isStudent === 'Yes' && (
                        <Card.Description
                            className={`extra-info ${docUsername}`}
                        >
                            <strong>Degrees in Progress: </strong>
                            {docDegreesInProgress.join()}
                        </Card.Description>
                    )}
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Birthday: </strong>
                        {docBirthday}
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Username: </strong>
                        {docUsername}
                    </Card.Description>
                    <Card.Description
                        className={`extra-info ${docUsername}`}
                        textAlign='center'
                    >
                        <Modal
                            dimmer='inverted'
                            size='small'
                            onClose={() => setUserToRemove('')}
                            onOpen={() => setUserToRemove([docUsername, uuid])}
                            open={userToRemove[0] === docUsername}
                            trigger={
                                <Button
                                    color='red'
                                    icon='times'
                                    content='Remove account'
                                    size='tiny'
                                    className={`${docUsername}-remove remove`}
                                />
                            }
                        >
                            <Modal.Header>Are you sure?</Modal.Header>
                            <Modal.Content>
                                Are you sure you want to remove {docFirstName}{' '}
                                {docMiddleName} {docLastName} from Cydoc?
                            </Modal.Content>
                            <Modal.Actions>
                                <Button
                                    basic
                                    color='teal'
                                    content='Cancel'
                                    type='button'
                                    onClick={() => setUserToRemove('')}
                                />
                                <Button
                                    color='red'
                                    content='Remove account'
                                    type='button'
                                    onClick={removeDoctor}
                                />
                            </Modal.Actions>
                        </Modal>
                    </Card.Description>
                </Card.Description>
            ),
            extra: (
                <>
                    <Button
                        basic
                        color='teal'
                        icon='plus'
                        content='View more'
                        size='small'
                        type='button'
                        className={`${docUsername}-view-more`}
                        onClick={() =>
                            switchFullUserInfoView(docUsername, 'show')
                        }
                    />
                    <Button
                        basic
                        color='teal'
                        icon='minus'
                        content='View less'
                        size='small'
                        type='button'
                        className={`${docUsername}-view-less view-less`}
                        onClick={() =>
                            switchFullUserInfoView(docUsername, 'hide')
                        }
                    />
                </>
            ),
            key: docUsername,
        });
    }

    return (
        <>
            <NavMenu />
            <Container className='manager-dashboard-container'>
                <Segment textAlign='center'>
                    <Header as='h1' content='Doctors' />
                    <Modal
                        dimmer='inverted'
                        size='small'
                        onClose={() => setIsInviteDoctorOpen(false)}
                        onOpen={() => setIsInviteDoctorOpen(true)}
                        open={isInviteDoctorOpen}
                        trigger={
                            <Button
                                icon='plus'
                                content='Invite a doctor'
                                size='small'
                            />
                        }
                    >
                        <Modal.Header>Invite a doctor to Cydoc</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={createDoctor}>
                                <Form.Input
                                    required
                                    label='Doctor username'
                                    name='username'
                                    placeholder='username'
                                    value={username}
                                    className='username-input-container'
                                    error={
                                        duplicateUsername &&
                                        'Username already exists'
                                    }
                                    onChange={handleUsernameChange}
                                />
                                <Form.Input
                                    required
                                    label='First Name'
                                    name='firstName'
                                    placeholder='Jane'
                                    type='firstName'
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                />
                                <Form.Input
                                    required
                                    label='Last Name'
                                    name='lastName'
                                    placeholder='Doe'
                                    type='lastName'
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                />
                                <Form.Input
                                    required
                                    label='Doctor email'
                                    name='email'
                                    placeholder='name@example.com'
                                    type='email'
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <Container className='modal-button-container'>
                                    <Button
                                        basic
                                        color='teal'
                                        content='Cancel'
                                        type='button'
                                        onClick={() =>
                                            setIsInviteDoctorOpen(false)
                                        }
                                    />
                                    <Button
                                        color='teal'
                                        content='Send invitation'
                                        type='submit'
                                    />
                                </Container>
                            </Form>
                        </Modal.Content>
                    </Modal>
                    <Card.Group
                        centered
                        items={doctors}
                        className='doctor-cards'
                    />
                </Segment>
            </Container>
        </>
    );
};

export default ManagerDashboard;
