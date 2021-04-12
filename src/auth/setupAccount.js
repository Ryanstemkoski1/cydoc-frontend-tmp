import { doctorClient, managerClient, patientClient } from 'constants/api.js';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

const SetupAccount = async (
    currentUser,
    newUserAttr,
    username,
    newPassword,
    attributes
) => {
    // wrap in promise to get back user info, redirect flag, and first login flag
    return new Promise((resolve) => {
        currentUser.completeNewPasswordChallenge(newPassword, newUserAttr, {
            onSuccess: (_result) => {
                // user successfully reset password and confirmed account

                const user = {
                    username,
                    ...attributes,
                    email: newUserAttr.email,
                    phoneNumber: newUserAttr.phone_number,
                };
                delete user.countryCode;

                // add user to DynamoDB
                let url,
                    path,
                    payload = '';
                if (user.role == 'manager') {
                    url = managerClient;
                    path = '/managers';
                    payload = JSON.stringify({ manager: user });
                } else if (user.role == 'healthcare professional') {
                    url = doctorClient;
                    path = '/doctors';
                    payload = JSON.stringify({ doctor: user });
                }
                // TODO: what is the role name for patients?
                else if (user.role == 'patient') {
                    url = patientClient;
                    path = '/patients';
                    payload = JSON.stringify({ patient: user });
                }

                url.post(path, payload)
                    .then(async (response) => {
                        const uuid = response.data[0];
                        const attributeList = [
                            new CognitoUserAttribute({
                                Name: 'custom:uuid',
                                Value: uuid,
                            }),
                        ];
                        await currentUser.updateAttributes(
                            attributeList,
                            (err) => {
                                if (err) {
                                    alert(
                                        `Error updating UUID: ${
                                            err.message || JSON.stringify(err)
                                        }`
                                    );
                                    return;
                                }
                            }
                        );
                        alert(
                            'Your account has been successfully set up. Please login to continue.'
                        );
                        resolve({
                            isFirstLoginFlag: false,
                        });
                    })
                    .catch((err) => {
                        alert(
                            `Error creating account: ${
                                err.message || JSON.stringify(err)
                            }`
                        );
                    });
            },

            mfaSetup: function (_challengeName, _challengeParameters) {
                currentUser.associateSoftwareToken(this);
            },

            mfaRequired: function (_codeDeliveryDetails) {
                // need MFA to complete user authentication
                let verificationCode = prompt(
                    'Please input verification code',
                    ''
                );

                // TODO: make a better UI for this
                // if user incorrectly types in code, they will be confirmed in Cognito but will not exist in the databse, meaning they will be able to "login" with their new username/pass, but they will get and error saying they do not exist.
                // to mitigate the risk of this happening, ask users to confirm what they typed in before submitting it.
                while (
                    !window.confirm(
                        `You typed in ${verificationCode}. Is this the code you want to submit?`
                    )
                ) {
                    verificationCode = prompt(
                        'Please input verification code',
                        ''
                    );
                }

                currentUser.sendMFACode(verificationCode, this);
            },

            onFailure: function (err) {
                // setting new password was not successful
                alert(
                    `Error setting up account: ${
                        err.message || JSON.stringify(err)
                    }`
                );
                resolve(err);
            },
        });
    });
};

export default SetupAccount;
