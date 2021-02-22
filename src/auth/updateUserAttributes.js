import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';

const updateUserAttributes = async (role, userInfo) => {
    const userPool = await getUserPool(role);
    if (!userPool) {
        // no alert here since it appears in getUserPool
        return;
    }

    // get current user from user pool
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
        alert(
            'Error retrieving user: Please ensure you have selected the correct role.'
        );
        return;
    }

    // getSession must be called to authenticate user before calling getUserAttributes
    cognitoUser.getSession((err, _session) => {
        if (err) {
            alert(
                `Error retrieving user session: ${
                    err.message || JSON.stringify(err)
                }`
            );
            return;
        }
    });

    // TODO: make call to update info in Dynamo

    // update info in Cogntio
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'given_name',
            Value: userInfo.firstName,
        }),
        new CognitoUserAttribute({
            Name: 'middle_name',
            Value: userInfo.middleName,
        }),
        new CognitoUserAttribute({
            Name: 'family_name',
            Value: userInfo.lastName,
        }),
        new CognitoUserAttribute({
            Name: 'email',
            Value: userInfo.email,
        }),
        new CognitoUserAttribute({
            Name: 'phone_number',
            Value: userInfo.fullPhoneNumber,
        }),
    ];

    return new Promise((resolve) => {
        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                alert(
                    `Error updating user attributes: ${
                        err.message || JSON.stringify(err)
                    }`
                );
                return;
            }
            resolve(result);
        });
    });
};

export default updateUserAttributes;
