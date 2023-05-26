import React, { useEffect } from 'react';

import './Account.css';
import { Modal, Divider } from 'semantic-ui-react';
import { Grid } from '@mui/material';
import SignUpTextInput from './SignUpTextInput';
import { PasswordErrorMessages } from './PasswordErrorMessage';
import { useFormikContext } from 'formik';
import { SignUpFormData } from './SignUpForm';

export function UserInfoStep() {
    const { values, validateField } = useFormikContext<SignUpFormData>();
    const { email, phoneNumber } = values;

    // re-run matching validation on confirmEmail after email changes
    useEffect(() => {
        validateField('confirmEmail');
    }, [email, validateField]);

    // re-run matching validation on confirmPhoneNumber after phoneNumber changes
    useEffect(() => {
        validateField('confirmPhoneNumber');
    }, [phoneNumber, validateField]);

    // TODO: preserve logic
    // const handleConfirmPhoneNumber = (e, { value }) => {
    //     const formattedPhoneNumber = formatPhoneNumber(value);
    //     setConfirmPhoneNumber(formattedPhoneNumber);
    //     setPhoneNumberMatch(true);
    // };

    // function formatPhoneNumber(value) {
    //     // if input value is falsy eg if the user deletes the input, then just return
    //     if (!value) return value;
    //     // clean the input for any non-digit values.
    //     const phoneNumber = value.replace(/[^\d]/g, '');
    //     // phoneNumberLength is used to know when to apply our formatting for the phone number
    //     const phoneNumberLength = phoneNumber.length;
    //     // we need to return the value with no formatting if its less then four digits
    //     // this is to avoid weird behavior that occurs if you  format the area code to early
    //     if (phoneNumberLength < 4) return phoneNumber;
    //     // if phoneNumberLength is greater than 4 and less the 7 we start to return
    //     // the formatted number
    //     if (phoneNumberLength < 7) {
    //         return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
    //     }
    //     // finally, if the phoneNumberLength is greater then seven, we add the last
    //     // bit of formatting and return it.
    //     return (
    //         '(' +
    //         phoneNumber.slice(0, 3) +
    //         ') ' +
    //         phoneNumber.slice(3, 6) +
    //         '-' +
    //         phoneNumber.slice(6, 10)
    //     );
    // }

    return (
        <>
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Content>
                {/* <Form error={passwordErrorMessages().length > 0}> */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='First Name'
                            fieldName='firstName'
                            placeholder='Jane'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='Last Name'
                            fieldName='lastName'
                            placeholder='Doe'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SignUpTextInput
                            label='Username'
                            fieldName='username'
                            placeholder='username'
                            // height: min-content;
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='Email'
                            fieldName='email'
                            placeholder='name@example.com'
                            type='email'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='Confirm Email'
                            fieldName='confirmEmail'
                            placeholder='name@example.com'
                            type='email'
                        />
                    </Grid>

                    {/* // TODO: put in yup
                        {!emailsMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Emails do not match
                            </Container>
                        )} */}
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            fieldName='phoneNumber'
                            label='U.S. Phone Number'
                            placeholder='XXXXXXXXXX'
                            type='tel'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            fieldName='confirmPhoneNumber'
                            label='Confirm U.S. Phone Number'
                            placeholder='XXXXXXXXXX'
                            type='tel'
                        />
                    </Grid>

                    {/* // TODO: pull from yup
                        {!phoneNumberMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Phone Number do not match.
                            </Container>
                        )} */}
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='New password'
                            fieldName='newPassword'
                            type='password'
                            placeholder='new password'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SignUpTextInput
                            label='Confirm new password'
                            fieldName='confirmNewPassword'
                            type='password'
                            placeholder='confirm new password'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PasswordErrorMessages />
                    </Grid>

                    <Divider />
                </Grid>
            </Modal.Content>
        </>
    );
}
