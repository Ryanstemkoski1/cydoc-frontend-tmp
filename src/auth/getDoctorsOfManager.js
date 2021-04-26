import getUserPool from 'auth/getUserPool';
import { managerClient } from 'constants/api';
import getUUID from 'auth/getUUID';

const getDoctorsOfManager = async (role) => {
    // TODO: don't hard code 'manager' in getUserPool
    const userPool = await getUserPool('manager');
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

    let doctors = [];
    let uuid = await getUUID(role);

    let url,
        path = '';
    if (role == 'manager') {
        url = managerClient;
        path = `/managers/getDoctors/${uuid}`;
    }

    return new Promise((resolve) => {
        url.get(path)
            .then((response) => {
                doctors = response.data;
                resolve(doctors);
            })
            .catch((err) => {
                alert(
                    `Error fetching attributes: ${
                        err.message || JSON.stringify(err)
                    }`
                );
            });
    });
};

export default getDoctorsOfManager;
