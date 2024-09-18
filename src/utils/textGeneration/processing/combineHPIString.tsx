import { splitByPeriod } from '../common/textUtils';

/**
 * Combines sentences from a string based on certain conditions.
 *
 * str: A string containing sentences separated by periods and new lines.
 * n: The number of matching words required to combine sentences (default is 2).
 *
 * 1. Splits the input string into an array of sentences using the `splitByPeriod` function (retain period and new line).
 * 2. Iterates through the array, attempting to combine adjacent sentences using the `compareAndCombine` function.
 * 3. Handles special cases like the last sentence and ensures proper spacing and line breaks are maintained.
 *
 * e.g:
 *   Input = "The patient reports dizziness. The patient reports nausea. The patient is feeling better."
 *   Returns "The patient reports dizziness and nausea. The patient is feeling better."
 */
export const combineHpiString = (str: string) => {
    let newStr = '';
    const stringArr = splitByPeriod(str, true);
    let tempComb: string | string[];
    // Iterate through the array of sentences
    for (let i = 0; i < stringArr.length; i++) {
        // Last sentence: append it directly
        if (i == stringArr.length - 1) {
            tempComb = stringArr[i];
            newStr += stringArr[i];
            return newStr;
        } else {
            // Attempt to combine the current sentence with the next one
            tempComb = compareAndCombine(stringArr[i], stringArr[i + 1]);
            const hasNewLineAtTheEnd = stringArr[i + 1].includes('\n');

            // If it's the second-to-last iteration and combine failed, append both sentences
            if (Array.isArray(tempComb) && i === stringArr.length - 2) {
                newStr += stringArr[i] + stringArr[i + 1];
                return newStr;
            }
            // If sentences can't be combined, append the current sentence with a space
            if (Array.isArray(tempComb)) {
                newStr += stringArr[i] + ' ';
                continue;
            } else {
                // If sentences are combined, append the result
                newStr += tempComb;
                // Re-add a newline character if the next sentence had one
                newStr = hasNewLineAtTheEnd ? newStr + '\n' : newStr;
                // Skip the next sentence since it was combined with the current one
                i++;
            }
        }
    }
    return newStr;
};

/**
 * A Helper Function to compare and combine two sentences if they share a specified
 * number of initial matching words.
 *
 * - Input:
 * - `strA` and `strB`: Sentences to be compared.
 * - `n`: Minimum number of matching initial words required to combine the sentences.
 *
 * Process:
 * 1. Split both sentences into words.
 * 2. Check if they have at least `n` matching initial words using `isCombineable`.
 * 3. If combinable:
 *    - Remove the trailing period from `strA` if present.
 *    - Handle special connector words in `strB` (e.g., "and", "but").
 *    - Adjust for cases where "and" follows a comma in `strA`.
 * 4. Ensure the combined sentence ends with a period and remove any duplicate words.
 */
export function compareAndCombine(strA: string, strB: string, n: number = 3) {
    const combineCheckResult = isCombineable(strA, strB, n);

    if (!combineCheckResult) {
        return [strA, strB];
    }

    const { splitA, splitB, amtSame } = combineCheckResult;

    // Remove trailing period from `strA` if present
    const lastWordIndex = splitA.length - 1; // Index of the last element splitA
    const newSplitA = splitA;
    if (splitA[lastWordIndex].endsWith('.')) {
        newSplitA[lastWordIndex] = splitA[lastWordIndex].slice(0, -1);
    }

    // Handle special connector words in `strB`
    if (['and', 'but', 'so', 'for', 'with'].includes(splitB[amtSame])) {
        return returnWithConnectorWord(splitA, splitB, amtSame);
    }

    // TODO: Handle [A and B] + [C and D]

    // Check for 'and' following a comma in `strA`
    const searchFrom = splitA.length > 4 ? 5 : 4; // Determines how far back to search
    let hasAnd = false; // Flag to indicate if "and" was found after a comma in the first string.
    for (let i = splitA.length - searchFrom; i < splitA.length; i++) {
        if (splitA[i].includes(',') && splitA[i + 1] === 'and') {
            hasAnd = true;
            splitA.splice(i + 1, 1); // Remove 'and'
            break;
        }
    }
    // Build the combined string
    let combinedStr = splitA.join(' ') + (hasAnd ? ',' : ' and');
    // Append the remaining words from splitB starting from the amtSame index.
    combinedStr += ' ' + splitB.slice(amtSame).join(' ');
    // Ensure the combined string ends with a period.
    if (!combinedStr.endsWith('.')) {
        combinedStr += '.';
    }

    return ' ' + combinedStr;
}

