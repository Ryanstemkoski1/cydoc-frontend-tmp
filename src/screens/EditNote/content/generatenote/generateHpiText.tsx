import { PART_OF_SPEECH_CORRECTION_MAP } from '@constants/hpiTextGenerationMapping';
import { PatientPronouns } from '@constants/patientInformation';
import { ABBREVIFY, MEDICAL_TERM_TRANSLATOR } from '@constants/word-mappings';

/**
 * This interface represents a collection of HPI enties.
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
 * - Key `0` with value `['MENTAL STATUS EXAMINATION: Patient was oriented to ANSWER. Patient was not oriented to NOTANSWER.', 'person', 'place']`
 *   - Fill-in-the-blank sentence: 'MENTAL STATUS EXAMINATION: Patient was oriented to ANSWER. Patient was not oriented to NOTANSWER.'
 *   - Patient's answer: 'person'
 *   - Negated answer: 'place'
 *
 * Usage: 'fillAnswers', 'createInitialHPI'
 */
export interface HPI {
    [questionOrder: number]: [string, string, string];
    [questionOrder: string]: [string, string, string];
}

/** Patient's display name in the note */
interface PatientDisplayName {
    name: string;
    pronouns: PatientPronouns;
    subPronoun: string; // she, he, they
    posAdjective: string; // her, his, their
    objPronoun: string; // her, him, them
    posPronoun: string; // hers, his, theirs
    refPronoun: string; // herself, himself, themselves
}

