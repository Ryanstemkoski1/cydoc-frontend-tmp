/* eslint-disable no-console */
const { spawn } = require('child_process');
const colors = require('colors');

// paths to lint
const indexPath = 'src/index.js';
const contextsPath = 'src/contexts';
const constantsPath = 'src/constants';
const testsPath = 'tests';
const componentsPath = 'src/components';
const pagesPath = 'src/pages';

// lint commands
const index = spawn('eslint', [
    indexPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
]);
const contexts = spawn('eslint', [
    contextsPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
]);
const constants = spawn('eslint', [
    constantsPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
    '--ignore-pattern',
    'src/constants/drug_types.js',
]);
const tests = spawn('eslint', [
    testsPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
]);
const components = spawn('eslint', [
    componentsPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
]);
const pages = spawn('eslint', [
    pagesPath,
    `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`,
]);

// print output for src/index.js lint
index.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${indexPath}: ${data}`
        )
    );
});
index.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${indexPath}: ${data}`));
});
index.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(`😩 error for ${indexPath}: ${error.message}`)
    );
});
index.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${indexPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});

// print output for src/contexts lint
contexts.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${contextsPath}: ${data}`
        )
    );
});
contexts.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${contextsPath}: ${data}`));
});
contexts.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(
            `😩 error for ${contextsPath}: ${error.message}`
        )
    );
});
contexts.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${contextsPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});

// print output for src/constants lint
constants.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${constantsPath}: ${data}`
        )
    );
});
constants.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${constantsPath}: ${data}`));
});
constants.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(
            `😩 error for ${constantsPath}: ${error.message}`
        )
    );
});
constants.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${constantsPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});

// print output for src/tests lint
tests.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${testsPath}: ${data}`
        )
    );
});
tests.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${testsPath}: ${data}`));
});
tests.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(`😩 error for ${testsPath}: ${error.message}`)
    );
});
tests.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${testsPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});

// print output for src/components lint
components.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${componentsPath}: ${data}`
        )
    );
});
components.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${componentsPath}: ${data}`));
});
components.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(
            `😩 error for ${componentsPath}: ${error.message}`
        )
    );
});
components.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${componentsPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});

// print output for src/pages lint
pages.stdout.on('data', (data) => {
    console.log(
        colors.bold.red(
            `🥺 Please fix the following linting errors for ${pagesPath}: ${data}`
        )
    );
});
pages.stderr.on('data', (data) => {
    console.log(colors.red(`😩 stderr for ${pagesPath}: ${data}`));
});
pages.on('error', (error) => {
    console.log(
        colors.bold.bgRed.black(`😩 error for ${pagesPath}: ${error.message}`)
    );
});
pages.on('close', (code) => {
    if (code === 0) {
        console.log(
            colors.green(`😄 No linting errors found for ${pagesPath}`)
        );
    } else {
        console.log(`child process exited with code ${code}`);
    }
});
