import getUserPool from 'auth/getUserPool';

export const triggerEmailVerification = (username, role) => {
    return new Promise((resolve, reject) => {
        getUserPool(role).then((userPool) => {
            const cognitoUser = userPool.getCurrentUser();

            // getSession must be called to authenticate user before calling getAttributeVerficationCode
            cognitoUser.getSession((err, _session) => {
                if (err) {
                    alert(
                        `Error retrieving user session: ${
                            err.message || JSON.stringify(err)
                        }`
                    );
                    reject();
                    return;
                }
            });

            cognitoUser.getAttributeVerificationCode('email', {
                onSuccess: async (_result) => {
                    resolve(cognitoUser);
                },
                onFailure: () => {
                    reject();
                },
            });
        });
    });
};

export const verifyEmail = async (code, cognitoUser) => {
    return new Promise((resolve, reject) => {
        cognitoUser.verifyAttribute('email', code, {
            onSuccess: async (_result) => {
                alert(
                    'Your account has been successfully set up. Please login to continue.'
                );
                resolve();
            },
            onFailure: (err) => {
                alert('Failed verifying code');
                reject(err);
            },
        });
    });
};
