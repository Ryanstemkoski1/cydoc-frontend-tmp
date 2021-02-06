import { poolDataClient } from 'constants/api.js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

// get UserPoolId and ClientId for given role from API Gateway
const getUserPool = async (role) => {
    let poolData = {};
    try {
        const res = await poolDataClient.get(`/pool-data?role=${role}`);
        poolData = res.data;
    } catch (err) {
        alert(
            `Error retrieving user pool information: ${
                err.message || JSON.stringify(err)
            }`
        );
        return;
    }

    return new CognitoUserPool(poolData);
};

export default getUserPool;
