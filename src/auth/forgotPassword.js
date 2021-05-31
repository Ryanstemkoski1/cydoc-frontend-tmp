import { CognitoUser } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';

const ResetPassword = async (username, role) => {
    if (!username) {
        alert('Please input your username to login.');
        return;
    }

    if (!role) {
        alert('Please select your role before resetting password');
        return;
    }

    // get user pool info and cognito user
    const userPool = await getUserPool(role);
    const userData = {
        Username: username,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);
    return new Promise((resolve) => {
        cognitoUser.forgotPassword({
            onSuccess: async (_result) => {
                resolve({
                    success: true,
                });
            },

            onFailure: (err) => {
                //forgot password not successfull
                alert(err.message || JSON.stringify(err));

                resolve({
                    success: false,
                });
            },
        });
    });
};

export default ResetPassword;
