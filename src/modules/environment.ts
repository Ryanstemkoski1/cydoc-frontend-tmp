export const __DEV__ =
    process.env.NEXT_PUBLIC_PRODUCTION_OR_DEV !== 'production';

// pull from .env.local or amplify
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;
export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_POOL_ID;
export const REGION = process.env.NEXT_PUBLIC_REGION;
export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export const isProduction = () => APP_ENV === 'production';

// eslint-disable-next-line no-console
console.log(`starting app with env:`, {
    DEV: __DEV__,
    APP_ENV,
    production: isProduction(),
    COGNITO_CLIENT_ID,
    COGNITO_POOL_ID,
    API_URL,
    REGION,
    STRIPE_KEY,
});
