import axios from 'axios';

export const hpiHeaders = axios.get(
    'https://cydocgraph.herokuapp.com/hpi/CYDOC'
);

export const subgraph = axios.get(
    'https://cydocgraph.herokuapp.com/graph/subgraph/'
);
