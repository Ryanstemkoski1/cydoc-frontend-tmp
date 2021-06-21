import axios from 'axios';

// Instantiate an axios client
export const client = axios.create({
    baseURL: 'https://cydocbackend.herokuapp.com',
});

export const graphClient = axios.create({
    baseURL: 'https://cydocgraph.herokuapp.com',
    headers: { 'Access-Control-Allow-Origin': '*' },
});

export const poolDataClient = axios.create({
    baseURL: 'https://6i5pdwz3n5.execute-api.us-east-1.amazonaws.com/dev',
});

export const identityPoolClient = axios.create({
    baseURL: 'https://fpuwaa4x60.execute-api.us-east-1.amazonaws.com/dev',
    //headers: { 'Access-Control-Allow-Origin': '*' },
});

export const doctorClient = axios.create({
    baseURL: 'https://wb51en5rr1.execute-api.us-east-1.amazonaws.com/prod',
});

export const managerClient = axios.create({
    baseURL: 'https://739r03swxh.execute-api.us-east-1.amazonaws.com/prod',
});

export const patientClient = axios.create({
    baseURL: 'https://864lhmmkg9.execute-api.us-east-1.amazonaws.com/prod',
});

export const stripeClient = axios.create({
    baseURL: 'https://f42bhadly5.execute-api.us-east-1.amazonaws.com/dev',
});
