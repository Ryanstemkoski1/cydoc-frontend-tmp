import { splitByPeriod } from 'utils/textGeneration/common/textUtils';

/**
 * This interface represents a collection of HPI entities.
 *
 * Keys: Integers representing the display order of answers.
 * Values: Tuples with three elements:
 *  - The fill-in-the-blank sentence.
 *  - The patient's answer.
 *  - An optional negated or alternative answer (usually empty).
 *
 * for yes/no questions, we only need the fill in the blank phrase for the
 * answer they gave, and the patient's answer can be the empty string
 *
 * Example:
 * - Key `0` with value `['MENTAL STATUS EXAMINATION: Patient was oriented to
 *                        ANSWER. Patient was not oriented to NOTANSWER.',
 *                        'person',
 *                        'place']`
 *   - Fill-in-the-blank sentence: 'MENTAL STATUS EXAMINATION: Patient was
 *                  oriented to ANSWER. Patient was not oriented to NOTANSWER.'
 *   - Selected answer: 'person'
 *   - Negated answer: 'place'
 *
 * Later on, the selected answer (which was an answer that was clicked or
 * marked Yes) will be inserted in place of the ANSWER token, while the
 * negated answer if present (which was an answer marked No) will be inserted
 * in place of the NOTANSWER token.
 *
 * Usage: 'fillAnswers'
 */
export interface HPI {
    [questionOrder: number]: [string, string, string];
    [questionOrder: string]: [string, string, string];
}

/**
 * A Helper Function to clean and formats a sentence by managing unexpected whitespace.
 * - Condense multiple spaces into a single space.
 * - Trim leading and trailing whitespace.
 *
 * e.g. Input:  "  This month is may. The lesion measures:      2.5cm.  "
 *      Output: "This month is May. The lesion measures 2.5cm."
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
 * A Helper Function to check if string has I in it, if so, returns it with quotes around.
 * e.g. ' I love my cat. ' --> '"I love my cat."'
 */
const putQuotesAroundFirstPerson = (str: string): string => {
    str = ' ' + str + ' ';
    return str.includes(' i ') || str.includes(' I ')
        ? '"' + str.replace(/ i /, ' I ').trim() + '"'
        : str.trim();
};

/**
 * A Helper Function to capitalizes specific terms from ETHNICITY and MONTHS arrays in the input.
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
 * Processes fill sentences by inserting answers and negAnswers:
 * 1. Sorts numeric keys from the HPI object.
 * 2. For each key:
 *    - Cleans fillSentence, answer, and negAnswer.
 *    - Replaces 'ANSWER' and 'NOTANSWER' placeholders based on their values.
 *    - Replaces 'PARAGRAPHBREAK' with a new line.
 * 3. Combines and returns the processed sentences.
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
                putQuotesAroundFirstPerson(answer)
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
        fillSentence = fillSentence.replace(/PARAGRAPHBREAK/g, '\n');

        // 4. Handle 'HYPERLINK'
        if (fillSentence.includes('HYPERLINK')) {
            console.log('Hello, this is HYPERLINK');
        }

        // Combines all fillSentence
        hpiString += `${fillSentence} `;
    });
    return hpiString;
};
