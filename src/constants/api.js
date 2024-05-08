import axios from 'axios';
import { API_URL } from '@modules/environment';

function getGraphClientURL() {
    let graphClientURL;
    console.warn(
        `FIXME: getGraphClientURL() is returning a hardcoded value. This should be fixed to return the correct URL based on the environment.`
    );
    let graphURLProd = 'https://newcydocgraph-3bf6786f6497.herokuapp.com';
    let graphURLDev = 'https://newcydocgraphdev-bb581ae89e66.herokuapp.com';
    return graphURLDev;
    if (location.hostname == 'www.cydoc.ai') {
        graphClientURL = graphURLProd;
    } else if (location.hostname == 'www.cyai.site') {
        graphClientURL = graphURLDev;
    } else if (location.hostname == 'localhost') {
        graphClientURL = graphURLProd;
    } else {
        graphClientURL = graphURLProd;
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
