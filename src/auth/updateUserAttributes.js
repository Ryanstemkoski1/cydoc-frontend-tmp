import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import getUserPool from 'auth/getUserPool';
import { managerClient, doctorClient, patientClient } from 'constants/api';
import getUUID from 'auth/getUUID';

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

    // these three variables need to be deleted in order to conform to backend's schema
    delete userInfo.countryCode;
    delete userInfo.username;
    delete userInfo.role;

    // TODO: make call to update info in Dynamo
    // TODO: test to see if the payload follows the model/schema in backend
    let url,
        path,
        payload = '';
    const uuid = await getUUID(role);
    if (role == 'manager') {
        url = managerClient;
        path = `/managers/${uuid}`;
        payload = JSON.stringify({ manager: userInfo });
    } else if (role == 'healthcare professional') {
        url = doctorClient;
        path = `/doctors/${uuid}`;
        payload = JSON.stringify({ doctor: userInfo });
    }
    // TODO: what is the role name for patients?
    else if (role == 'patient') {
        url = patientClient;
        path = `/patients/${uuid}`;
        payload = JSON.stringify({ patient: userInfo });
    }
    url.put(path, payload)
        .then(() => {
            alert('Your profile has been updated successfully.');
        })
        .catch((err) => {
            alert(
                `Error updating profile: ${err.message || JSON.stringify(err)}`
            );
        });

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
            Value: userInfo.phoneNumber,
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
