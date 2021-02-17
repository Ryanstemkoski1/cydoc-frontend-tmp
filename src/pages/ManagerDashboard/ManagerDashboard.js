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
import managerCreateUser from 'auth/managerCreateUser';

// manager dashboard view to view/add/remove doctor accounts
const ManagerDashboard = () => {
    const [isInviteDoctorOpen, setIsInviteDoctorOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [duplicateUsername, setDuplicateUsername] = useState(false);

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

    const createDoctor = async () => {
        const createUserResponse = await managerCreateUser(username, email);
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
        setUserToRemove('');
        // TODO: call deleteUser API to remove user
    };

    // TODO: remove placeholder doctor info, get doctors via managerID from user database
    const doctors = [];
    for (let i = 0; i < 15; i++) {
        const isStudent = Math.random() * 2 > 1;
        const docUsername = `username${i}`;
        doctors.push({
            header: (
                <Card.Header
                    textAlign='left'
                    content='First Middle Last, DDD, DDD, DDD'
                />
            ),
            meta: (
                <Card.Meta
                    textAlign='left'
                    content='email@duke.edu, 123-456-7890'
                />
            ),
            description: (
                <Card.Description textAlign='left'>
                    <Card.Description>
                        <strong>Specialties: </strong>
                        Specialty 1, Specialty 2, Specialty 3
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Backup email: </strong>
                        backup@example.com
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Backup phone: </strong>
                        098-765-4321
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Institutions: </strong>
                        Institution 1, Institution 2, Institution 3
                    </Card.Description>
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Student? </strong>
                        {isStudent ? 'Yes' : 'No'}
                    </Card.Description>
                    {isStudent && (
                        <Card.Description
                            className={`extra-info ${docUsername}`}
                        >
                            <strong>Degrees in Progress: </strong>
                            DDD, DDD, DDD
                        </Card.Description>
                    )}
                    <Card.Description className={`extra-info ${docUsername}`}>
                        <strong>Birthday: </strong>
                        01/01/2021
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
                            onOpen={() => setUserToRemove(docUsername)}
                            open={userToRemove === docUsername}
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
                                Are you sure you want to remove First Middle
                                Last from Cydoc?
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
            key: `username${i}`,
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
