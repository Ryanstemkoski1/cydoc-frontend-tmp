import axios from 'axios';

// Instantiate an axios client
export const client = axios.create({
    baseURL: 'https://cydocbackend.herokuapp.com',
});

export const graphClient = axios.create({
    baseURL: 'https://cydocgraph.herokuapp.com',
});

export const poolDataClient = axios.create({
    baseURL: 'https://6i5pdwz3n5.execute-api.us-east-1.amazonaws.com/dev',
});
