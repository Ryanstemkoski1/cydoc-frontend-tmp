import { doctorClient, managerClient, patientClient } from 'constants/api.js';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

const completeNewPasswordChallengeDoctor = (
    currentUser,
    newPassword,
    newUserCognitoAttribute
) => {
    return new Promise((resolve) => {
        currentUser.completeNewPasswordChallenge(
            newPassword,
            newUserCognitoAttribute,
            {
                onSuccess: async (_result) => {
                    resolve({
                        isFirstLoginFlag: false,
                    });
                },
                mfaSetup: function (_challengeName, _challengeParameters) {
                    currentUser.associateSoftwareToken(this);
                },
                mfaRequired: function (_codeDeliveryDetails) {
                    // need MFA to complete user authentication
                    let verificationCode = prompt(
                        'Please input verification code sent via text message to your phone.',
                        ''
                    );
                    // TODO: make a better UI for this
                    // if user incorrectly types in code, they will be confirmed in Cognito but will not exist in the databse, meaning they will be able to "login" with their new username/pass, but they will get and error saying they do not exist.
                    // to mitigate the risk of this happening, ask users to confirm what they typed in before submitting it.
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
                    resolve({
                        isFirstLoginFlag: true,
                    });
                    return undefined;
                },
            }
        );
    });
};

const completeNewPasswordChallengeManager = (
    currentUser,
    newPassword,
    newUserCognitoAttribute,
    manager_uuid
) => {
    return new Promise((resolve) => {
        currentUser.completeNewPasswordChallenge(
            newPassword,
            newUserCognitoAttribute,
            {
                onSuccess: async (_result) => {
                    const attributeList = [
                        new CognitoUserAttribute({
                            Name: 'custom:uuid',
                            Value: manager_uuid,
                        }),
                    ];
                    // update attributes in Cognito
                    await currentUser.updateAttributes(attributeList, (err) => {
                        if (err) {
                            alert(
                                `Error updating UUID: ${
                                    err.message || JSON.stringify(err)
                                }`
                            );
                            return;
                        }
                    });
                    resolve({
                        isFirstLoginFlag: false,
                    });
                },
                mfaSetup: function (_challengeName, _challengeParameters) {
                    currentUser.associateSoftwareToken(this);
                },
                mfaRequired: function (_codeDeliveryDetails) {
                    // need MFA to complete user authentication
                    let verificationCode = prompt(
                        'Please input verification code sent via text message to your phone.',
                        ''
                    );
                    // TODO: make a better UI for this
                    // if user incorrectly types in code, they will be confirmed in Cognito but will not exist in the databse, meaning they will be able to "login" with their new username/pass, but they will get and error saying they do not exist.
                    // to mitigate the risk of this happening, ask users to confirm what they typed in before submitting it.
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
                    resolve({
                        isFirstLoginFlag: true,
                    });
                    return undefined;
                },
            }
        );
    });
};

const SetupAccount = async (
    currentUser,
    newUserAttr,
    username,
    newPassword,
    attributes
) => {
    let user = {
        username,
        ...attributes,
        email: newUserAttr.email,
        phoneNumber: newUserAttr.phone_number,
    };
    // assign `role` to corresponding user fields before deleting the user fields
    const role = user.role;

    delete user.fullPhoneNumber;
    delete user.phone_number;
    delete user.countryCode;
    delete user['custom:UUID'];
    delete user.role;
    const email = user.email;
    const name = `${user.firstName} ${user.lastName}`;
    let customerInfo = {
        customer: {
            email,
            attributes: {
                customerUUID: '',
                name,
                role,
            },
        },
    };

    //new user attribute for completeNewPasswordChallenge function
    let newUserCognitoAttribute = {
        'custom:associatedManager': newUserAttr['custom:associatedManager'],
        email: newUserAttr.email,
        given_name: newUserAttr.given_name,
        middle_name: newUserAttr.middle_name,
        family_name: newUserAttr.family_name,
        phone_number: newUserAttr.phone_number,
    };

    // user successfully reset password and confirmed account
    delete user.fullPhoneNumber;

    delete user.countryCode;
    delete user['custom:UUID'];
    delete user['custom:associatedManager'];

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
    } else if (role == 'doctor') {
        const doctor_uuid = attributes['custom:UUID'];
        url = doctorClient;
        path = `/doctors/${doctor_uuid}`;
        delete user.username;
        payload = JSON.stringify({ doctor: user });
        customerInfo.customer.attributes.customerUUID = doctor_uuid;
    }
    // TODO: what is the role name for patients?
    else if (role == 'patient') {
        url = patientClient;
        path = '/patients';
        payload = JSON.stringify({ patient: user });
    }
    if (role == 'manager') {
        delete newUserCognitoAttribute['custom:associatedManager'];
        delete newUserCognitoAttribute['phone_number'];

        try {
            const response = await url.post(path, payload);
            const manager_uuid = response.data[0];
            customerInfo.customer.attributes.customerUUID = manager_uuid;
            await completeNewPasswordChallengeManager(
                currentUser,
                newPassword,
                newUserCognitoAttribute,
                manager_uuid
            );
        } catch (e) {
            alert(`Error creating account: ${e.message || JSON.stringify(e)}`);
            return;
        }
    } else if (role == 'doctor') {
        try {
            await url.put(path, payload);
        } catch (e) {
            alert(`Error! Please check info`);
            return;
        }

        // next, update manager's joinedDoctors in DynamoDB
        const mPayload = JSON.stringify({
            manager: {
                joinedDoctors: [attributes['custom:UUID']],
            },
        });
        try {
            await managerClient.put(
                `/managers/${attributes['custom:associatedManager']}`,
                mPayload
            );
        } catch (err) {
            alert(
                `Error updating manager: ${err.message || JSON.stringify(err)}`
            );
            return;
        }

        const res = await completeNewPasswordChallengeDoctor(
            currentUser,
            newPassword,
            newUserCognitoAttribute
        );
        return res;
    }
};

export default SetupAccount;
