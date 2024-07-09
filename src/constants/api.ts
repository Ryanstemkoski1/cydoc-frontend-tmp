import axios from 'axios';
import { API_URL, GRAPH_URL } from '../modules/environment';

export const graphClientURL = GRAPH_URL;

export const graphClient = axios.create({
    baseURL: graphClientURL,
    headers: { 'Access-Control-Allow-Origin': '*' },
});

export const apiClient = axios.create({
    baseURL: `${API_URL}/`,
    headers: { 'Content-Type': 'application/json' },
});
