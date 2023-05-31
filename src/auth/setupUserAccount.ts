import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import {
    ApiEditManager,
    ApiEditUserBase,
    ClinicianSignUpData,
    UserAttributes,
} from 'types/users';
import { createOrUpdateManager } from 'modules/dynamoDb';
import invariant from 'tiny-invariant';

const setupUserAccount = async (
    cognitoUser: CognitoUser, // null when new users sign up
    attributes: UserAttributes | null, // null when new users sign up
    newUserInfo: ClinicianSignUpData
) => {
    const { firstName, username, lastName, phoneNumber } = newUserInfo;
    const { email } = attributes || newUserInfo;
    const user: ApiEditUserBase = {
        username,
        phoneNumber,
        email,
        firstName,
        lastName,
    };
    // assign `role` to corresponding user fields before deleting the user fields
    const role = newUserInfo.role;

    newUserInfo['custom:UUID'] = attributes?.['custom:UUID'] || '';
    newUserInfo['custom:associatedManager'] =
        attributes?.['custom:associatedManager'];

    //new user attribute for completeNewPasswordChallenge function
    const newUserCognitoAttributes: UserAttributes = {
        'custom:associatedManager':
            attributes?.['custom:associatedManager'] || '',
        email: attributes?.email || newUserInfo.email,
        given_name: attributes?.given_name || newUserInfo.firstName,
        family_name: attributes?.family_name || newUserInfo.lastName,
        phone_number: attributes?.phone_number || newUserInfo.phoneNumber,
    };

    // TODO: update manager flow to handle "new" users
    // previously all managers were "invited" or "existing" users
    if (role == 'manager') {
        try {
            const newManager: ApiEditManager = {
                ...user,
                associatedDoctors: [],
                joinedDoctors: [],
            };
            const managerUuid = await createOrUpdateManager(newManager);

            invariant(managerUuid, 'failed to update user data');

            return completeNewPasswordChallengeManager(
                cognitoUser,
                newUserInfo.newPassword,
                newUserCognitoAttributes,
                managerUuid
            );
        } catch (e) {
            alert(`Error creating account`);
            return;
        }
        // TODO: add back doctor creation (aka clinician)
        // } else if (role == 'doctor') {
        //     try {
        //         await url.put(path, payload);
        //     } catch (e) {
        //         alert(`Error! Please check info`);
        //         return;
        //     }

        //     // next, update manager's joinedDoctors in DynamoDB
        //     const mPayload = JSON.stringify({
        //         manager: {
        //             joinedDoctors: [attributes['custom:UUID']],
        //         },
        //     });
        //     try {
        //         await managerClient.put(
        //             `/managers/${attributes['custom:associatedManager']}`,
        //             mPayload
        //         );
        //     } catch (err) {
        //         alert(
        //             `Error updating manager: ${err.message || JSON.stringify(err)}`
        //         );
        //         return;
        //     }

        //     const res = await completeNewPasswordChallengeDoctor(
        //         cognitoUser,
        //         newPassword,
        //         newUserCognitoAttribute
        //     );
        //     return res;
    }
};

export default setupUserAccount;

const completeNewPasswordChallengeManager = (
    cognitoUser: CognitoUser,
    newPassword: string,
    newUserCognitoAttributes: UserAttributes,
    manager_uuid: string
) => {
    return new Promise((resolve) => {
        cognitoUser.completeNewPasswordChallenge(
            newPassword,
            newUserCognitoAttributes,
            {
                onSuccess: async (_result) => {
                    const attributeList = [
                        new CognitoUserAttribute({
                            Name: 'custom:uuid',
                            Value: manager_uuid,
                        }),
                    ];
                    // update attributes in Cognito
                    await cognitoUser.updateAttributes(attributeList, (err) => {
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
                    // TODO: investigate TS error
                    // @ts-expect-error further investigation required
                    cognitoUser.associateSoftwareToken(this);
                },
                mfaRequired: function (_codeDeliveryDetails) {
                    // need MFA to complete user authentication
                    const verificationCode = prompt(
                        'Please input verification code sent via text message to your phone.',
                        ''
                    );
                    invariant(verificationCode, 'invalid code entered');

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
                    cognitoUser.sendMFACode(verificationCode, this);
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
