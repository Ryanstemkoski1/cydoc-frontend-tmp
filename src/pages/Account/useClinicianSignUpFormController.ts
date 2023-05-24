import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CognitoUser } from 'amazon-cognito-identity-js';
import setupUserAccount from 'auth/setupUserAccount';
import invariant from 'tiny-invariant';
import { ClinicianSignUpData, UserAttributes } from 'types/users';

const validationSchema = Yup.object<ClinicianSignUpData>({
    username: Yup.string()
        .label('userName')
        .required('Username is required')
        .min(1, 'Username is required'),
    firstName: Yup.string()
        .label('firstName')
        .required('First Name is required')
        .min(1, 'Username is required'),
    middleName: Yup.string()
        .label('middleName')
        .required('Middle Name is required')
        .min(1, 'middleName is required'),
    lastName: Yup.string()
        .label('lastName')
        .required('Last Name is required')
        .min(1, 'Last Name is required'),
    email: Yup.string()
        .label('email')
        .required('Email is required')
        .min(1, 'Email is required'),
});

export const useClinicianSignUpFormController = (
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
