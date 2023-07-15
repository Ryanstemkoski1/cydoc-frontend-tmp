import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CognitoUser } from 'amazon-cognito-identity-js';
import invariant from 'tiny-invariant';
import { ClinicianSignUpData, UserAttributes } from 'types/users';
import { passwordIsValid } from 'constants/passwordErrors';
import { SignUpFormData } from './SignUpForm';
import { createDbUser } from 'modules/api';
import { useHistory } from 'react-router-dom';
import { breadcrumb, log } from 'modules/logging';
import { CreateUserResponse } from 'types/api';
import { createCognitoUser } from 'auth/cognito';

const validationSchema = Yup.object<SignUpFormData>({
    isTermsChecked: Yup.bool()
        .label('isTermsChecked')
        .oneOf([true], 'You must agree to terms before continuing'),
    firstName: Yup.string()
        .label('firstName')
        .required('First Name is required')
        .min(1, 'Username is required'),
    lastName: Yup.string()
        .label('lastName')
        .required('Last Name is required')
        .min(1, 'Last Name is required'),
    email: Yup.string()
        .label('email')
        .required('Email is required')
        .min(1, 'Email is required'),
    confirmEmail: Yup.string()
        .label('confirmEmail')
        .required('Please confirm your email')
        .min(1, 'Please confirm your email')
        .test({
            name: 'emails match',
            test: (value, context) => {
                const existingValue = context.parent as ClinicianSignUpData;
                invariant(existingValue, 'invalid yup email object shape');

                return existingValue?.email === value;
            },
            message: 'Emails must match',
            exclusive: false,
        }),
    phoneNumber: Yup.string()
        .label('phoneNumber')
        .required('Phone number is required')
        .min(9, 'Phone number is required'),
    confirmPhoneNumber: Yup.string()
        .label('confirmPhoneNumber')
        .required('Phone number is required')
        .min(9, 'Phone number is required')
        .test({
            name: 'phonenumber-match',
            test: (value, context) => {
                const existingValue = context.parent as ClinicianSignUpData;
                invariant(
                    existingValue,
                    'invalid yup phone number object shape'
                );

                return existingValue?.phoneNumber === value;
            },
            message: 'Phone numbers must match',
            exclusive: false,
        }),
    newPassword: Yup.string()
        .label('newPassword')
        .required('password is required')
        .min(1, 'password is required'),
    confirmNewPassword: Yup.string()
        .label('confirmNewPassword')
        .required('Please confirm new password')
        .min(1, 'Please confirm new password')
        .test({
            name: 'passwords-match',
            test: (value, context) => {
                const existingValue = context.parent as ClinicianSignUpData;
                invariant(existingValue, 'invalid yup password object shape');

                return existingValue?.newPassword === value;
            },
            message: 'Passwords must match',
            exclusive: false,
        })
        .test({
            name: 'confirm-new-password-requirements',
            test: (value) => passwordIsValid(value),
            message: 'Password must meet requirements',
            exclusive: false,
        }),
    institutionName: Yup.string()
        .label('institutionName')
        .required('Institution Name is required')
        .min(1, 'Institution Name is required'),
});

export const useSignUpFormController = (
    initialValues: ClinicianSignUpData,
    sessionUserAttributes: UserAttributes | null,
    cognitoUser: CognitoUser | null
) => {
    const history = useHistory();

    const form = useFormik({
        enableReinitialize: true,
        // validateOnChange: true,
        initialValues,
        onSubmit: async (formUserData, { setErrors, setSubmitting }) => {
            const navtoLogin = () => {
                setSubmitting(false);
                history.push('/Login');
            };
            const formattedPhoneNumber = formatPhoneNumber(
                formUserData.phoneNumber
            );
            formUserData.phoneNumber = formattedPhoneNumber;
            formUserData.confirmPhoneNumber = formattedPhoneNumber;
            breadcrumb(`submitting new user`, 'sign up', formUserData);

            try {
                const cognitoUser = await createCognitoUser(
                    formUserData,
                    navtoLogin
                );

                // only proceed if cognito user was created successfully
                const result =
                    cognitoUser && (await createDbUser(formUserData));

                if (result?.errorMessage?.length) {
                    // Expected error, display to GUI
                    setErrors({ signUpError: result.errorMessage });
                } else if (result && (result as CreateUserResponse)?.user?.id) {
                    // User created successfully, now login
                    navtoLogin();
                } else {
                    // Unexpected error occurred
                    breadcrumb(`Invalid user creation response`, 'sign up', {
                        result,
                        formUserData,
                    });
                    throw new Error(`Invalid user creation response`);
                }
            } catch (e) {
                log(`Invalid user creation response`, {
                    formUserData,
                });
                setErrors({
                    signUpError:
                        'Error occurred and has been logged to our support team. Check your internet connection, retry or speak to an administrator.',
                });
            } finally {
                setSubmitting(false);
            }
            // user info or password update (existing, authed user)
            // TODO: enable account creation with cognito user!
            // TODO: test flow with first time users created by other admins in portal
        },
        validationSchema,
    });

    return { form };
};

const formatPhoneNumber = (phoneNumber: string): string =>
    phoneNumber
        .replace('(', '+1')
        .replace(/-|\(|\)/gi, '')
        .replace(' ', '');
