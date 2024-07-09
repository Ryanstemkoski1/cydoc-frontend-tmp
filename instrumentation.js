import * as Sentry from '@sentry/nextjs';

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // this is your Sentry.init call from `sentry.server.config.js|ts`
        Sentry.init({
            dsn: 'https://4d2b3dd2cd304864a3e69b5e7d3dab35@o4505208002576384.ingest.us.sentry.io/4505208111562752',
            // Your Node.js Sentry configuration...
        });
    }

    // This is your Sentry.init call from `sentry.edge.config.js|ts`
    if (process.env.NEXT_RUNTIME === 'edge') {
        Sentry.init({
            dsn: 'https://4d2b3dd2cd304864a3e69b5e7d3dab35@o4505208002576384.ingest.us.sentry.io/4505208111562752',
            // Your Edge Runtime Sentry configuration...
        });
    }
}
