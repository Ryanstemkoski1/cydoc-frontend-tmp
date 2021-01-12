import axios from 'axios';

// Instantiate an axios client
export const client = axios.create({
    baseURL: 'https://cydocbackend.herokuapp.com',
});

export const graphClient = axios.create({
    baseURL: 'https://cydocgraph.herokuapp.com',
});
