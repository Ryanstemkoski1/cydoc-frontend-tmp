import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';
import { client } from 'constants/api.js';

const GetLogin = async (username, password, role, context) => {
    // can't log user in without username, password, or role
    if (!username) {
        alert('Please input your username before logging in.');
        return;
    }
    if (!password) {
        alert('Please input your password before logging in.');
        return;
    }
    if (!role) {
        alert('Please select your role before logging in.');
        return;
    }

    // get user pool info and cognito user
    const userPool = await getUserPool(role);
    if (!userPool) {
        return;
    }
    const userData = {
        Username: username,
        Pool: userPool,
    };
    let cognitoUser = new CognitoUser(userData);
    const authenticationData = {
        Username: username,
        Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    // wrap in promise to get back user info, redirect flag, and first login flag
    return new Promise((resolve) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async (_result) => {
                // user authentication was successful
                const payload = {
                    username: username,
                    password: password,
                };

                // login user from database
                const response = await client
                    .post('/login', payload)
                    .then((res) => {
                        const user = res;
                        localStorage.setItem('user', JSON.stringify(user));
                        return user;
                    })
                    .then((user) => {
                        return user;
                    })
                    .catch((err) => {
                        return err.response;
                    });

                if (!response) {
                    alert('no response');
                    return;
                } else if (response.status === 200) {
                    context.storeLoginInfo(
                        response.data.user,
                        role,
                        response.data.jwt.accessToken
                    );
                    resolve({
                        currentUser: cognitoUser,
                        isFirstLoginFlag: false,
                        redirectFlag: true,
                    });
                } else {
                    alert(response.data.Message);
                }
            },

            onFailure: (err) => {
                // user authentication was not successful
                err.message.includes('Incorrect username or password')
                    ? alert(
                          'Error authenticating user: Incorrect username, password, or role.'
                      )
                    : alert(
                          `Error authenticating user: ${
                              err.message || JSON.stringify(err)
                          }`
                      );
                resolve(err);
            },

            mfaSetup: function (_challengeName, _challengeParameters) {
                cognitoUser.associateSoftwareToken(this);
            },

            mfaRequired: function (_codeDeliveryDetails) {
                // need MFA to complete user authentication
                const verificationCode = prompt(
                    'Please input verification code',
                    ''
                );
                cognitoUser.sendMFACode(verificationCode, this);
            },

            newPasswordRequired: (userAttributes) => {
                // user was signed up by an admin and must provide new password and required attributes to complete authentication
                alert(
                    'Welcome to Cydoc! Please change your password to set up your account.'
                );

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                delete userAttributes.phone_number_verified;

                resolve({
                    currentUser: cognitoUser,
                    userAttr: userAttributes,
                    isFirstLoginFlag: true,
                    redirectFlag: false,
                });
            },
        });
    });
};

export default GetLogin;
