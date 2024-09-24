import { splitByPeriod } from 'utils/textGeneration/common/textUtils';
import { HPI } from '../extraction/extractHpi';

/**
 * Processes fill sentences by inserting answers and negAnswers:
 * 1. Sorts numeric keys from the HPI object.
 * 2. For each key:
 *    - Cleans fillSentence, answer, and negAnswer.
 *    - Replaces 'ANSWER' and 'NOTANSWER' placeholders based on their values.
 *    - Replaces 'PARAGRAPHBREAK' with a new line.
 * 3. Combines and returns the processed sentences.
 * 4. Handle the incorrect combined puncturation in the fillSentence.
 */
export const fillAnswers = (hpi: HPI): string => {
    const sortedKeys: number[] = Object.keys(hpi).map((val) => parseInt(val));
    // JS sorts numbers lexicographically by default
    sortedKeys.sort((lhs, rhs) => lhs - rhs);

    let hpiString = '';
    sortedKeys.forEach((key) => {
        let [fillSentence, answer, negAnswer] = hpi[key] || hpi[key.toString()];
        answer = fullClean(answer);
        negAnswer = fullClean(negAnswer);
        fillSentence = fullClean(fillSentence);

        // 1. Handle the 'ANSWER' placeholder
        if (!answer.length)
            // If there's no answer, remove 'ANSWER' from the fillSentence
            fillSentence = removeSentence(fillSentence, 'ANSWER');
        else if (answer === 'all no') {
            // If the answer is 'all no', keep everything after 'ANSWER_'.
            // e.g. 'Question 6 reports ANSWER. Question 6 denies NOTANSWER.' --> 'Question 6 denies NOTANSWER.'
            fillSentence = fillSentence.substring(
                fillSentence.indexOf('ANSWER') + 7
            );
        } else if (fillSentence.match(/ANSWER/)) {
            // Replace 'ANSWER' with the cleaned answer
            fillSentence = fillSentence.replace(
                /ANSWER/,
                putQuotesAroundFirstPerson(answer, fillSentence)
            );
        }

        // 2. Handle the 'NOTANSWER' placeholder
        if (!negAnswer.length)
            // If there's no negAnswer, remove 'NOTANSWER' from the fillSentence
            fillSentence = removeSentence(fillSentence, 'NOTANSWER');
        else if (fillSentence.match(/NOTANSWER/)) {
            // Replace 'NOTANSWER' with the cleaned negAnswer
            fillSentence = fillSentence.replace(/NOTANSWER/, negAnswer);
        }

        // 3. Handle 'PARAGRAPHBREAK' token
        fillSentence = fillSentence.replace(/PARAGRAPHBREAK/g, '\n\n');

        // 4. Handle the incorrect combined puncturation in the fillSentence.
        fillSentence = handleCombinedPunctuation(fillSentence);

        // Combines all fillSentence
        hpiString += `${fillSentence} `;
    });
    return hpiString;
};

/**
 * A Helper Function to clean and formats a sentence by managing unexpected whitespace.
 * - Condense multiple spaces into a single space.
 * - Trim leading and trailing whitespace.
 *
 * e.g. Input:  "  This month is may. The lesion measures:      2.5cm.  "
 *      Output: "This month is May. The lesion measures 2.5cm."
 *
 * Used in fillAnswers.
 */
export const fullClean = (sentence: string): string => {
    // Condense multiple spaces into a single space
    sentence = sentence.split(/\s+/).join(' ');
    // Trim leading and trailing whitespace.
    sentence = sentence.trim();
    return sentence;
};

/**
 * A Helper Function to filter sentences so that only those that don't have the keyword are kept in
 * (unless both 'ANSWER' and 'NOTANSWER' are in it)
 *
 * e.g.
 * keyword = 'NOTANSWER'
 * text = "Thought content, as expressed through their speech, revealed
 *         ANSWER thought processes. There was no evidence of NOTANSWER
 *         or other formal thought disturbance."
 * return text = "Thought content, as expressed through their speech,
 *         revealed ANSWER thought processes."
 *
 * Used in fillAnswers.
 */
