import { newDoctorCreateClient } from 'constants/api';
import '@stripe/stripe-js';
let cognito = require('amazon-cognito-identity-js');

/* This file was reworked July 2022 to denest the functions related to DynamoDB, Cognito,
and Stripe. The function is asynchronous so the await function can be used to assure the uuid
created by DynamoDB can be included in the creation of the user in Cognito */

//////////////////////////////////////////////////////////////////////////////////////////////
// define doctorSignUp object
const doctorSignUp = async (
    username,
    password,
    email,
    firstName,
    lastName,
    phoneNumber,
    paymentMethodID
) => {
    // format phone number
    phoneNumber = phoneNumber.replace('(', '+1');
    phoneNumber = phoneNumber.replace(/-|\(|\)/gi, '');
    phoneNumber = phoneNumber.replace(' ', '');

    // declare uuid variable
    let doctor_uuid = '';

    //////////////////////////////////////////////////////////////////////////////////////////
    // ADD USER TO DYNAMO DB
    const doctor_payload = {
        paymentMethodID,
        doctor: {
            username,
            email,
            firstName,
            lastName,
            phoneNumber,
            associatedManager: 'v1',
        },
    };

    // make DynamoDB request and store generated uuid
    await newDoctorCreateClient
        .post('', JSON.stringify(doctor_payload))
        .then(async (response) => {
            doctor_uuid = response.data[0];
        });

    ///////////////////////////////////////////////////////////////////////////////////////
    // ADD USER TO COGNITO USER POOL

    // define attributes to send to Cognito
    const CognitoUserAttributes = [
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phoneNumber },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'custom:UUID', Value: doctor_uuid },
        //{Name: 'custom:doctor_uuid', Value: doctor_uuid}
    ];

    // identify user pool and app client
    let poolData = {
        UserPoolId: 'us-east-1_B303pmcdz', // old doctor user pool id
        ClientId: '1g3vdqlpkpmse39veagh93hlih', // old pool app client id
    };

    // make Cognito request
    let userPool = new cognito.CognitoUserPool(poolData);
    userPool.signUp(
        username,
        password,
        CognitoUserAttributes,
        null,
        function (err) {
            // error messaging
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
        }
    );
};

export default doctorSignUp;
