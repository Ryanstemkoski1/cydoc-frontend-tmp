import axios from 'axios';
export const hpiHeaders = axios.get(
    process.env.NEXT_PUBLIC_GRAPH_URL + '/hpi/CYDOC'
);
