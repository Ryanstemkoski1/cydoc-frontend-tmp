import axios from 'axios';
import { API_URL } from '../modules/environment';

function getGraphClientURL() {
    let graphClientURL;
    if (location.hostname == 'www.cydoc.ai') {
        graphClientURL = 'https://cydocgraph.herokuapp.com';
    } else if (location.hostname == 'www.cyai.site') {
        graphClientURL = 'https://cydocgraphdev.herokuapp.com';
    } else if (location.hostname == 'localhost') {
        graphClientURL = 'https://cydocgraph.herokuapp.com';
    } else {
        graphClientURL = 'https://cydocgraph.herokuapp.com';
    }
    return graphClientURL;
}

export const graphClientURL = getGraphClientURL();

export const graphClient = axios.create({
    baseURL: graphClientURL,
    headers: { 'Access-Control-Allow-Origin': '*' },
});

export const apiClient = axios.create({
    baseURL: `${API_URL}/`,
    headers: { 'Content-Type': 'application/json' },
});
