import getUserPool from 'auth/getUserPool';

const isEmailVerified = async (role) => {
    try {
        const userPool = await getUserPool(role);
        if (!userPool) {
            return false;
        }
        const cognitoUser = userPool.getCurrentUser();
        const session = await getGognitoSession(cognitoUser);
        return session.idToken.payload.email_verified === true;
    } catch (e) {
        alert(e);
        return false;
    }
};

const getGognitoSession = (cognitoUser) => {
    return new Promise((resolve, reject) => {
        cognitoUser.getSession((err, session) => {
            if (err) {
                alert('Error getting session', err);
                reject();
            }
            resolve(session);
        });
    });
};

export default isEmailVerified;
