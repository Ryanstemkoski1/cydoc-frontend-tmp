# cydoc-frontend

# Installation

First, install Node. The frontend works with Node.js version 10.1.0. Be sure to use this version of Node; the frontend isn't guaranteed to work with other versions.

Then navigate to the directory where the frontend code is stored, and run:

### `npm install gulp`

Next run

### `npm start`

Finally, open [http://localhost:3000](http://localhost:3000) (or whichever port you are using) to view the app in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

### Additional Useful Commands

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React Documentation](https://reactjs.org/).

# Before Submitting a PR

Before committing changes, please run `npm run lint` to lint.

To fix the linting errors automatically, run `npm run lint fix`.

Then, run `npm run lint` again and manually fix any remaining errors.

Before submitting a PR, `npm run lint` should output the following:

- 😄  No linting errors found for src/index.js
- 😄  No linting errors found for src/contexts
- 😄  No linting errors found for tests
- 😄  No linting errors found for src/components
- 😄  No linting errors found for src/constants
- 😄  No linting errors found for src/pages
- 😄 No linting errors found for src/auth

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
* The Udemy course [React Testing with Jest and Enzyme](https://www.udemy.com/course/react-testing-with-jest-and-enzyme/)
* [Alicia Steiman's notes on this Udemy course](https://drive.google.com/file/d/1BB6xr8zONUKdINGIZk4Zt6rDz_Cfq0cD/view?usp=sharing)
* [Alicia Steiman's front-end testing instruction video](https://drive.google.com/file/d/1_GTnP3PYZx-tipXoDZQG3Tau8vqFbpje/view?usp=sharing)
