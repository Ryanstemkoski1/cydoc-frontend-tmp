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
            onSuccess: async (_result) => {
                // user successfully reset password and confirmed account
                let user = {
                    username,
                    ...attributes,
                    email: newUserAttr.email,
                    phoneNumber: newUserAttr.phone_number,
                };

                delete user.fullPhoneNumber;

                delete user.countryCode;
                delete user['custom:UUID'];
                const role = user.role;
                delete user.role;

                // add user to DynamoDB if manager, or update user in DynamoDB if doctor
                let url,
                    path,
                    payload = '';
                if (role == 'manager') {
                    url = managerClient;
                    path = '/managers';
                    // initializes empty lists for associatedDoctors and joinedDoctors so that they can be appended to in future update requests
                    user.associatedDoctors = [];
                    user.joinedDoctors = [];
                    payload = JSON.stringify({ manager: user });
                } else if (role == 'healthcare professional') {
                    url = doctorClient;
                    path = `/doctors/${attributes['custom:UUID']}`;
                    delete user.username;
                    payload = JSON.stringify({ doctor: user });
                }
                // TODO: what is the role name for patients?
                else if (role == 'patient') {
                    url = patientClient;
                    path = '/patients';
                    payload = JSON.stringify({ patient: user });
                }
                if (role == 'manager') {
                    url.post(path, payload)
                        .then(async (response) => {
                            const manager_uuid = response.data[0];
                            const attributeList = [
                                new CognitoUserAttribute({
                                    Name: 'custom:uuid',
                                    Value: manager_uuid,
                                }),
                            ];
                            await currentUser.updateAttributes(
                                attributeList,
                                (err) => {
                                    if (err) {
                                        alert(
                                            `Error updating UUID: ${
                                                err.message ||
                                                JSON.stringify(err)
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
                            return;
                        });
                } else if (role == 'healthcare professional') {
                    url.put(path, payload)
                        .then(async () => {
                            // next, update manager's joinedDoctors in DynamoDB
                            const payload = JSON.stringify({
                                manager: {
                                    joinedDoctors: [attributes['custom:UUID']],
                                },
                            });
                            await managerClient
                                .put(
                                    `/managers/${newUserAttr['custom:associatedManager']}`,
                                    payload
                                )
                                .then(() => {
                                    alert(
                                        'Your account has been successfully set up. Please login to continue.'
                                    );
                                    resolve({
                                        isFirstLoginFlag: false,
                                    });
                                })
                                .catch((err) => {
                                    alert(
                                        `Error updating manager: ${
                                            err.message || JSON.stringify(err)
                                        }`
                                    );
                                    return;
                                });
                        })
                        .catch((err) => {
                            alert(
                                `Error creating account: ${
                                    err.message || JSON.stringify(err)
                                }`
                            );
                            return;
                        });
                }
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
