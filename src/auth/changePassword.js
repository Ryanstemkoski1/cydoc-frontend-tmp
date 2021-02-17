import getUserPool from 'auth/getUserPool';

const changePassword = async (currentPassword, newPassword, role) => {
    const userPool = await getUserPool(role);
    if (!userPool) {
        // no alert here since it appears in getUserPool
        return;
    }

    // get current user from user pool
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
        alert(
            ' Could not change password. Error retrieving user: Please ensure you have selected the correct role.'
        );
        return;
    }

    // get user's session to retrieve id and access tokens
    cognitoUser.getSession((err, _session) => {
        if (err) {
            alert(
                `Could not change password. Error retrieving user session: ${
                    err.message || JSON.stringify(err)
                } Please try again later.`
            );
            return;
        }
    });

    // change password
    return new Promise((resolve) => {
        cognitoUser.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
                if (err) {
                    alert(
                        `Error changing password: ${
                            err.message || JSON.stringify(err)
                        }`
                    );
                    return;
                }
                resolve(result);
            }
        );
    });
};

export default changePassword;
