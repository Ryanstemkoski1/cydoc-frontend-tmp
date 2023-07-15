import { CognitoUser } from 'amazon-cognito-identity-js';
import { ApiEditUserBase, ClinicianSignUpData } from 'types/users';
import { createDbUser } from 'modules/api';
import { createCognitoUser } from './cognito';

const setupUserAccount = async (
    cognitoUser: CognitoUser, // null when new users sign up
    newUserInfo: ClinicianSignUpData,
    navtoLogin: () => void
) => {
    const { firstName, lastName, phoneNumber, email } = newUserInfo;
    const user: ApiEditUserBase = {
        phoneNumber,
        email,
        firstName,
        lastName,
    };

    // TODO: update manager flow to handle "new" users

    // previously all managers were "invited" or "existing" users
    try {
        // create user in database & cognito
        const [dbUser, cognitoResult] = await Promise.all([
            createDbUser(newUserInfo),
            createCognitoUser(newUserInfo, navtoLogin),
        ]);

        console.log(`user creation results`, { dbUser, cognitoResult });

        // TODO: automatically launch new password challenge UI after creation
        // const res = await completeNewPasswordChallengeDoctor(
        //     cognitoUser,
        //     newPassword,
        //     newUserCognitoAttribute
        // );
    } catch (e) {
        alert(`Error creating account`);
        return;
    }
};

export default setupUserAccount;
