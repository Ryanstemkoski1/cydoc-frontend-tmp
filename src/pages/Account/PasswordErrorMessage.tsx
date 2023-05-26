import {
    PasswordErrorInfos,
    PasswordErrorTypes,
    getPasswordErrors,
    havePasswordError,
    passwordErrors,
    passwordIsValid,
} from 'constants/passwordErrors';
import { useField } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { SignUpFormData } from './SignUpForm';
import {
    Container,
    Icon,
    Message,
    MessageItemProps,
    SemanticShorthandItem,
} from 'semantic-ui-react';
import { Stack } from '@mui/system';

export function PasswordErrorMessages() {
    const [{ value: newPassword }, newPasswordMeta] =
        useField<string>('newPassword');
    const [{ value: confirmPassword }, confirmPasswordMeta] =
        useField<string>('confirmNewPassword');
    const [{ value: role }, ,] = useField<SignUpFormData['role']>('role');

    const passwordsHaveBeenTouched = useMemo(
        () => newPasswordMeta.touched && confirmPasswordMeta.touched,
        [newPasswordMeta.touched, confirmPasswordMeta.touched]
    );

    const showPasswordMatchError = useMemo(
        () => passwordsHaveBeenTouched && newPassword !== confirmPassword,
        [passwordsHaveBeenTouched, newPassword, confirmPassword]
    );

    const [passwordReqs, setPasswordReqs] = useState<PasswordErrorInfos>({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });

    const showPasswordRequirementsErrors = useMemo(
        () => newPasswordMeta.touched && havePasswordError(passwordReqs),
        [newPasswordMeta.touched, passwordReqs]
    );

    const passwordErrorMessages = useMemo(() => {
        const errMsgs: SemanticShorthandItem<MessageItemProps>[] = [];
        const passwordErrs = passwordErrors(role);
        for (const err in passwordErrs) {
            if (!passwordReqs[err as PasswordErrorTypes]) {
                errMsgs.push(
                    <Message.Item
                        key={err}
                        content={passwordErrs[err as keyof typeof passwordErrs]}
                    />
                );
            }
        }

        return errMsgs;
    }, [passwordReqs, role]);

    useEffect(() => {
        if (newPasswordMeta.touched) {
            setPasswordReqs(getPasswordErrors(newPassword));
        }
    }, [newPassword, newPasswordMeta.touched]);

    return (
        <Stack sx={{ marginTop: '2rem' }}>
            {showPasswordMatchError && (
                <Container className='pass-match-error'>
                    <Icon name='exclamation circle' />
                    Passwords do not match.
                </Container>
            )}
            {showPasswordRequirementsErrors ? (
                <Message
                    error
                    header='Password must satisfy the following requirements:'
                    list={passwordErrorMessages}
                />
            ) : null}
        </Stack>
    );
}
