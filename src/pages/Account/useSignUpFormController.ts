import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CognitoUser } from 'amazon-cognito-identity-js';
import invariant from 'tiny-invariant';
import { ClinicianSignUpData, UserAttributes } from 'types/users';
import { passwordIsValid } from 'constants/passwordErrors';
import { SignUpFormData } from './SignUpForm';
import { createUser } from 'modules/api';

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
    paymentMethod: Yup.object().label('paymentMethod'),
});

export const useSignUpFormController = (
    initialValues: ClinicianSignUpData,
    sessionUserAttributes: UserAttributes | null,
    cognitoUser: CognitoUser | null
) => {
    const form = useFormik({
        enableReinitialize: true,
        // validateOnChange: true,
        initialValues,
        onSubmit: async (formUserData, actions) => {
            console.log(`submitting new user`, formUserData);

            // user creation
            const result = await createUser(formUserData);
            // user info or password update (existing, authed user)
            // TODO: enable account creation with cognito user!
            // TODO: test flow with first time users created by other admins in portal
        },
        validationSchema,
    });

    return { form };
};
