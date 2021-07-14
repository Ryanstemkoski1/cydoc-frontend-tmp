import axios from 'axios';

export const hpiHeaders = axios.get(
    'https://cydocgraph.herokuapp.com/hpi/CYDOC'
);
