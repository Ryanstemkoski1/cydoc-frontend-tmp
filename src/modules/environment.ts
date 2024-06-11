// FIXME: link up to AWS region & ENV config
export const __DEV__ =
    process.env.NEXT_PUBLIC_PRODUCTION_OR_DEV !== 'production';

export const APP_ENV = __DEV__ ? 'staging' : 'production';

export const isProduction = () => APP_ENV === 'production';

// eslint-disable-next-line no-console
console.log(`starting app with env:`, {
    DEV: __DEV__,
    APP_ENV,
    production: isProduction(),
});

const COGNITO_CLIENT_ID_STAGING = '4c3hr78qk8etujcpnmhc0lgdus';
const COGNITO_POOL_ID_STAGING = 'us-east-2_bd4BfhE7d';

const COGNITO_CLIENT_ID_PRODUCTION = '7rinpvk08cr0vpivppgqbjlip0';
const COGNITO_POOL_ID_PRODUCTION = 'us-east-1_mCoemdVnn';
const API_URL_PRODUCTION =
    'https://53mpt60q66.execute-api.us-east-1.amazonaws.com/Prod';
const API_URL_STAGING =
    'https://kek00l9lrg.execute-api.us-east-2.amazonaws.com/Prod';

const REGION_STAGING = 'us-east-2';
const REGION_PRODUCTION = 'us-east-1';

export let COGNITO_CLIENT_ID = COGNITO_CLIENT_ID_STAGING;
export let COGNITO_POOL_ID = COGNITO_POOL_ID_STAGING;
export let API_URL = API_URL_STAGING;
export let REGION = REGION_STAGING;

const STRIPE_KEY_STAGING =
    'pk_test_51O04nxLRmkJGS8LAyGNorSUrKuc6cDVEdsrP7A1YIQeBjU1RyKIIJvjD86dO9z2cRUQSaqRQ7b6EBakV4xYEZRHp00YtLbYFiW';
const STRIPE_KEY_PRODUCTION =
    'pk_live_51I8WjzI5qo8H3FXU0K1gpndArcjAxLcGR3GWHyCaFsSxB6XckVoWeTH8rzkajlpdgQN1OTiWd4vEhnjKboqyks0g000p9or7In';
export let STRIPE_KEY = STRIPE_KEY_STAGING;

if (isProduction()) {
    COGNITO_CLIENT_ID = COGNITO_CLIENT_ID_PRODUCTION;
    COGNITO_POOL_ID = COGNITO_POOL_ID_PRODUCTION;
    API_URL = API_URL_PRODUCTION;
    REGION = REGION_PRODUCTION;
    STRIPE_KEY = STRIPE_KEY_PRODUCTION;
}
