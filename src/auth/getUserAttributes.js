import getUserPool from 'auth/getUserPool';

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

    const attributes = {};

    // TODO: make call to Dynamo to retrieve user attributes stored in database

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
