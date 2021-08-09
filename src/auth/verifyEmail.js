import { CognitoUser } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';

const verifyEmail = async (username, role) => {
    const userPool = await getUserPool(role);
    const userData = {
        Username: username,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);

    // getSession must be called to authenticate user before calling getAttributeVerficationCode
    cognitoUser.getSession((err, _session) => {
        if (err) {
            alert(
                `Error retrieving user session: ${
                    err.message || JSON.stringify(err)
                }`
            );
            return;
        }
    });

    return new Promise((resolve) => {
        cognitoUser.getAttributeVerificationCode('email', {
            onSuccess: async (_result) => {
                resolve({
                    verifyEmailResponse: true,
                });
            },
            onFailure: (err) => {
                resolve(err);
            },

            inputVerificationCode: () => {
                let verificationCode = prompt(
                    'Please verify your email before logging in with the 6 digit verification code sent to your email. ',
                    ''
                );
                // while (
                //     !window.confirm(
                //         `You typed in ${verificationCode}. Is this the code you want to submit?`
                //     )
                // ) {
                //     verificationCode = prompt(
                //         'Please input verification code',
                //         ''
                //     );
                // }
                cognitoUser.verifyAttribute('email', verificationCode, {
                    onSuccess: async (_result) => {
                        alert(
                            'Your account has been successfully set up. Please login to continue.'
                        );
                    },
                    onFailure: (err) => {
                        resolve(err);
                    },
                });
            },
        });
    });
};

export default verifyEmail;