// Capitalizes specific terms from ETHNICITY and MONTHS arrays in the input string.
export const selectivelyUppercase = (str: string): string => {
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

// Checks if string has I in it, if so, returns it with quotes around.
// e.g. ' I love my cat. ' --> '"I love my cat."'
const stringHasI = (str: string): string => {
    str = ' ' + str + ' ';
    return str.includes(' i ') || str.includes(' I ')
        ? '"' + str.replace(/ i /, ' I ').trim() + '"'
        : str.trim();
};

/**
 * Filter sentences so that only those that don't have the keyword are kept in (unless both 'ANSWER' and 'NOTANSWER' are in it)
 *
 * e.g.
 * keyword = 'NOTANSWER'
 * text = "Thought content, as expressed through their speech, revealed ANSWER thought processes. There was no evidence of NOTANSWER or other formal thought disturbance."
 * return text = "Thought content, as expressed through their speech, revealed ANSWER thought processes."
 */
const removeSentence = (fillSentence: string, keyword: string): string => {
    const containsBoth = (sentence: string): boolean =>
        /\bANSWER\b/.test(sentence) && /\bNOTANSWER\b/.test(sentence);
    // Split by period followed by a space but retain the periods in the result
    return splitByPeriod(fillSentence)
        .filter(
            (sentence) =>
                // Keep the sentence if it doesn't contain the keyword or if it contains both 'ANSWER' and 'NOTANSWER'
                !sentence.match(new RegExp(keyword) || containsBoth(sentence))
        )
        .join(' ');
};

/**
 * A Helper function to Remove punctuation except periods (.), commas (,), forward slashes (/),
 * apostrophes ('), colons (:), hyphens (-), and parentheses (()).
 *
 * TODO: This function maintains the previous logic, should it consider double quotation marks (")?
 */
export const retainAllowedPunctuation = (str: string): string => {
    return str.replace(/[^\w\s'.,:/@()-]/g, '');
};

/**
 * Cleans and formats a sentence by managing unexpected whitespace.
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

// A Helper Function to generate a title prefix for the given lastname based on the specified pronoun.
const generateTitleWithName = (name: string, subPronoun: string) => {
    return subPronoun === 'he'
        ? `Mr. ${name}`
        : subPronoun === 'she'
          ? `Ms. ${name}`
          : `Mx. ${name}`;
};

/**
 * A Helper Function is part of 'fillNameAndPronouns' and retain the previous logic involving the boolean flags toggle.
 * - Replace "[t]he patient's" and "[t]heir" with the patient's possessive adjective (e.g: 'her', 'his', 'them')
 * - Replace "[t]he patient|[patient]" with "she/he/they/name". (e.g., "Ms. Smith" or "she" or "he" or "they").
 */
const replacePatientPronounsOrName = (
    patientRegex: RegExp,
    sentence: string,
    name: string,
    subPronoun: string,
    posAdjective: string,
    toggle: number
): string => {
    // Replace "[t]he patient's" and "[t]heir" with given posAdjective.
    sentence = name
        ? sentence.replace(/\bthe patient's\b|\btheir\b/g, posAdjective)
        : sentence;

    // replace "[t]he patient|[patient]" with "she/he/they/name".
    if (name) {
        sentence = toggle
            ? sentence.replace(
                  patientRegex,
                  generateTitleWithName(name, subPronoun)
              )
            : sentence.replace(patientRegex, (match) =>
                  replaceWordCaseSensitive(match, subPronoun)
              );
    } else {
        sentence = toggle
            ? sentence
            : sentence.replace(patientRegex, (match) =>
                  replaceWordCaseSensitive(match, subPronoun)
              );
    }
    return sentence;
};

/**
 * A Helper Function updates pronouns in the sentence to match the given pronoun's set of forms. It handles:
 * - Replaces subject, object, possessive, and reflexive pronouns.
 * - Handles special cases like "her" and plural possessives.
 *
 * Parameters:
 * - `sentence` (string): The text with pronouns to replace.
 * - `pronounPack` (string[]): Pronoun forms [subject, object, possessive adjectives, reflexive, possessive pronoun].
 *
 */
const replacePronouns = (sentence: string, pronounPack: string[]) => {
    const [subPronoun, objPronoun, posAdjective, refPronoun, posPronoun] =
        pronounPack;

    // Replace pronouns in the senetence
    sentence = sentence.replace(/\b(he|she|they)\b/gi, (match) =>
        replaceWordCaseSensitive(match, subPronoun)
    );
    sentence = sentence.replace(/\b(him|them)\b/gi, (match) =>
        replaceWordCaseSensitive(match, objPronoun)
    );
    sentence = sentence.replace(/\b(?:his|their)\b/gi, (match) =>
        replaceWordCaseSensitive(match, posAdjective)
    );
    // Handle special cases for 'her' to avoid wrong replacement
    sentence = sentence.replace(/\bher\b\s+(\b\w+\b)/gi, (match, noun) => {
        return noun
            ? replaceWordCaseSensitive(match, posAdjective + ` ${noun}`)
            : replaceWordCaseSensitive(match, objPronoun);
    });

    sentence = sentence.replace(
        /\bher\b(?=\s*\b(?:\w|[a-zA-Z])\b)/gi,
        (match) => replaceWordCaseSensitive(match, posAdjective)
    );

    // Handle "theirs" and "hers" plural
    sentence = sentence.replace(/\b(hers|theirs)\b/gi, (match) =>
        replaceWordCaseSensitive(match, posPronoun)
    );

    sentence = sentence.replace(/\b(himself|herself|themselves)\b/gi, (match) =>
        replaceWordCaseSensitive(match, refPronoun)
    );

    return sentence;
};

const PART_OF_SPEECH_CORRECTION_MAP_FIRST_COLUMN = [
    ...PART_OF_SPEECH_CORRECTION_MAP.keys(),
];

/**
 * TODO: consider other cases [!?.]
 * Splits a string into sentences based on periods followed by whitespace.
 *
 * - By default, uses regex to split on periods followed by one or more whitespace characters.
 * - If `flag` is true, splits on periods followed by whitespace while preserving [NEW LINE] characters.
 *
 * Examples:
 * const text = `Hello. My name is Mr. Huang.
 *  I work at Ms. Rachel's company.
 *  How can I assist you today?`;
 *
 * - Default: ["Hello.", "My name is Mr. Huang.", "I work at Ms.Rachel's company.", "How can I assist you today?"]
 * - With flag: ["Hello. ", "My name is Mr. Huang.\n", "    I work at Ms.Rachel's company.\n", "    How can I assist you today?\n"]
 */
export const splitByPeriod = (str: string, flag?: boolean) => {
    // Remove spaces after titles for processing
    str = str.replace(/(Mr\.|Mx\.|Ms\.)\s+/g, '$1');
    // Split the string by '. ' or '.\n', but not after titles if flag is true
    const strArr = flag ? str.split(/(?<=\.\s)/) : str.split(/(?<=\.)\s+/);
    // Re-add spaces after titles
    const result = strArr.map((sentence) => {
        return sentence.replace(/^(Mr\.|Mx\.|Ms\.)\s*/, '$1 ');
    });
    return result;
};

// A Helper Function to capitalize FirstLetter.
export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// A Helper Function to capitalize the first letter of each word in the sentence,
// ensuring that all other letters are in lowercase.
export function capitalizeWords(str: string) {
    return str
        .toLowerCase() // Convert the entire sentence to lowercase first
        .split(' ') // Split the sentence into words
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(' ');
}

// A Helper Function to capitalizes the replacement word if the original word starts with an uppercase letter.
const replaceWordCaseSensitive = (word: string, replace: string) => {
    return /^[A-Z]/.test(word.trim())
        ? capitalizeFirstLetter(replace)
        : replace;
};

/**
 * A Helper Function is designed to replace specific words in a string with new words based on a given mapping,
 * while also handling punctuation and sentence boundaries.
 *
 * Usage: fillMedicalTerms, abbreviate
 */
const replaceMappedWords = (
    hpiString: string,
    mapping: { [key: string]: string }
): string => {
    const END_OF_SENTENCE_PUNC = '.!?';
    Object.entries(mapping).forEach(([key, value]) => {
        hpiString = hpiString.replace(
            new RegExp(`\\b${key}([\b${END_OF_SENTENCE_PUNC},:]?)`),
            `${value}$1`
        );
    });
    return hpiString;
};

// Constant list of phrases to remove from the text.
const phrasesToRemove = [
    'The patient has been ',
    'The patient has ',
    'The patient is ',
    'The patients ',
    'The patient ',
    "The patient's ",
    'He ',
    'She ',
    'They ',
];

/**
 * Function to remove specified phrases from provided text.
 * It addresses cut-offs at the beginning for non-advanced reports.
 */
function removePhrases(text: string): string {
    // TODO: Replace the title with 'The patient', to ensure remove the title with lastname. However, it might not need.
    // text = text? text.replace(/\b(Ms\.|Mr\.|Mx\.)\s+[A-Za-z]+\b/g, 'The patient') : '';
    let modifiedText = ' ' + text + ' '; // Padding with spaces
    phrasesToRemove.sort((a, b) => b.length - a.length); // Sorting phrases by length, longest first
    phrasesToRemove.forEach((phrase) => {
        modifiedText = modifiedText.replace(
            new RegExp(`\\b${phrase}\\b`, 'g'),
            ''
        );
    });
    return modifiedText; // Remove the added spaces
}

/**
 * Capitalizes the first letter of each sentence and the standalone 'i' in the text.
 *
 * - Replaces standalone 'i' with 'I' to ensure proper capitalization.
 * - Capitalizes the first letter of the entire string if it's not empty.
 * - Capitalizes the first letter of each sentence following punctuation marks (.!?).
 * - Capitalizes the first letter following a colon when used in headings.
 * */
export const capitalize = (hpiString: string): string => {
    // replace 'i' with I
    hpiString = hpiString.replace(
        /(^|\s|\b)i(\s|$|\b)/g,
        (match, p1, p2) => p1 + 'I' + p2
    );
    // Capitalize the very first letter of the string
    if (hpiString.length > 0) {
        hpiString = capitalizeFirstLetter(hpiString);
    }
    // Capitalize the first letter of each sentence after each [.?!]
    hpiString = hpiString.replace(
        /([.?!])\s*([a-z])/g,
        (match, p1, p2) => `${p1} ${p2.toUpperCase()}`
    );
    // replace to capitalize the word after heading ends with ':'
    hpiString = hpiString.replace(/:\s+(\w)/g, (match, p1) => {
        return `: ${capitalizeFirstLetter(p1)}`;
    });
    return hpiString;
};

// TODO: A Helper function to convert a verb into its third-person singular form. [NEW]
// resource: https://road2english2.blogspot.com/2018/12/spelling-rules-for-present-simple-third.html
function getThirdPersonSingularForm(verb: string) {
    // Regular expression patterns for different cases
    const endWithS = /[sxz]$/;
    const endWithShCh = /(sh|ch)$/;
    const endWithY = /[^aeiou]y$/;
    const endWithO = /o$/;
    // Handle verbs ending in -s, -x, -z, -sh, -ch
    if (endWithS.test(verb) || endWithShCh.test(verb)) {
        return verb + 'es';
    }
    // Handle verbs ending in consonant + -y
    if (endWithY.test(verb)) {
        return verb.slice(0, -1) + 'ies';
    }
    // Handle verbs ending in -o
    if (endWithO.test(verb)) {
        return verb + 'es';
    }
    // Handle all other verbs
    return verb + 's';
}

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
            fillSentence = fillSentence.replace(/ANSWER/, stringHasI(answer));
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

        // Combines all fillSentence
        hpiString += `${fillSentence} `;
    });
    return hpiString;
};

/**
 * Configures the patient's name and pronouns for display.
 *
 * Returns:
 * - An object containing:
 *   - `name`: Capitalized patient's name.
 *   - `pronouns`: The selected pronouns.
 *   - `subPronoun`: The subject pronouns (e.g., 'she', 'he', 'they').
 *   - `posAdjective`: The possessive adjective (e.g., 'her', 'his', 'their').
 *   - `objPronoun`: The object pronouns (e.g., 'her', 'him', 'them').
 *   - `posPronoun`: The possessive pronoun (e.g., 'hers', 'his', 'theirs').
 *   - `refPronoun`: The reflexive pronoun (e.g., 'herself', 'himself', 'themselves').
 */
export const definePatientNameAndPronouns = (
    patientName: string,
    pronouns: PatientPronouns
): PatientDisplayName => {
    // define pronouns
    let subPronoun: string = 'they';
    let posAdjective: string = 'their';
    let objPronoun: string = 'them';
    let posPronoun: string = 'theirs';
    let refPronoun: string = 'themselves';
    if (pronouns === PatientPronouns.She) {
        subPronoun = 'she';
        posAdjective = 'her';
        objPronoun = 'her';
        posPronoun = 'hers';
        refPronoun = 'herself';
    } else if (pronouns === PatientPronouns.He) {
        subPronoun = 'he';
        posAdjective = 'his';
        objPronoun = 'him';
        posPronoun = 'his';
        refPronoun = 'himself';
    }
    return {
        name: capitalizeFirstLetter(patientName),
        pronouns,
        subPronoun,
        posAdjective,
        objPronoun,
        posPronoun,
        refPronoun,
    };
};

/**
 * Replaces PAI-specific terms with standard equivalents:
 *
 * The Personality Assessment Inventory (PAI) uses "respondent" and "the client's"
 * instead of "patient" and "the patient's," and "he/she" instead of "patient."
 *
 * Perform the following string replacements before inserting name and pronouns:
 * Replace "respondent" with "patient" | Replace "the client's" with "the patient's" |
 * Replace "he/she" with "patient" (as in literally the strong "he/she" with the slash included, needs to be changed to "patient")
 *
 * other case: Replaces "him/her" with 'them'.
 */
export const fillPatientPronoun = (hpiString: string) => {
    hpiString = hpiString.replace(/\brespondent/gi, (match) =>
        replaceWordCaseSensitive(match, 'patient')
    );
    hpiString = hpiString.replace(/\bclient/gi, (match) =>
        replaceWordCaseSensitive(match, 'patient')
    );
    hpiString = hpiString.replace(/he\/she/gi, (match) =>
        replaceWordCaseSensitive(match, 'patient')
    );

    // Replace "him/her" with "them"
    hpiString = hpiString.replace(/him\/her/gi, (match) =>
        replaceWordCaseSensitive(match, 'them')
    );

    return hpiString;
};

/**
 * Returns modified hpiString such that:
 * - Replaces "the patient's" and "their" with the patient's possessive adjective (e.g., "her").
 * - Replaces "the patient" with the patient's name or subject pronoun (e.g., "Ms. Smith" or "she").
 * - Handles special cases for pronouns, including alternating replacements and updating various pronouns.
 */
export const fillNameAndPronouns = (
    hpiString: string,
    patientInfo: PatientDisplayName
): string => {
    const {
        name,
        pronouns,
        subPronoun,
        posAdjective,
        objPronoun,
        posPronoun,
        refPronoun,
    } = patientInfo;

    const pronounPack = [
        subPronoun,
        objPronoun,
        posAdjective,
        refPronoun,
        posPronoun,
    ];

    let toggle = 1; // change this so that it gets replaced at random rather than alternating.

    // Split the hpiString by periods while retaining the periods. [consider 'NEW LINE']
    // If patient's pronouns ia available, replace "[t]he patient|[patient]" with "she/he/they/name".
    // Otherwise, if patient's pronouns are not they/them, replace:
    // 1) they with she/he 2) their with her/his 3) she's/he's with her/his 4) theirs with hers/his
    // 5) them with her/him 6) himselves/herselves with himself/herself
    const newHpiString = splitByPeriod(hpiString, true).map((sentence) => {
        // Replace "[t]he patient|[patient]" with "she/he/they/name"
        const patientRegex = /\b[Tt]he patient\b|\b[Pp]atient\b/g;
        if (patientRegex.test(sentence)) {
            sentence = replacePatientPronounsOrName(
                patientRegex,
                sentence,
                name,
                subPronoun,
                posAdjective,
                toggle
            );

            toggle = (toggle + 1) % 2;
        }

        // Replace all pronouns for PatientPronouns.They with ['they', 'them', 'their', 'themselves', 'theirs']
        sentence = replacePronouns(sentence, pronounPack);

        // Replace "she's/he's/they's" with "her/his/their"
        sentence = sentence.replace(
            / she's | he's | they's /g,
            ' ' + posAdjective + ' '
        );

        // If patient's pronouns are not they/them/their, replace:
        if (pronouns == PatientPronouns.She) {
            sentence = replacePronouns(sentence, pronounPack);
        } else if (pronouns == PatientPronouns.He) {
            sentence = replacePronouns(sentence, pronounPack);
        }

        // other cases:
        sentence = sentence.replace(
            / yourself /g,
            ' ' + posAdjective + 'self '
        );
        sentence = sentence.replace(/ your /g, ' ' + posAdjective + ' ');
        sentence = sentence.replace(/ you /g, ' ' + subPronoun + ' ');

        return sentence;
    });

    return newHpiString.join('');
};

// TODO: add it applying 'getThirdPersonSingularForm'
const conjugateThirdPerson = (hpiString: string) => hpiString;

/** Corrects grammatical errors in the input string based on predefined mappings. */
// TODO: Address issues with handling cases like ' She wish ' and 'She wish' considering case sensitivity and spacing.
const partOfSpeechCorrection = (hpiString: string): string => {
    PART_OF_SPEECH_CORRECTION_MAP.forEach((value: string, key: string) => {
        const regEx = new RegExp(`${key}`, 'gi');
        hpiString = hpiString.replace(regEx, value);
    });
    return hpiString;
};

// TODO: Address issues to consider case sensitivity and spacing.
export const fillMedicalTerms = (hpiString: string): string => {
    return replaceMappedWords(hpiString, MEDICAL_TERM_TRANSLATOR);
};

// TODO: Address issues to consider case sensitivity and spacing.
export const abbreviate = (hpiString: string): string => {
    return replaceMappedWords(hpiString, ABBREVIFY);
};

export const createHPI = (
    hpiString: string,
    patientName: string,
    pronouns: PatientPronouns
): string => {
    const patientInfo = definePatientNameAndPronouns(patientName, pronouns);
    // Patient handling
    hpiString = fillPatientPronoun(hpiString);
    // name and pronoun handling
    hpiString = fillNameAndPronouns(hpiString, patientInfo);

    // TODO: organize it later
    // hpiString = conjugateThirdPerson(hpiString); TODO: add to conjugate a base verb into its third-person singular form.
    hpiString = partOfSpeechCorrection(hpiString);
    // medical term replacement operation
    hpiString = fillMedicalTerms(hpiString);
    // abbreviate term replacement operation
    hpiString = abbreviate(hpiString);
    return hpiString;
};

/**
 * This function is designed to standardize and clean up generated text for consistency in non-advanced reporting contexts.
 * It formats text by removing specific phrases and capitalizing the first letter of each sentence.
 *
 * Usage: HpiNote
 */
export function standardFormatter(str: string): string {
    // Remove punctuation except periods, commas, forward slashes, apostrophes, colons, hyphens, and parentheses
    let sentence = retainAllowedPunctuation(str);
    // Apply selective uppercasing.
    sentence = selectivelyUppercase(sentence);
    // Removing specific phrases
    sentence = removePhrases(sentence);
    // Capitalizing the first letter of each sentence
    sentence = capitalize(sentence);
    return sentence;
}
