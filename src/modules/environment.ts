export const __DEV__ = process.env.NODE_ENV !== 'production';

export const APP_ENV = __DEV__ ? 'staging' : 'production';
