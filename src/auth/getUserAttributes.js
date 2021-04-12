import getUserPool from 'auth/getUserPool';
import { doctorClient, managerClient, patientClient } from 'constants/api';
import getUUID from './getUUID';

const attributeMappings = {
    given_name: 'firstName',
    middle_name: 'middleName',
    family_name: 'lastName',
    email: 'email',
    phone_number: 'phoneNumber',
};

const getUserAttributes = async (role) => {
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

    let attributes = {};
    const uuid = await getUUID(role);

    let url,
        path = '';
    if (role == 'manager') {
        url = managerClient;
        path = `/managers/${uuid}`;
    } else if (role == 'healthcare professional') {
        // TODO: test this out with a valid doctor accounnt
        url = doctorClient;
        path = `/doctors/${uuid}`;
    } else if (role == 'patient') {
        // TODO: test this out once login for patients has been created
        url = patientClient;
        path = `/doctors/${uuid}`;
    }

    await url
        .get(path)
        .then((response) => {
            attributes = response.data.Item;
        })
        .catch((err) => {
            alert(
                `Error fetching attributes: ${
                    err.message || JSON.stringify(err)
                }`
            );
        });

    // TODO: when calling the GET request to the backend, phoneNumberIsMobile is an int rather than a boolean because DynamoDB stores booleans as ints -- so Mobile isn't checked on the frontend edit profile page

    return new Promise((resolve) => {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                alert(
                    `Error retrieving user attributes: ${
                        err.message || JSON.stringify(err)
                    } \n\nPlease try refreshing the page.`
                );
                return;
            }

            for (let i = 0; i < result.length; i++) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        attributeMappings,
                        result[i].getName()
                    )
                ) {
                    attributes[attributeMappings[result[i].getName()]] = result[
                        i
                    ].getValue();
                }
            }

            resolve({
                ...attributes,
                username: cognitoUser.username,
            });
        });
    });
};

export default getUserAttributes;
