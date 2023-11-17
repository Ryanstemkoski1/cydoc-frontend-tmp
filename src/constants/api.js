import axios from 'axios';
import { API_URL } from '../modules/environment';

function getGraphClientURL() {
    let graphClientURL;
    let graphClientURLProd = 'https://newcydocgraph-3bf6786f6497.herokuapp.com';
    let graphClientURLDev = 'https://newcydocgraphdev-bb581ae89e66.herokuapp.com';
    if (location.hostname == 'www.cydoc.ai') {
        graphClientURL = graphClientURLProd;
    } else if (location.hostname == 'www.cyai.site') {
        graphClientURL = graphClientURLDev;
    } else if (location.hostname == 'localhost') {
        graphClientURL = graphClientURLProd;
    } else {
        graphClientURL = graphClientURLProd;
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
