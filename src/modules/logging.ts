'use client';

import * as Sentry from '@sentry/nextjs';

import pkgInfo from '../../package.json';

// import { APP_ENV } from './environment';
import { DbUser } from '@cydoc-ai/types';

const SENTRY_ENABLED = process.env.NODE_ENV === 'production';

let SENTRY_INITIALIZED = false;

// [[ uname == MING* ]] && echo "windows" || echo "unix"
// [[ uname == Darw* ]] && echo "windows" || echo "unix"

// if [[ uname == MING* ]]; then echo "windows"; else echo "unix"; fi
// if [[ uname == Darw* ]]; then echo "windows"; else echo "unix"; fi

export const updateLoggedUser = (user: Partial<DbUser> | null) => {
    if (user) {
        const newUser: Sentry.User = {
            ...user,
            id: `${user.id}`,
        };
        Sentry.setUser(newUser);
    } else {
        Sentry.setUser(user);
    }
};

// Initializes sentry error logging service
// export function initializeSentry() {
// Sentry.init({
//     dsn: 'https://4d2b3dd2cd304864a3e69b5e7d3dab35@o4505208002576384.ingest.sentry.io/4505208111562752',
//     integrations: [
//         Sentry.browserTracingIntegration(),
//         Sentry.replayIntegration({
//             // Additional SDK configuration goes in here, for example:
//             maskAllText: true,
//             blockAllMedia: true,
//         }),
//     ],
//     release: pkgInfo.version,
//     // release: process.env.VITE_SENTRY_RELEASE, // TODO: pull release from hash?
//     enabled: SENTRY_ENABLED,
//     environment: APP_ENV,

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 0.1, // production can consume ~1k transactions/day (limit is 10k/month)
// });

if (SENTRY_ENABLED && !SENTRY_INITIALIZED) {
    // set package version as a tag
    Sentry.setTag('version', pkgInfo.version);
    SENTRY_INITIALIZED = true;
}
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export function setSentryUser(user: DbUser | null) {
    const userWithStringId = { ...user, id: `${user?.id}` };
    if (SENTRY_ENABLED) {
        const sentryUser: Sentry.User | null = user
            ? {
                  ...userWithStringId,
              }
            : null;
        Sentry.setUser(sentryUser);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function breadcrumb(message: string, category: string, crumb?: any) {
    if (SENTRY_ENABLED) {
        Sentry.addBreadcrumb({
            category: category,
            message: message,
            data: crumb,
        });
    } else {
        // eslint-disable-next-line no-console
        console.warn(`BREADCRUMB: ${message}: ${JSON.stringify(crumb)}`);
    }
}
