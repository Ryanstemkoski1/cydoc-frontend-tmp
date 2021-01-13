/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const colors = require('colors');

// flag for automatic fixing
const fix = `${process.argv[2] && process.argv[2] === 'fix' ? '--fix' : ''}`;

// flag for failure of lint checks
let failed = false;

// paths to lint
const indexPath = 'src/index.js';
const contextsPath = 'src/contexts';
const constantsPath = 'src/constants';
const testsPath = 'tests';
const componentsPath = 'src/components';
const pagesPath = 'src/pages';

function runLint(path, args = []) {
    const lintProcess = spawnSync('eslint', [path, fix, ...args]);

    // print output
    if (lintProcess.stdout.length > 0) {
        console.log(
            colors.bold.red(
                `🥺 Please fix the following linting errors for ${path}: ${lintProcess.stdout}`
            )
        );
    }
    if (lintProcess.stderr.length > 0) {
        console.log(colors.red(`😩 stderr for ${path}: ${lintProcess.stderr}`));
    }
    if (lintProcess.error) {
        console.log(
            colors.bold.bgRed.black(
                `😩 error for ${path}: ${lintProcess.error.message}`
            )
        );
    }

    if (lintProcess.status === 0) {
        console.log(colors.green(`😄 No linting errors found for ${path}`));
    } else {
        console.log(`child process exited with code ${lintProcess.status}`);
        failed = true;
    }
}

// lint commands
runLint(indexPath);
runLint(contextsPath);
runLint(constantsPath, ['--ignore-pattern', 'src/constants/drug_types.js']);
runLint(testsPath);
runLint(componentsPath);
runLint(pagesPath);

if (failed) {
    process.exit(1);
} else {
    process.exit(0);
}
