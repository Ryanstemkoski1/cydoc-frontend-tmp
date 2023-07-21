// import {
//     CognitoUser,
//     CognitoUserAttribute,
//     ISignUpResult,
// } from 'amazon-cognito-identity-js';
// import { COGNITO_CLIENT_ID, COGNITO_POOL_ID } from 'modules/environment';
// import { ClinicianSignUpData, UserAttributes } from 'types/users';
// import { CognitoUserPool } from 'amazon-cognito-identity-js';
// import invariant from 'tiny-invariant';
// import { breadcrumb, log } from 'modules/logging';
// import { stringFromError } from 'modules/error-utils';

// export const userPool = new CognitoUserPool({
//     UserPoolId: COGNITO_POOL_ID,
//     ClientId: COGNITO_CLIENT_ID,
// });

// // ADD USER TO COGNITO USER POOL
// export const createCognitoUser = async (
//     newUserInfo: ClinicianSignUpData,
//     navtoLogin: () => void
// ): Promise<ISignUpResult | undefined> =>
//     new Promise((resolve, reject) => {
//         // define attributes to send to Cognito
//         const { newPassword, phoneNumber, email } = newUserInfo;
//         const CognitoUserAttributes = [
//             new CognitoUserAttribute({ Name: 'email', Value: email }),
//             new CognitoUserAttribute({
//                 Name: 'phone_number',
//                 Value: phoneNumber,
//             }),
//         ];

//         userPool.signUp(
//             email,
//             newPassword,
//             CognitoUserAttributes,
//             [],
//             function (err, result) {
//                 // Throw error to calling function
//                 if (err) {
//                     const message = stringFromError(err);
//                     if (message.includes('already exists')) {
//                         alert(`Account already exists, please login`);
//                         navtoLogin();
//                     } else {
//                         log(`[createCognitoUser] Error: ${message}`);
//                         reject(err);
//                     }
//                 } else {
//                     breadcrumb(`cognito user created`, 'sign up', result);

//                     resolve(result);
//                 }
//             }
//         );
//     });

// const completeNewPasswordChallenge = (
//     cognitoUser: CognitoUser,
//     newPassword: string,
//     newUserCognitoAttributes: UserAttributes,
//     manager_uuid: string
// ) => {
//     return new Promise((resolve) => {
//         cognitoUser.completeNewPasswordChallenge(
//             newPassword,
//             newUserCognitoAttributes,
//             {
//                 onSuccess: async (_result) => {
//                     const attributeList = [
//                         new CognitoUserAttribute({
//                             Name: 'custom:uuid',
//                             Value: manager_uuid,
//                         }),
//                     ];
//                     // update attributes in Cognito
//                     await cognitoUser.updateAttributes(attributeList, (err) => {
//                         if (err) {
//                             alert(
//                                 `Error updating UUID: ${
//                                     err.message || JSON.stringify(err)
//                                 }`
//                             );
//                             return;
//                         }
//                     });
//                     resolve({
//                         isFirstLoginFlag: false,
//                     });
//                 },
//                 mfaSetup: function (_challengeName, _challengeParameters) {
//                     // TODO: investigate TS error
//                     // @ts-expect-error further investigation required
//                     cognitoUser.associateSoftwareToken(this);
//                 },
//                 mfaRequired: function (_codeDeliveryDetails) {
//                     // need MFA to complete user authentication
//                     const verificationCode = prompt(
//                         'Please input verification code sent via text message to your phone.',
//                         ''
//                     );
//                     invariant(verificationCode, 'invalid code entered');

//                     // TODO: make a better UI for this
//                     // if user incorrectly types in code, they will be confirmed in Cognito but will not exist in the databse,
//                     // meaning they will be able to "login" with their new username/pass, but they will get and error saying they do not exist.
//                     // to mitigate the risk of this happening, ask users to confirm what they typed in before submitting it.
//                     // while (
//                     //     !window.confirm(
//                     //         `You typed in ${verificationCode}. Is this the code you want to submit?`
//                     //     )
//                     // ) {
//                     //     verificationCode = prompt(
//                     //         'Please input verification code',
//                     //         ''
//                     //     );
//                     // }
//                     cognitoUser.sendMFACode(verificationCode || '', this);
//                 },
//                 onFailure: function (err) {
//                     // setting new password was not successful
//                     alert(
//                         `Error setting up account: ${
//                             err.message || JSON.stringify(err)
//                         }`
//                     );
//                     resolve(err);
//                     resolve({
//                         isFirstLoginFlag: true,
//                     });
//                     return undefined;
//                 },
//             }
//         );
//     });
// };
