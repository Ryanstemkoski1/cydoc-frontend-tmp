'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import invariant from 'tiny-invariant';
import { SignUpFormData } from './SignUp';
import {
    createManagerAndInstitution,
    formatPhoneNumber,
} from '@modules/user-api';
import { useRouter } from 'next/navigation';
import { breadcrumb, log } from '@modules/logging';
import useAuth from 'hooks/useAuth';
import { FirstLoginFormSpec } from './FirstLoginForm';
import { DbUser, UpdateUserResponse } from '@cydoc-ai/types';
import { CognitoUser } from 'auth/cognito';

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
    const router = useRouter();

    const form = useFormik({
        enableReinitialize: true,
        // validateOnChange: true,
        initialValues,
        onSubmit: async (newUserInfo, { setErrors, setSubmitting }) => {
            breadcrumb(`submitting new user`, 'sign up', newUserInfo);
            setErrors({});

            try {
                const signUpResult = await signUp(
                    newUserInfo.email,
                    newUserInfo.newPassword,
                    formatPhoneNumber(newUserInfo.phoneNumber)
                );

                // only proceed if cognito user was created successfully
                let result: {
                    user?: CognitoUser | DbUser | undefined;
                    errorMessage?: string;
                } = signUpResult; // carry over errors
                if (signUpResult?.user) {
                    result = await createManagerAndInstitution(
                        newUserInfo,
                        null // user creation endpoint doesn't require auth token
                    );
                }

                if (result?.errorMessage?.length) {
                    // Expected error, display to GUI
                    setErrors({ submitError: result.errorMessage });
                } else if (result && (result as UpdateUserResponse)?.user?.id) {
                    // User created successfully, take them to MFA page
                    router.push('/login');
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
                    submitError:
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
