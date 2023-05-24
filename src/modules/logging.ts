import * as Sentry from '@sentry/react';

import pkgInfo from '../../package.json';

import { APP_ENV } from './environment';
import { DynamoDbUser } from 'types/users';

const SENTRY_ENABLED = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-console
console.log(`PRODUCTION: ${SENTRY_ENABLED}, ENV: ${APP_ENV}`);

// Initializes sentry error logging service
export function initializeSentry() {
    Sentry.init({
        dsn: 'https://4d2b3dd2cd304864a3e69b5e7d3dab35@o4505208002576384.ingest.sentry.io/4505208111562752',
        integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
        release: pkgInfo.version,
        // release: process.env.VITE_SENTRY_RELEASE, // TODO: pull release from hash?
        enabled: SENTRY_ENABLED,
        environment: APP_ENV,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.1, // production can consume ~1k transactions/day (limit is 10k/month)
    });

    // set package version as a tag
    Sentry.setTag('version', pkgInfo.version);
}
export function log(message: string, data?: any) {
    if (data) {
        breadcrumb(message, 'auto-breadcrumb', data);
    }
    if (SENTRY_ENABLED) {
        Sentry.captureMessage(message);
    } else {
        // eslint-disable-next-line no-console
        console.warn(message, data);
    }
}

export function logError(error: Error) {
    if (SENTRY_ENABLED) {
        Sentry.captureException(error);
    } else {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}
export function setSentryUser(user: DynamoDbUser | null) {
    if (SENTRY_ENABLED) {
        const sentryUser: Sentry.User | null = user
            ? {
                  ...user,
              }
            : null;
        Sentry.setUser(sentryUser);
    }
}

export function breadcrumb(message: string, category: string, crumb?: any) {
    if (SENTRY_ENABLED) {
        Sentry.addBreadcrumb({
            category: category,
            message: message,
            data: crumb,
        });
    } else {
        // console.warn(`BREADCRUMB: ${message}: ${JSON.stringify(crumb)}`);
    }
}
