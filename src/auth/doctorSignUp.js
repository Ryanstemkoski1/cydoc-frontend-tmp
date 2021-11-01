import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { doctorClient } from 'constants/api.js';
import { stripeClient } from 'constants/api.js';
const doctorSignUp = async (
    username,
    password,
    email,
    firstName,
    lastName,
    phoneNumber,
    cardNumber,
    expirationYear,
    expirationMonth,
    cvv
) => {
    //sanitize phoneNumber
    phoneNumber = phoneNumber.replace('(', '+1');
    phoneNumber = phoneNumber.replace(/-|\(|\)/gi, '');
    phoneNumber = phoneNumber.replace(' ', '');

    const name = `${firstName} ${lastName}`;
    const role = 'doctor';
    const card = {
        cardNumber: cardNumber,
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        cvv: cvv,
    };
    let customerInfo = {
        customer: {
            cardData: card,
            email,
            attributes: {
                customerUUID: '',
                name,
                role,
                plans: [{ price: 'price_1IeoaLI5qo8H3FXUkFZRFvSr' }],
            },
        },
    };
    const poolData = {
        UserPoolId: 'us-east-1_B303pmcdz',
        ClientId: '1g3vdqlpkpmse39veagh93hlih',
    };

    const doctor_payload = {
        doctor: {
            username,
            email,
            firstName,
            lastName,
            phoneNumber,
            associatedManager: 'v1',
        },
    };
    const userPool = new CognitoUserPool(poolData);
    // TODO: check if doctor username already exists in Cognito -- if it does, then stop this process and throw error
    doctorClient
        .post('/doctors', JSON.stringify(doctor_payload))
        .then(async (response) => {
            const doctor_uuid = response.data[0];
            customerInfo.customer.attributes.customerUUID = doctor_uuid;
            // initialize command
            const UserAttributes = [
                { Name: 'email', Value: email },
                { Name: 'phone_number', Value: phoneNumber },
                { Name: 'given_name', Value: firstName },
                { Name: 'family_name', Value: lastName },
                { Name: 'custom:UUID', Value: doctor_uuid },
                { Name: 'custom:associatedManager', Value: 'v1' },
            ];

            let stripe_payload = JSON.stringify(customerInfo);
            await stripeClient
                .post('/subscription', stripe_payload)
                .then(async () => {
                    //send request to create new user
                    userPool.signUp(
                        username,
                        password.toString(),
                        UserAttributes,
                        null,
                        //eslint-disable-next-line
                        (err, data) => {
                            if (err != null) {
                                if (err.code === 'UsernameExistsException') {
                                    alert(`Error: Username already taken.`);
                                    return;
                                }
                                return;
                            } else {
                                alert(
                                    'Account Successfully Created!\nIn order to complete the sign-up process, please click the confirmation link sent to the email provided.'
                                );
                            }
                        }
                    );
                })
                .catch(() => {
                    alert(`Payment Error\n Please verify card details`);
                    return;
                });
        })
        .catch(() => {
            alert(`Error creating account`);
        });
};

export default doctorSignUp;
