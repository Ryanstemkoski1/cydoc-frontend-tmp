import getUserPool from 'auth/getUserPool';

const signout = async (role) => {
    const userPool = await getUserPool(role);
    if (!userPool) {
        return;
    }

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
        cognitoUser.signOut({
            onSuccess: async (_result) => {
                //user signout was successful
                //context.logOut();
                resolve(_result);
            },

            onFailure: (err) => {
                if (err) {
                    alert(
                        `Error changing password: ${
                            err.message || JSON.stringify(err)
                        }`
                    );
                    return;
                }
                // console.log("err");
                resolve(err);
            },
        });
    });
};

export default signout;