const removeSentence = (fillSentence: string, keyword: string): string => {
    const containsBoth = (sentence: string): boolean =>
        /\bANSWER\b/.test(sentence) && /\bNOTANSWER\b/.test(sentence);
    // Split by period followed by a space but retain the periods in the result
    return splitByPeriod(fillSentence)
        .filter(
            (sentence) =>
                // Keep the sentence if it doesn't contain the keyword or if
                // it contains both 'ANSWER' and 'NOTANSWER'
                !sentence.match(new RegExp(keyword) || containsBoth(sentence))
        )
        .join(' ');
};

/**
 * A Helper Function to check if the sentence contains keyword 'ANSWER' and
 * the key word "ANSWER" appears within quotation marks in a sentence, then
 * return false.
 */
export const isAnswerWithinQuotes = (sentence: string): boolean => {
    const regex = /"[^"]*"/g; // Match text within quotation marks
    let match: RegExpExecArray | null;

    while ((match = regex.exec(sentence)) !== null) {
        if (match[0].includes('ANSWER')) {
            // "ANSWER" is found within quotation marks
            return true;
        }
    }

    return false;
};

/**
 * A Helper Function to check if string has I in it, if so, returns it with quotes around.
 *
 * NOTE: If `fillSentence` contains the keyword 'ANSWER' and is within quotation marks
 * (determined by `isAnswerWithinQuotes`), only capitalizes "i" and trims spaces.
 * Otherwise, if "I" is present and `fillSentence` is not in quotes, adds quotes
 * around the string, capitalizes "i", and trims spaces.
 * e.g. ' I love my cat. ' --> '"I love my cat."'
 *
 * Used in fillAnswers.
 */
const putQuotesAroundFirstPerson = (
    str: string,
    fillSentence: string
): string => {
    str = ' ' + str + ' ';
    //Check if keyword 'ANSWER' in the fillSentence is within quotation marks
    // not need to add quotation marks.
    if (isAnswerWithinQuotes(fillSentence)) {
        return str.includes(' i ') || str.includes(' I ')
            ? str.replace(/ i /, ' I ').trim()
            : str.trim();
    }
    return str.includes(' i ') || str.includes(' I ')
        ? '"' + str.replace(/ i /, ' I ').trim() + '"'
        : str.trim();
};

/**
 * A Helper Function to capitalizes specific terms from ETHNICITY and MONTHS arrays in the input.
 *
 * Used in fillAnswers.
 */
export const uppercaseEthnicityAndMonths = (str: string): string => {
    const ETHNICITY = ['Hispanic', 'Latino'];
    const MONTHS = [
        'January',
        'Jan',
        'February',
        'Feb',
        'March',
        'Mar',
        'April',
        'Apr',
        'May',
        'June',
        'Jun',
        'July',
        'Jul',
        'August',
        'Aug',
        'September',
        'Sep',
        'Sept',
        'October',
        'Oct',
        'November',
        'Nov',
        'December',
        'Dec',
    ];

    // Don't want ethnicity or months to ever show up as lowercase, so this
    // code ensures that they will be uppercased if needed.
    [...ETHNICITY, ...MONTHS].forEach((item) => {
        if (str.match(new RegExp(`\\b${item}\\b`, 'ig'))) {
            str = str.replace(new RegExp(item, 'ig'), ' ' + item);
        }
    });
    return str;
};

/**
 * A Helper Function to resolve incorrect combined punctuation (e,g ',.' or '!.')
 */
const handleCombinedPunctuation = (text: string): string => {
    // Regex to find incorrect combined punctuation
    const regex = /([,.!?])([,.!?])/g;
    text = text.replace(regex, (match, p1, p2) => {
        // p1 is the first punctuation mark, p2 is the second one
        return `${p2}`;
    });
    return text;
};
