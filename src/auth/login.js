import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';
import getUserAttributes from 'auth/getUserAttributes';

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
                // const payload = {
                //     username: username,
                //     password: password,
                // };
                const accessToken = _result.getAccessToken().getJwtToken();
                const getUserAttributesResponse = await getUserAttributes(role);
                context.storeLoginInfo(
                    getUserAttributesResponse,
                    role,
                    accessToken
                );
                resolve({
                    currentUser: cognitoUser,
                    isFirstLoginFlag: false,
                    redirectFlag: true,
                });
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
                    'Please input verification code sent via text message to your phone.',
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
