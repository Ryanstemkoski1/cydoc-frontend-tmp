import axios from 'axios';
import { graphClientURL } from 'constants/api.js';

export const hpiHeaders = axios.get(graphClientURL + '/hpi/CYDOC');
