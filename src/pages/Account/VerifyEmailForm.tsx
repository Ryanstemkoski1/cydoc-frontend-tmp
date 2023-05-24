import React from 'react';
import { Button, Modal, Input } from 'semantic-ui-react';
import { verifyEmail } from 'auth/verifyEmail';

export function VerifyEmailForm() {
    return (
        <>
            <Modal.Header>Verify Email</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        Please check your email for a verification link. Once
                        you have verified your email, please click the button
                        below to continue.
                    </p>
                    {/* <Input
                        value={emailVerificationCode}
                        onChange={(e) => {
                            setEmailVerificationCode(e.target.value);
                        }}
                    />
                    <Button
                        style={{ marginLeft: '20px' }}
                        onClick={async () => {
                            try {
                                await verifyEmail(
                                    emailVerificationCode,
                                    cognitoUser
                                );
                                setIsEmailVerified(true);
                            } catch (e) {
                                alert(
                                    'Error verifying email. Please try again.'
                                );
                            }
                        }}
                    >
                        Continue
                    </Button> */}
                </Modal.Description>
            </Modal.Content>
        </>
    );
}
