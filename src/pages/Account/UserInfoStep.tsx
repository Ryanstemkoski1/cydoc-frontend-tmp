import React from 'react';

import './Account.css';
import { Button, Container, Form, Modal, Divider } from 'semantic-ui-react';
import { useField, Field } from 'formik';
import { Box, TextField } from '@mui/material';
import { StepProps } from './SignUpSteps';

export function UserInfoStep({
    closeModal,
    goToPrevStep,
    goToNextStep,
}: StepProps) {
    return (
        <>
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Content>
                <Form>
                    {/* <Form error={passwordErrorMessages().length > 0}> */}
                    <Box>
                        <Form.Group widths='equal'>
                            <Form.Input
                                required
                                label='First Name'
                                name='firstName'
                                placeholder='Jane'
                                type='input'
                            />
                            <Form.Input
                                required
                                label='Last Name'
                                name='lastName'
                                placeholder='Doe'
                                type='input'
                            />
                        </Form.Group>
                        <Form.Input
                            required
                            label='Username'
                            name='username'
                            placeholder='username'
                            type='input'
                            // TODO: check for dupes in yup
                            // error={
                            //     duplicateUsername && 'Username already exists'
                            // }
                            className='username-input-container'
                        />
                        <Form.Group widths='equal'>
                            <Form.Input
                                required
                                label='Email'
                                name='email'
                                placeholder='name@example.com'
                                type='email'
                                // width={6}
                            />
                            <Form.Input
                                required
                                label='Confirm Email'
                                name='confirmEmail'
                                placeholder='name@example.com'
                                type='email'
                                // TODO: put in yup
                                // error={!emailsMatch}
                                // width={6}
                            />
                        </Form.Group>
                        {/* // TODO: put in yup
                        {!emailsMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Emails do not match
                            </Container>
                        )} */}
                        <Form.Group widths='equal'>
                            <Form.Input
                                name='phoneNumber'
                                label='U.S. Phone Number'
                                placeholder='XXXXXXXXXX'
                                type='tel'
                                required
                                // TODO: put in yup
                                // onChange={handlePhoneNumber}
                            />
                            <Form.Input
                                name='confirmPhoneNumber'
                                label='Confirm U.S. Phone Number'
                                placeholder='XXXXXXXXXX'
                                type='tel'
                                required
                                // TODO: put in yup
                                // onChange={handleConfirmPhoneNumber}
                            />
                        </Form.Group>
                        {/* // TODO: pull from yup
                        {!phoneNumberMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Phone Number do not match.
                            </Container>
                        )} */}
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='New password'
                                name='newPassword'
                                type='password'
                                variant='outlined'
                                aria-label='New-Password'
                                placeholder='new password'
                                autoComplete='new-password'
                                // TODO: put in yup
                                // onChange={handleNewPasswordChange}
                                required
                            />
                            <Form.Input
                                label='Confirm new password'
                                name='confirmNewPassword'
                                type='password'
                                variant='outlined'
                                aria-label='New-Password'
                                placeholder='confirm new password'
                                autoComplete='new-password'
                                required
                                // TODO: put in yup
                                // error={!passwordsMatch}
                                // onChange={handleNewPasswordChange}
                            />
                        </Form.Group>
                        {/* // TODO: pull from yup
                        {!passwordsMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Passwords do not match.
                            </Container>
                        )}
                        {showPasswordErrors &&
                            passwordErrorMessages().length > 0 && (
                                <Message
                                    error
                                    header='Password must satisfy the following requirements:'
                                    list={passwordErrorMessages()}
                                />
                            )}
                            */}
                        <Divider />
                    </Box>
                    {/* <Container className='modal-button-container'>
                        <Button
                            basic
                            color='teal'
                            content='Cancel'
                            type='button'
                            onClick={closeModal}
                        />
                        <Button
                            color='teal'
                            content='Prev'
                            type='button'
                            onClick={goToPrevStep}
                        />
                        <Button
                            color='teal'
                            content='Next'
                            onClick={goToNextStep}
                        />
                    </Container> */}
                </Form>
            </Modal.Content>
        </>
    );
}
