import getUserPool from 'auth/getUserPool';

const getUUID = async (role) => {
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

            if (role == 'doctor') {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].getName() == 'custom:UUID') {
                        const uuid = result[i].getValue();
                        resolve(uuid);
                    }
                }
            } else if (role == 'manager') {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].getName() == 'custom:uuid') {
                        const uuid = result[i].getValue();
                        resolve(uuid);
                    }
                }
            }
            resolve('no UUID');
        });
    });
};

export default getUUID;
