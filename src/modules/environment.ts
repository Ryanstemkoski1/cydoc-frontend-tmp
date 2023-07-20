export const __DEV__ = process.env.NODE_ENV !== 'production';

export const APP_ENV = __DEV__ ? 'staging' : 'production';

export const isProduction = () => APP_ENV === 'production';

// eslint-disable-next-line no-console
console.log(`starting app with env:`, {
    DEV: __DEV__,
    APP_ENV,
    production: isProduction(),
});

const COGNITO_CLIENT_ID_STAGING = '2810pgegm2hdrvoa30lq8hdfg6';
const COGNITO_POOL_ID_STAGING = 'us-east-2_2LCj8DXUD';

const COGNITO_CLIENT_ID_PRODUCTION = '3tk8ho17961r1aj22lv3rdjs7s';
const COGNITO_POOL_ID_PRODUCTION = 'us-east-1_UNZcGRQX2';
const API_URL_PRODUCTION =
    'https://53mpt60q66.execute-api.us-east-1.amazonaws.com/Prod';
const API_URL_STAGING =
    'https://ldxpvwxff1.execute-api.us-east-2.amazonaws.com/Prod';

export let COGNITO_CLIENT_ID = COGNITO_CLIENT_ID_STAGING;
export let COGNITO_POOL_ID = COGNITO_POOL_ID_STAGING;
export let API_URL = API_URL_STAGING;

if (isProduction()) {
    COGNITO_CLIENT_ID = COGNITO_CLIENT_ID_PRODUCTION;
    COGNITO_POOL_ID = COGNITO_POOL_ID_PRODUCTION;
    API_URL = API_URL_PRODUCTION;
}
