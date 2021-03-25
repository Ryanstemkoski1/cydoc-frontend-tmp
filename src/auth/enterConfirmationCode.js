import { CognitoUser } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';

const EnterConfirmationCode = async (
    username,
    role,
    confirmationCode,
    newPassword,
    confirmPassword
) => {
    if (!confirmationCode) {
        alert('Please input your verification code.');
        return;
    }

    if (!newPassword) {
        alert('Please enter a new password.');
        return;
    }

    if (!confirmPassword) {
        alert('Please re-enter your password.');
        return;
    }

    if (newPassword != confirmPassword) {
        alert('Passwords do not match. Please re-enter password.');
    }
    const userPool = await getUserPool(role);
    const userData = {
        Username: username,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);

    return new Promise((resolve) => {
        cognitoUser.confirmPassword(confirmationCode, newPassword, {
            onSuccess: async (_result) => {
                resolve({
                    success: true,
                });
            },

            onFailure: (err) => {
                // user authentication was not successful
                err.message.includes(
                    'Member must satisfy regular expression pattern'
                )
                    ? alert(
                          'Error changing password: Password does not satisfy requirements.'
                      )
                    : alert(
                          `Error changing password: ${
                              err.message || JSON.stringify(err)
                          }`
                      );
                resolve(err);
            },
        });
    });
};

export default EnterConfirmationCode;
