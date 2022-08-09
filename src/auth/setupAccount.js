import {
    doctorClient,
    managerClient,
    patientClient,
    stripeClient,
} from 'constants/api.js';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

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
    // assign `role` and `cardInfo` to corresponding user fields before deleting the user fields
    const role = user.role;

    delete user.fullPhoneNumber;
    delete user.phone_number;
    delete user.countryCode;
    delete user['custom:UUID'];
    delete user.role;
    // the information below is needed for sending info to Stripe
    const cardInfo = user.card;
    delete user.card;
    const email = user.email;
    const name = `${user.firstName} ${user.lastName}`;
    const zipCode = '84088';
    let customerInfo = {
        customer: {
            cardData: cardInfo,
            email,
            zipCode,
            attributes: {
                customerUUID: '',
                name,
                role,
                plans: [{ price: 'price_1IeoaLI5qo8H3FXUkFZRFvSr' }],
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

    // path to send info to Stripe
    const stripe_path = '/subscription';

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

        url.post(path, payload)
            .then(async (response) => {
                const manager_uuid = response.data[0];
                // then, create customer and send card info to Stripe
                customerInfo.customer.attributes.customerUUID = manager_uuid;
                let stripe_payload = JSON.stringify(customerInfo);
                await stripeClient
                    .post(stripe_path, stripe_payload)
                    .then(() => {
                        alert('Payment info successfully sent to Stripe');
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
                                        resolve({
                                            isFirstLoginFlag: false,
                                        });
                                        alert(
                                            'Your account has been successfully set up. Please login to continue.'
                                        );
                                        window.location.reload(false);
                                    },
                                    mfaSetup: function (
                                        _challengeName,
                                        _challengeParameters
                                    ) {
                                        currentUser.associateSoftwareToken(
                                            this
                                        );
                                    },
                                    mfaRequired: function (
                                        _codeDeliveryDetails
                                    ) {
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
                                        currentUser.sendMFACode(
                                            verificationCode,
                                            this
                                        );
                                    },
                                    onFailure: function (err) {
                                        // setting new password was not successful
                                        alert(
                                            `Error setting up account: ${
                                                err.message ||
                                                JSON.stringify(err)
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
                    })
                    .catch(() => {
                        alert(`Error with Payment info`);
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

        // alert(
        //     'Your account has been successfully set up. Please login to continue.'
        // );
    } else if (role == 'doctor') {
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
                        `/managers/${attributes['custom:associatedManager']}`,
                        payload
                    )
                    .then(() => {})
                    .catch((err) => {
                        alert(
                            `Error updating manager: ${
                                err.message || JSON.stringify(err)
                            }`
                        );
                        return;
                    });
                // then, send doctor's payment info to Stripe
                let stripe_payload = JSON.stringify(customerInfo);
                //console.log(stripe_payload);
                await stripeClient
                    .post(stripe_path, stripe_payload)
                    .then(() => {
                        return new Promise((resolve) => {
                            currentUser.completeNewPasswordChallenge(
                                newPassword,
                                newUserCognitoAttribute,
                                {
                                    onSuccess: async (_result) => {
                                        resolve({
                                            isFirstLoginFlag: false,
                                        });
                                        alert(
                                            'Your account has been successfully set up. Please login to continue.'
                                        );
                                        window.location.reload(false);
                                    },
                                    mfaSetup: function (
                                        _challengeName,
                                        _challengeParameters
                                    ) {
                                        currentUser.associateSoftwareToken(
                                            this
                                        );
                                    },
                                    mfaRequired: function (
                                        _codeDeliveryDetails
                                    ) {
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
                                        currentUser.sendMFACode(
                                            verificationCode,
                                            this
                                        );
                                    },
                                    onFailure: function (err) {
                                        // setting new password was not successful
                                        alert(
                                            `Error setting up account: ${
                                                err.message ||
                                                JSON.stringify(err)
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
                    })
                    .catch(() => {
                        alert(`Error with Payment info`);
                        return;
                    });
            })
            .catch(() => {
                alert(`Error! Please check info`);
                return;
            });
    }
};

export default SetupAccount;
