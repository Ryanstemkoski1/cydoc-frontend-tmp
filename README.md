# cydoc-frontend

# First time setup

0. Install your code editor of preference. If you do not have an editor of preference, we recommend installing Visual Studio Code.

1. If not already installed, install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). During installation, you'll be asked to "Configure line ending conversions". IF you are on a Windows machine, select the option "Checkout Windows-style, commit Unix-style line endings". If you are on a Mac, select the option "Checkout as-is, commit Unix-style line endings." This wil ensure cross-platform compatibility.

2. Install nvm. Nvm is used to manage different versions of Node. Nvm for Windows can be found [here](https://github.com/coreybutler/nvm-windows/releases).

3. Use nvm to install the appropriate version of Node by running **nvm install 18** in a terminal. Then run **nvm use 18**.

4. Download the code to the directory you wish to use it from. We recommend "C:/src". One of the simplest ways to clone the codebase is to run **git clone https://github.com/cydoc-ai/cydoc_frontend.git**. You will be asked to set up authentication to GitHub as part of this process.

5. Navigate into cydoc_frontend and run **npm install** to install dependencies. You only need to re-run **npm install** if you update package versions or packages used by the project.

6. get the `.env.local` file from Rachel or anther dev and place it in the top directory of the repo.

7. Run **npm start** to start the project. This will start the project at [http://localhost:3000](http://localhost:3000) (or whichever port you are using). As you make edits to the code, the browser will automatically reload.

8. Install [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related?hl=en) for Chrome. This extension is invaluable for viewing and analyzing Redux state.

## Amplify

We use amplify to run continuous deployment, provision auth (cognito), messaging templates (SNS) & auth related hooks

You'll want a production (us-east-1) and a staging (us-east-2) profile in your aws cli config

run `amplify configure` to switch profiles & ensure you're in the right region, be careful with deploying amplify configs as it can break production

Be sure to switch to the correct environment before pushing any changes:
`amplify env checkout dev` or `amplify env checkout production`

deploy with: `amplify push`
verify changes before deploy with `amplify status`

check out the docs for more info

## Potential Setup Issues

When attempting step 5, an issue may be encountered, particularly when using an M1 MacBook:
" Error: Cannot find module 'node-darwin-arm64/package.json' "

In the event this occurs, follow the steps outlined in the video linked [here](https://www.youtube.com/watch?v=sZybySiuz6w) and re-attempt to install dependencies.

## Routing and Security

Authentication relies on amplify and can be accessed with the useAuth() hook
Authorization relies on our SQL database and can be accessed with the useUser() hook

when adding a new route, be sure to add the appropriate auth verification:
- authentication with useSignInRequired()
- manager authorization with useManagerRequired()

# Before Submitting a PR

Before committing changes, please run `npm run lint` to lint.

To fix the linting errors automatically, run `npm run lint fix`.

Then, run `npm run lint` again and manually fix any remaining errors.

Before submitting a PR, `npm run lint` should output the following:

-   😄 No linting errors found for src/index.js
-   😄 No linting errors found for src/contexts
-   😄 No linting errors found for tests
-   😄 No linting errors found for src/components
-   😄 No linting errors found for src/constants
-   😄 No linting errors found for src/screens
-   😄 No linting errors found for src/auth

# Hiding Semantic css build changes

Currently running a build creates uncommitted changes in the semantic build directory. You can prevent git from tracking these changes by running the git ignore script with:

```
npm run "ignore-semantic-changes
```

It is run automatically when semantic is built or the dev server is started (`npm start`)

# Bash problems on windows

If the `npm scripts` are not running correctly, it's likely your bash env is messed up.

What do you see when you run `uname`?
Relevant info: https://stackoverflow.com/questions/50998089/running-npm-script-on-windows-starting-with-a-period

# Testing with Vitest

**New tests should be written using `vitest` _without_ Jest or Enzyme**

And this corresponding line of code within a test:

```
const wrapper = render(<MyComponent />)
```

(the method shallow renders the single component you are testing, it does not render child components -- to render child components it is common to use mount instead of shallow)

Typically, tests will follow this format:

```
test('short description of the test', () => {
     expect(something)
});
```

If you want to group tests together within the file, use:

```
describe('here is a group of tests', () => {
     test('test one', () => { });
     test('test two', () => { });
});
```

To find documentation on testing with Vitest, go to:
[https://vitest.dev/guide/](https://vitest.dev/guide/)
