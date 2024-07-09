/*******************************
          GitHub Account
*******************************/
/*
  Logs into GitHub using OAuth
*/

var fs = require('fs'),
    path = require('path'),
    githubAPI = require('github'),
    // stores oauth info for GitHub API
    oAuthConfig = path.join(__dirname, 'oauth.js'),
    oAuth = fs.existsSync(oAuthConfig) ? require(oAuthConfig) : false,
    github;

if (!oAuth) {
    console.error(
        'Must add oauth token for GitHub in tasks/config/admin/oauth.js'
    );
}

github = new githubAPI({
    version: '3.0.0',
    debug: true,
    protocol: 'https',
    timeout: 5000,
});

// TODO(sentry): Could not automatically migrate - see https://github.com/getsentry/sentry-javascript/blob/develop/MIGRATION.md#deprecate-hub
github.authenticate({
    type: 'oauth',
    token: oAuth.token,
});

module.exports = github;
