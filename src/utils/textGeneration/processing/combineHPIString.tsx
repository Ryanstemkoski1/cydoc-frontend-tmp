import { splitByPeriod } from '../common/textUtils';

/**
 * Combines sentences from a string based on certain conditions.
 *
 * str: A string containing sentences separated by periods and new lines.
 * n: The number of matching words required to combine sentences (default is 2).
 *
 * 1. Splits the input string into an array of sentences.
 * 2. Iterates through the array to combine sentences based on the `compareAndCombine` function.
 * 3. Handles edge cases like the last sentence and final combination.
 *
 * e.g:
 *   Input = "The patient reports dizziness. The patient reports nausea. The patient is feeling better."
 *   Returns "The patient reports dizziness and nausea. The patient is feeling better."
 */
export const combineHpiString = (str: string) => {
    let newStr = '';
    const stringArr = splitByPeriod(str);
    let tempComb;
    // have to add space at beginning of first string to make comparison work.
    // if the combination is on the final iteration and there isn't two strings to compare, add that string to the end of the current combined.
    for (let i = 0; i < stringArr.length; i++) {
        if (i == stringArr.length - 1) {
            // The last sentences
            tempComb = stringArr[i];
            newStr += stringArr[i];
            return newStr;
        } else if (i === 0) {
            tempComb = compareAndCombine(stringArr[0], stringArr[1]); // TODO: handle new line char, call isCombineable()
        } else tempComb = compareAndCombine(stringArr[i], stringArr[i + 1]); // TODO: handle new line char, call isCombineable()
        // if the combination is on the final iteration and compare(str1, str2) returns an array, combine both and return that str
        if (Array.isArray(tempComb) && i === stringArr.length - 2) {
            newStr += tempComb[0] + tempComb[1];
            return newStr;
        }
        // common case
        if (Array.isArray(tempComb)) {
            newStr += tempComb[0];
            continue;
        } else {
            newStr += tempComb;
            i++;
        }
    }
    return newStr;
};

/**
 * TODO: add more cases to consider
 * A Helper Function to check if a string can be combined based on specific condition.
 *
 * startStr - Indicates if this is the first string in the combination
 *
 * conditions to consider:
 * - Excludes strings with newlines.
 * - Includes strings starting with "The patients reports".
 * - Additional checks (e.g., length, quotation marks) may be added.
 */
function isCombineable(str: string, startStr: boolean = false): boolean {
    // check if the string contains a newline character
    const hasNewLine = str.includes('\n');

    // TODO: check if the string starts with "The patients reports", add more cases if needed.
    const startWithPatterns = str.startsWith('The patients reports');

    // TODO: check the string length, if the string length is too long, do not need combine.
    // const isTooLong = str.length > 100;

    // TODO: check if the string include quotation marks
    const hasQuotationMarks = str.includes('"');

    // if startStr = true && hasNewLine = true -> return false.
    return !hasNewLine && startWithPatterns;
}

/**
 * A Helper Function to compare and combine two sentences if they share a specified
 * number of initial matching words.
 *
 * - Input:
 * - `strA` and `strB`: Sentences to be compared.
 * - `n`: Minimum number of matching initial words required to combine the sentences.
 *
 * - Process:
 *   1. Split `strA` and `strB` into lists of words.
 *   2. Check if they have at least `n` matching initial words.
 *   3. If combining is valid:
 *      - Remove trailing period from `strA` if present.
 *      - Handle cases with connectors (e.g., "and", "but") in `strB`.
 *      - Adjust punctuation based on the presence of "and" after a comma.
 *   4. Ensure the combined string ends with a period.
 *
 * - Output: The combined sentence or the original sentences if combining isn't appropriate.
 */
export function compareAndCombine(strA: string, strB: string, n: number = 2) {
    // Split both strings into lists of words.
    const splitA = strA.split(' ');
    const splitB = strB.split(' ');

    let combinedStr = ''; // String to hold the combined result
    // Count the number of matching words at the beginning of both strings.
    const amtSame = numOfSameWords(splitA, splitB);

    // Return original sentences if conditions are not met
    if (amtSame < n) {
        return [strA, strB];
    }

    // Return original sentences if `strB` contains 'not' or 'denies' after the matching words.
    if (splitB.slice(n).some((word) => word === 'not' || word === 'denies')) {
        return [strA, strB];
    }

    // Remove trailing period from `strA` if present
    const lastWordIndex = splitA.length - 1; // Index of the last element splitA
    const newSplitA = splitA;
    if (splitA[lastWordIndex].endsWith('.')) {
        newSplitA[lastWordIndex] = splitA[lastWordIndex].slice(0, -1);
    }

    // Handle special connector words
    if (
        amtSame > n &&
        ['and', 'but', 'so', 'for', 'with'].includes(splitB[amtSame])
    ) {
        return returnWithConnectorWord(splitA, splitB, amtSame);
    }

    // Check for 'and' following a comma
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
    combinedStr = splitA.join(' ') + (hasAnd ? ',' : ' and');
    // Append the remaining words from splitB starting from the amtSame index.
    combinedStr += ' ' + splitB.slice(amtSame).join(' ').trim();

    // Ensure the combined string ends with a period.
    if (!combinedStr.endsWith('.')) {
        combinedStr += '.';
    }

    return removeDoubleWords(' ' + combinedStr);
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
) => {
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

/**
 * Removes consecutive duplicate words from a string.
 *
 * 1. Splits the string into words.
 * 2. Iterates through the words and keeps only the unique consecutive words.
 * 3. Joins the words back into a single string.
 *
 * e.g.
 * Input = "The patient reports headache headache and chest pain."
 * Return "The patient reports headache and chest pain."
 */
function removeDoubleWords(str: string) {
    const words = str.split(' ');
    const newWords: string[] = [];

    for (let i = 0; i < words.length; i++) {
        if (words[i] !== words[i + 1]) {
            newWords.push(words[i]);
        }
    }

    return newWords.join(' ');
}
