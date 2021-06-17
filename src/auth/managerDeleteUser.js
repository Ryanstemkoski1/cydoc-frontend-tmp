import {
    CognitoIdentityProviderClient,
    AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import getUserPool from 'auth/getUserPool';
import { identityPoolClient, doctorClient } from 'constants/api.js';

const region = 'us-east-1';

const managerDeleteUser = async (username, uuid) => {
    // userPool should contain the managers user pool data
    let userPool = await getUserPool('manager');

    // get current user from user pool
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
        alert('Error retrieving user.');
        return {
            status: 'ERROR',
        };
    }

    // get user's session to retrieve id and access tokens
    cognitoUser.getSession(async (err, _session) => {
        if (err) {
            alert(
                `Error retrieving user session: ${
                    err.message || JSON.stringify(err)
                } Please try again later.`
            );
            return {
                status: 'ERROR',
                message: err.message || JSON.stringify(err),
            };
        }
    });

    // get manager identity pool id
    const identityPoolId = await identityPoolClient.get(
        '/identity-pool-data?role=manager'
    );

    // userPoolLink is the key name of the credentials login map
    const userPoolLink = `cognito-idp.${region}.amazonaws.com/${userPool.getUserPoolId()}`;

    const cognitoIdentityClient = new CognitoIdentityClient({ region });

    // create provider client to make request to
    const client = new CognitoIdentityProviderClient({
        region,
        credentials: fromCognitoIdentityPool({
            client: cognitoIdentityClient,
            identityPoolId: identityPoolId.data,
            logins: {
                [userPoolLink]: cognitoUser
                    .getSignInUserSession()
                    .getIdToken()
                    .getJwtToken(),
            },
        }),
    });

    // get doctor pool data
    const newUserPoolData = await getUserPool('healthcare professional');
    if (!newUserPoolData) {
        alert(
            'Error retrieving new user pool information. Please try again later.'
        );
        return {
            status: 'ERROR',
        };
    }

    // initialize command
    // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminDeleteUser.html
    const params = {
        Username: username,
        UserPoolId: newUserPoolData.userPoolId,
    };
    const command = new AdminDeleteUserCommand(params);

    // send request to delete user
    try {
        await client.send(command);
        const doctorUsername = params.Username;
        try {
            await doctorClient.delete('/doctors/' + uuid);
        } catch (err) {
            alert('Error deleting doctor from database.');
            return {
                status: 'ERROR',
                message: err.message || JSON.stringify(err),
            };
        }
        alert(`Success: Doctor ${doctorUsername} deleted.`);
        return {
            status: 'SUCCESS',
        };
    } catch (err) {
        if (err.message.includes('User does not exist')) {
            alert(
                `Error deleting account: ${err.message || JSON.stringify(err)}`
            );
        }
        return {
            status: 'ERROR',
            message: err.message || JSON.stringify(err),
        };
    }
};

export default managerDeleteUser;
