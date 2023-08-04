import { useFormik } from 'formik';
import * as Yup from 'yup';
import invariant from 'tiny-invariant';
import { SignUpFormData } from './SignUpForm';
import { createDbUser, formatPhoneNumber } from 'modules/user-api';
import { useHistory } from 'react-router-dom';
import { breadcrumb, log } from 'modules/logging';
import { CreateUserResponse } from 'types/api';
import useAuth from 'hooks/useAuth';
import { FirstLoginFormSpec } from './FirstLoginForm';

const validationSchema = Yup.object<SignUpFormData>({
    ...FirstLoginFormSpec, // Extend the validation spec from "first time login"
    isTermsChecked: Yup.bool()
        .label('isTermsChecked')
        .oneOf([true], 'You must agree to terms before continuing'),
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
                const existingValue = context.parent as SignUpFormData;
                invariant(existingValue, 'invalid yup email object shape');

                return existingValue?.email === value;
            },
            message: 'Emails must match',
            exclusive: false,
        }),
    institutionName: Yup.string()
        .label('institutionName')
        .required('Institution Name is required')
        .min(1, 'Institution Name is required'),
});

export const useSignUpFormController = (initialValues: SignUpFormData) => {
    const { signUp } = useAuth();
    const history = useHistory();

    const form = useFormik({
        enableReinitialize: true,
        // validateOnChange: true,
        initialValues,
        onSubmit: async (newUserInfo, { setErrors, setSubmitting }) => {
            breadcrumb(`submitting new user`, 'sign up', newUserInfo);

            try {
                const cognitoUser = await signUp(
                    newUserInfo.email,
                    newUserInfo.newPassword,
                    formatPhoneNumber(newUserInfo.phoneNumber)
                );

                // only proceed if cognito user was created successfully
                const result = cognitoUser && (await createDbUser(newUserInfo));

                if (result?.errorMessage?.length) {
                    // Expected error, display to GUI
                    setErrors({ signUpError: result.errorMessage });
                } else if (result && (result as CreateUserResponse)?.user?.id) {
                    // User created successfully, let them into the app
                    history.push('/');
                } else {
                    // Unexpected error occurred
                    breadcrumb(`Invalid user creation response`, 'sign up', {
                        result,
                        newUserInfo,
                    });
                    throw new Error(`Invalid user creation response`);
                }
            } catch (e) {
                log(`Invalid user creation response`, {
                    newUserInfo,
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
