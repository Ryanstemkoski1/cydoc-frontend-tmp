import { Auth, Amplify } from 'aws-amplify';
import { COGNITO_CLIENT_ID, COGNITO_POOL_ID } from 'modules/environment';
import { log } from 'modules/logging';
import { ClinicianSignUpData } from 'types/users';

Amplify.configure({
    Auth: {
        userPoolWebClientId: COGNITO_CLIENT_ID,
        userPoolId: COGNITO_POOL_ID,
    },
});

const USER_EXISTS = 'UsernameExistsException';
type AmplifyErrorCode = typeof USER_EXISTS | 'some other code';
interface AmplifyError {
    name: 'UsernameExistsException';
    code: AmplifyErrorCode;
}

export const createAmplifyUser = async (
    newUserInfo: ClinicianSignUpData,
    navtoLogin: () => void
) => {
    const { newPassword, phoneNumber, email } = newUserInfo;

    try {
        const { user } = await Auth.signUp({
            username: email,
            password: newPassword,
            attributes: {
                email, // optional
                // phoneNumber, // optional - E.164 number convention
                // other custom attributes
            },
            autoSignIn: {
                // optional - enables auto sign in after user is confirmed
                enabled: true,
            },
        });

        console.log(`amplify user signed up:`, user);

        return user;
    } catch (e) {
        const error = e as unknown as AmplifyError;
        log('error signing up:', error);
        if (error?.code === USER_EXISTS) {
            alert(`Account already exists, please login`);
            navtoLogin();
        }
    }
};
