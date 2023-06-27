# cydoc-frontend

# First time setup

0. Install your code editor of preference. If you do not have an editor of preference, we recommend installing Visual Studio Code.

1. If not already installed, install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). During installation, you'll be asked to "Configure line ending conversions". IF you are on a Windows machine, select the option "Checkout Windows-style, commit Unix-style line endings". If you are on a Mac, select the option "Checkout as-is, commit Unix-style line endings." This wil ensure cross-platform compatibility.

2. Install nvm. Nvm is used to manage different versions of Node. Nvm for Windows can be found [here](https://github.com/coreybutler/nvm-windows/releases).

3. Use nvm to install the appropriate version of Node by running **nvm install 16.18.0** in a terminal. Then run **nvm use 16.18.0**.

4. Download the code to the directory you wish to use it from. We recommend "C:/src". One of the simplest ways to clone the codebase is to run **git clone https://github.com/cydoc-ai/cydoc_frontend.git**. You will be asked to set up authentication to GitHub as part of this process.

5. Navigate into cydoc_frontend and run **npm install** to install dependencies. You only need to re-run **npm install** if you update package versions or packages used by the project.

6. Run **npm start** to start the project. This will start the project at [http://localhost:3000](http://localhost:3000) (or whichever port you are using). As you make edits to the code, the browser will automatically reload.

7. Install [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related?hl=en) for Chrome. This extension is invaluable for viewing and analyzing Redux state.

## Potential Setup Issues

When attempting step 5, an issue may be encountered, particularly when using an M1 MacBook:
" Error: Cannot find module 'node-darwin-arm64/package.json' "

In the event this occurs, follow the steps outlined in the video linked [here](https://www.youtube.com/watch?v=sZybySiuz6w) and re-attempt to install dependencies.

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
-   😄 No linting errors found for src/pages
-   😄 No linting errors found for src/auth

# Hiding Semantic css build changes

Currently running a build creates uncommitted changes in the semantic build directory. You can prevent git from tracking these changes by running the git ignore script with:

```
npm run "ignore-semantic-changes
```
It is run automatically when semantic is built or the dev server is started (`npm start`)

# Testing with Jest and Enzyme

To get started with testing, in your terminal run these two commands:

```
npm install --save-dev jest
npm install --save-dev enzyme jest-enzyme enzyme-adapter-react-16
```

In your test file (e.g. EditProfile.test.js), include these imports:

```
import React from 'react'
import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import ComponentToBeTested from 'wherever/component/is/located'
```

Also in your test file, include this single line to set up the testing:

```
Enzyme.configure({ adapter: new EnzymeAdapter() })
```

When testing, it will also be common to have this import:

```
import Enzyme, { shallow } from 'enzyme'
```

And this corresponding line of code within a test:

```
const wrapper = shallow(<MyComponent />)
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

To find documentation on testing with Enzyme, go to:
[https://enzymejs.github.io/enzyme/](https://enzymejs.github.io/enzyme/)

For more help check out the following resources:

-   The Udemy course [React Testing with Jest and Enzyme](https://www.udemy.com/course/react-testing-with-jest-and-enzyme/)
-   [Alicia Steiman's notes on this Udemy course](https://drive.google.com/file/d/1BB6xr8zONUKdINGIZk4Zt6rDz_Cfq0cD/view?usp=sharing)
-   [Alicia Steiman's front-end testing instruction video](https://drive.google.com/file/d/1_GTnP3PYZx-tipXoDZQG3Tau8vqFbpje/view?usp=sharing)
