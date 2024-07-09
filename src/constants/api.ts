import axios from 'axios';
import { API_URL } from '../modules/environment';

// TODO: remove "NEXT_PUBLIC" prefix
// then move calls to graph into server side code with "use-server" directive
export const graphClientURL = process.env.NEXT_PUBLIC_GRAPH_URL;

export const graphClient = axios.create({
    baseURL: graphClientURL,
    headers: { 'Access-Control-Allow-Origin': '*' },
});

export const apiClient = axios.create({
    baseURL: `${API_URL}/`,
    headers: { 'Content-Type': 'application/json' },
});
