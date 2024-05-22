import {
    PasswordErrorInfos,
    PasswordErrorTypes,
    getPasswordErrors,
    havePasswordError,
    passwordErrors,
} from '@constants/passwordErrors';
import { useField } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Container,
    Icon,
    Message,
    MessageItemProps,
    SemanticShorthandItem,
} from 'semantic-ui-react';
import { Stack } from '@mui/system';
import { Grid } from '@mui/material';

export default function PasswordErrorMessages() {
    const [{ value: newPassword }, newPasswordMeta] =
        useField<string>('newPassword');
    const [{ value: confirmPassword }, confirmPasswordMeta] =
        useField<string>('confirmNewPassword');

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

        for (const err in passwordErrors) {
            if (!passwordReqs[err as PasswordErrorTypes]) {
                errMsgs.push(
                    <Message.Item
                        key={err}
                        content={
                            passwordErrors[err as keyof typeof passwordErrors]
                        }
                    />
                );
            }
        }

        return errMsgs;
    }, [passwordReqs]);

    useEffect(() => {
        if (newPasswordMeta.touched) {
            setPasswordReqs(getPasswordErrors(newPassword));
        }
    }, [newPassword, newPasswordMeta.touched]);

    if (!showPasswordMatchError && !showPasswordRequirementsErrors) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <Stack sx={{ marginTop: '1rem' }}>
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
        </Grid>
    );
}