/**
 * TODO: add more cases to consider
 * A Helper Function to determine if two strings can be combined based on specific conditions.
 *
 * startStr - Indicates if this is the first string in the combination
 *
 * Conditions:
 * - Strings must start with at least `n` matching words.
 * - Excludes strings containing newline characters.
 * - Returns null if `strB` contains the words 'not' or 'denies' after the matching words.
 * - Future enhancements may include additional checks (e.g., specific phrases, string length).
 */
function isCombineable(strA: string, strB: string, n: number = 3) {
    // Split both strings into words, trimming any leading/trailing spaces.
    const splitA = strA.trim().split(' ');
    const splitB = strB.trim().split(' ');

    // Count the number of matching words at the beginning of both strings.
    const amtSame = numOfSameWords(splitA, splitB);

    // Return null if there are not enough matching words.
    if (amtSame === 0 || amtSame < n) {
        return null;
    }

    // Return null if strB contains 'not' or 'denies' after the matching words.
    if (splitB.slice(n).some((word) => word === 'not' || word === 'denies')) {
        return null;
    }

    // Return null if strA contains a newline character.
    if (strA.includes('\n')) {
        return null;
    }

    // Other cases
    // // TODO: check if the specific string starts with "The patients reports", add more cases if needed.
    // const startWithPatterns = str.startsWith('The patients reports');
    // // TODO: check the string length, if the string length is too long, do not need combine.
    // // const isTooLong = str.length > 100;

    // Return the results if the strings are combinable.
    return {
        splitA,
        splitB,
        amtSame,
    };
}

/**
 * A Helper function to count the number of matching words from the beginning of
 * two arrays of words.
 */
const numOfSameWords = (splitA: string[], splitB: string[]): number => {
    let amtSame = 0;
    // Determine the length of the shorter string to avoid out-of-bounds errors
    const shorterStrLen =
        splitA.length > splitB.length ? splitB.length : splitA.length;

    // Compate words from both strings, increment amtSame if they match.
    for (let i = 0; i < shorterStrLen; i++) {
        // remove period at the end if present
        let wordA = splitA[i];
        let wordB = splitB[i];

        // Remove trailing period if present
        if (wordA.endsWith('.')) {
            wordA = wordA.slice(0, -1); // remove period
        }
        if (wordB && wordB.endsWith('.')) {
            wordB = wordB.slice(0, -1); // remove period
        }

        // If the words do not match, stop the comparison
        if (wordA !== wordB) {
            break;
        } else {
            amtSame++; // Increment the count of matching words
        }
    }
    return amtSame;
};

/**
 * A Helper Function to combine two arrays of strings into a single sentence with
 * specific formatting and punctuation rules.
 *
 * e.g.
 * splitA = ["The", "patient", "monitors", "dizziness", "their", "blood", "sugar"]
 * splitB = ["The", "patient", "monitors", "dizziness", "their", "blood", "sugar", "with", "a", "continous", "glucose", "monitor"]
 * n = 3
 * Result: " The patient monitors their blood sugar with a continuous glucose monitor."
 */
const returnWithConnectorWord = (
    stringA: Array<string>,
    stringB: Array<string>,
    n: number
): string => {
    stringA.unshift('');
    const combinedArray = stringA;
    stringB = stringB.slice(n, stringB.length);
    const sentence = combinedArray.join(' ');
    const combinedSentence = sentence.concat(' ', stringB.join(' '));
    const sentenceWithPeriod = combinedSentence.endsWith('.')
        ? combinedSentence
        : combinedSentence + '.';
    return sentenceWithPeriod;
};
