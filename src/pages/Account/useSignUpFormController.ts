import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CognitoUser } from 'amazon-cognito-identity-js';
import setupUserAccount from 'auth/setupUserAccount';
import invariant from 'tiny-invariant';
import { ClinicianSignUpData, UserAttributes } from 'types/users';
import { passwordIsValid } from 'constants/passwordErrors';
import { SignUpFormData } from './SignUpForm';

const validationSchema = Yup.object<SignUpFormData>({
    isTermsChecked: Yup.bool()
        .label('isTermsChecked')
        .oneOf([true], 'You must agree to terms before continuing'),
    username: Yup.string()
        .label('userName')
        .required('Username is required')
        .min(1, 'Username is required'),
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
    const form = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: async (formUserData, actions) => {
            invariant(cognitoUser, 'missing logged in user');

            // async (newPassword, attributes) => {

            // setSessionUserAttributes(newUserAttr);
            // update account password and other attributes

            // TODO: fix double merging of users, it's happening here & in "SetupAccount"
            // it should only happen once
            // We should probably write a new creation function for new clinician type
            const setupAccountResponse = await setupUserAccount(
                cognitoUser,
                sessionUserAttributes,
                formUserData
            );
            // setSessionUserAttributes(attributes);
            if (setupAccountResponse) {
                // TODO: investigate: do we need to do this? Seems like the user attributes should be updated after page refresh...
                // update state after user has setup account
                // setIsFirstLogin(setupAccountResponse.isFirstLoginFlag);

                alert(
                    'Your account has been successfully set up. Please accept the following reload prompt and login to continue'
                );
                window.location.reload();
            }
        },
        validationSchema,
    });

    return { form };
};
