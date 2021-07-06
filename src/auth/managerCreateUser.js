import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import getUserPool from 'auth/getUserPool';
import {
    identityPoolClient,
    doctorClient,
    managerClient,
} from 'constants/api.js';
import getUUID from './getUUID';

const region = 'us-east-1';

const managerCreateUser = async (username, email, firstName, lastName) => {
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
    const newUserPoolData = await getUserPool('doctor');

    if (!newUserPoolData) {
        alert(
            'Error retrieving new user pool information. Please try again later.'
        );
        return {
            status: 'ERROR',
        };
    }

    const manager_uuid = await getUUID('manager');
    const doctor_payload = {
        doctor: {
            username,
            email,
            associatedManager: manager_uuid,
            firstName,
            lastName,
        },
    };

    // TODO: check if doctor username already exists in Cognito -- if it does, then stop this process and throw error

    doctorClient
        .post('/doctors', JSON.stringify(doctor_payload))
        .then(async (response) => {
            const doctor_uuid = response.data[0];
            // initialize command
            const params = {
                DesiredDeliveryMediums: ['EMAIL'],
                ForceAliasCreation: false,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'custom:associatedManager', Value: manager_uuid },
                    { Name: 'custom:UUID', Value: doctor_uuid },
                    { Name: 'given_name', Value: firstName },
                    { Name: 'family_name', Value: lastName },
                ],
                Username: username,
                UserPoolId: newUserPoolData.userPoolId,
            };
            const command = new AdminCreateUserCommand(params);

            // send request to create new user
            try {
                const data = await client.send(command);
                const doctorUsername = data.User.Username;

                // next, update manager's associatedDoctors in DynamoDB
                const payload = JSON.stringify({
                    manager: { associatedDoctors: [doctor_uuid] },
                });
                await managerClient
                    .put(`/managers/${manager_uuid}`, payload)
                    .then(() => {
                        alert(
                            `Success: An email invitation has been sent to ${email} with login instructions, with the following username: ${doctorUsername}. Thank you!`
                        );
                        return {
                            status: 'SUCCESS',
                        };
                    })
                    .catch((err) => {
                        alert(
                            `Error updating manager: ${
                                err.message || JSON.stringify(err)
                            }`
                        );
                    });
            } catch (err) {
                if (!err.message.includes('User account already exists')) {
                    alert(
                        `Error creating account: ${
                            err.message || JSON.stringify(err)
                        }`
                    );
                }
                return {
                    status: 'ERROR',
                    message: err.message || JSON.stringify(err),
                };
            }
        })
        .catch((err) => {
            alert(
                `Error creating account: ${err.message || JSON.stringify(err)}`
            );
        });
};

export default managerCreateUser;
