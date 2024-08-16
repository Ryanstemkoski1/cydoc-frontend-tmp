import { PART_OF_SPEECH_CORRECTION_MAP } from '@constants/hpiTextGenerationMapping';
import { PatientPronouns } from '@constants/patientInformation';
import { ABBREVIFY, MEDICAL_TERM_TRANSLATOR } from '@constants/word-mappings';
import { text } from 'stream/consumers';

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
    subjectPronoun: string; // she, he, they
    possessiveAdjective: string; // her, his, their
    objectPronoun: string; // her, him, them
    possessivePronoun: string; // hers, his, theirs
    reflexivePronoun: string; // herself, himself, themselves
}

// Capitalizes specific terms from ETHNICITY and MONTHS arrays in the input.
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

// Checks if string has I in it, if so, returns it with quotes around.
// e.g. ' I love my cat. ' --> '"I love my cat."'
const putQuotesAroundFirstPerson = (str: string): string => {
    str = ' ' + str + ' ';
    return str.includes(' i ') || str.includes(' I ')
        ? '"' + str.replace(/ i /, ' I ').trim() + '"'
        : str.trim();
};

/**
 * Filter sentences so that only those that don't have the keyword are kept in 
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
 * A Helper function to remove punctuation except periods (.), commas (,), 
 * forward slashes (/), apostrophes ('), colons (:), hyphens (-), 
 * and parentheses (()).
 *
 * TODO: This function maintains the previous logic, should it consider 
 * double quotation marks (")?
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

// A Helper Function to generate a title prefix for the given lastname based 
// on the specified pronoun.
const generateTitleWithName = (name: string, subjectPronoun: string) => {
    return subjectPronoun === 'he'
        ? `Mr. ${name}`
        : subjectPronoun === 'she'
          ? `Ms. ${name}`
          : `Mx. ${name}`;
};

/**
 * A Helper Function is part of 'fillNameAndPronouns' and retain the previous 
 * logic involving the boolean flags toggle.
 * - Replace "[t]he patient's" and "[t]heir" with the patient's possessive 
 *   adjective (e.g: 'her', 'his', 'their')
 * - Replace "[t]he patient|[patient]" with "she/he/they/name". 
 *   (e.g., "Ms. Smith" or "she" or "he" or "they").
 */
const replacePatientPronounsOrName = (
    patientRegex: RegExp,
    sentence: string,
    name: string,
    subjectPronoun: string,
    possessiveAdjective: string,
    toggle: number
): string => {
    // Replace "[t]he patient's" and "[t]heir" with given possessiveAdjective.
    sentence = name
        ? sentence.replace(/\bthe patient's\b|\btheir\b/g, possessiveAdjective)
        : sentence;

    // replace "[t]he patient|[patient]" with "she/he/they/name".
    if (name) {
        sentence = toggle
            ? sentence.replace(
                  patientRegex,
                  generateTitleWithName(name, subjectPronoun)
              )
            : sentence.replace(patientRegex, (match) =>
                  replaceWordCaseSensitive(match, subjectPronoun)
              );
    } else {
        sentence = toggle
            ? sentence
            : sentence.replace(patientRegex, (match) =>
                  replaceWordCaseSensitive(match, subjectPronoun)
              );
    }
    return sentence;
};

/**
 * A Helper Function updates pronouns in the sentence. It handles:
 * - Replaces subject, object, possessive, and reflexive pronouns.
 * - Handles special cases like "her" and plural possessives.
 *
 * Parameters:
 * - `sentence` (string): The text with pronouns to replace.
 * - `pronounPack` (string[]): Pronoun forms [subject, object, 
 *   possessive adjectives, reflexive, possessive pronoun].
 *
 */
const replacePronouns = (sentence: string, pronounPack: string[]) => {
    const [subjectPronoun, objectPronoun, possessiveAdjective, reflexivePronoun, possessivePronoun] =
        pronounPack;

    // Replace pronouns in the sentence
    sentence = sentence.replace(/\b(he|she|they)\b/gi, (match) =>
        replaceWordCaseSensitive(match, subjectPronoun)
    );
    sentence = sentence.replace(/\b(him|them)\b/gi, (match) =>
        replaceWordCaseSensitive(match, objectPronoun)
    );
    sentence = sentence.replace(/\b(?:his|their)\b/gi, (match) =>
        replaceWordCaseSensitive(match, possessiveAdjective)
    );
    // Handle special cases for 'her' to avoid wrong replacement
    sentence = sentence.replace(/\bher\b\s+(\b\w+\b)/gi, (match, noun) => {
        return noun
            ? replaceWordCaseSensitive(match, possessiveAdjective + ` ${noun}`)
            : replaceWordCaseSensitive(match, objectPronoun);
    });

    sentence = sentence.replace(
        /\bher\b(?=\s*\b(?:\w|[a-zA-Z])\b)/gi,
        (match) => replaceWordCaseSensitive(match, possessiveAdjective)
    );

    // Handle "theirs" and "hers" plural
    sentence = sentence.replace(/\b(hers|theirs)\b/gi, (match) =>
        replaceWordCaseSensitive(match, possessivePronoun)
    );

    sentence = sentence.replace(/\b(himself|herself|themselves)\b/gi, (match) =>
        replaceWordCaseSensitive(match, reflexivePronoun)
    );

    return sentence;
};

/**
 * TODO: consider other cases [!?.]
 * Splits a string into sentences based on periods followed by whitespace.
 *
 * - By default, uses regex to split on periods followed by one or more 
 *   whitespace characters.
 * - If `flag` is true, splits on periods followed by whitespace while 
 *   preserving [NEW LINE] characters.
 *
 * Examples:
 * const text = `Hello. My name is Mr. Huang.
 *  I work at Ms. Rachel's company.
 *  How can I assist you today?`;
 *
 * - Default: ["Hello.", "My name is Mr. Huang.", 
 *             "I work at Ms.Rachel's company.", "How can I assist you today?"]
 * - With flag: ["Hello. ", 
 *               "My name is Mr. Huang.\n", 
 *               "    I work at Ms.Rachel's company.\n", 
 *               "    How can I assist you today?\n"]
 */
export const splitByPeriod = (str: string, flag?: boolean) => {
    // Remove spaces after titles for processing
    str = str.replace(/(Mr\.|Mx\.|Ms\.)\s+/g, '$1');
    // Split the string by '. ' or '.\n', but not after titles if flag is true
    const strArr = flag ? str.split(/(?<=\.\s)/) : str.split(/(?<=\.)\s+/);
    // Re-add spaces after titles
    const result = strArr.map((sentence) => {
        return sentence.replace(/\bMr\.|Mx\.|Ms\.\b/, (match) => match + ' ');
    });
    return result;
};

// A Helper Function to capitalize first letter.
export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// A Helper Function to capitalize the first letter of each word in the sentence,
// ensuring that all other letters are in lowercase.
export function applyTitleCase(str: string) {
    return str
        .toLowerCase() // Convert the entire sentence to lowercase first
        .split(' ') // Split the sentence into words
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(' ');
}

// A Helper Function to capitalizes the replacement word if the original 
// word starts with an uppercase letter.
const replaceWordCaseSensitive = (word: string, replace: string) => {
    return /^[A-Z]/.test(word.trim())
        ? capitalizeFirstLetter(replace)
        : replace;
};

/**
 * A Helper Function is designed to replace specific words in a string with 
 * new words based on a given mapping,
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
            new RegExp(`\\b${key}([\b${END_OF_SENTENCE_PUNC},:]?)`, 'i'),
            `${value}$1`
        );
    });
    return hpiString;
};




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
            fillSentence = fillSentence.replace(/ANSWER/, putQuotesAroundFirstPerson(answer));
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

/**
 * Configures the patient's name and pronouns for display.
 *
 * Returns:
 * - An object containing:
 *   - `name`: Capitalized patient's name.
 *   - `pronouns`: The selected pronouns.
 *   - `subjectPronoun`: The subject pronouns (e.g., 'she', 'he', 'they').
 *   - `possessiveAdjective`: The possessive adjective (e.g., 'her', 'his', 'their').
 *   - `objectPronoun`: The object pronouns (e.g., 'her', 'him', 'them').
 *   - `possessivePronoun`: The possessive pronoun (e.g., 'hers', 'his', 'theirs').
 *   - `reflexivePronoun`: The reflexive pronoun (e.g., 'herself', 'himself', 'themselves').
 */
export const definePatientNameAndPronouns = (
    patientName: string,
    pronouns: PatientPronouns
): PatientDisplayName => {
    // define pronouns
    let subjectPronoun: string = 'they';
    let possessiveAdjective: string = 'their';
    let objectPronoun: string = 'them';
    let possessivePronoun: string = 'theirs';
    let reflexivePronoun: string = 'themselves';
    if (pronouns === PatientPronouns.She) {
        subjectPronoun = 'she';
        possessiveAdjective = 'her';
        objectPronoun = 'her';
        possessivePronoun = 'hers';
        reflexivePronoun = 'herself';
    } else if (pronouns === PatientPronouns.He) {
        subjectPronoun = 'he';
        possessiveAdjective = 'his';
        objectPronoun = 'him';
        possessivePronoun = 'his';
        reflexivePronoun = 'himself';
    }
    return {
        name: capitalizeFirstLetter(patientName),
        pronouns,
        subjectPronoun,
        possessiveAdjective,
        objectPronoun,
        possessivePronoun,
        reflexivePronoun,
    };
};

/**
 * Replaces PAI-specific terms with standard equivalents:
 *
 * The Personality Assessment Inventory (PAI) uses "respondent" and "the client's"
 * instead of "patient" and "the patient's," and "he/she" instead of "patient."
 *
 * Perform the following string replacements before inserting name and pronouns:
 * Replace "respondent" with "patient" | Replace "the client's" with 
 * "the patient's" |
 * Replace "he/she" with "patient" (as in literally the strong "he/she" with 
 * the slash included, needs to be changed to "patient")
 *
 * other case: Replaces "him/her" with 'them'.
 */
export const handlePAITerms = (hpiString: string) => {
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
        subjectPronoun,
        possessiveAdjective,
        objectPronoun,
        possessivePronoun,
        reflexivePronoun,
    } = patientInfo;

    const pronounPack = [
        subjectPronoun,
        objectPronoun,
        possessiveAdjective,
        reflexivePronoun,
        possessivePronoun,
    ];

    // TODO: This retains the original logic. Split the hpiString to ensure the toggle control behavior works.
    let toggle = 1; // change this so that it gets replaced at random rather than alternating.
    // Split the hpiString by periods while retaining the periods. [consider 'NEW LINE']
    // If patient's pronouns is available, replace "[t]he patient|[patient]" with "she/he/they/name".
    // Otherwise, if patient's pronouns are not they/them, replace:
    // 1) they -> she/he 2) their -> her/his 3) she's/he's -> her/his 4) theirs -> hers/his
    // 5) them -> her/him 6) himselves/herselves -> himself/herself
    const newHpiString = splitByPeriod(hpiString, true).map((sentence) => {
        // Replace "[t]he patient|[patient]" with "she/he/they/name"
        const patientRegex = /\b[Tt]he patient\b|\b[Pp]atient\b/g;
        if (patientRegex.test(sentence)) {
            sentence = replacePatientPronounsOrName(
                patientRegex,
                sentence,
                name,
                subjectPronoun,
                possessiveAdjective,
                toggle
            );
            // Toggle to alternate the replacements.
            toggle = (toggle + 1) % 2;
        }

        // Always replace all pronouns associated with [PatientPronouns.They] first, using this default set:
        // ['they', 'them', 'their', 'themselves', 'theirs']
        const defaultPronounPack = [
            'they',
            'them',
            'their',
            'themselves',
            'theirs',
        ];
        sentence = replacePronouns(sentence, defaultPronounPack);

        // Replace "she's/he's/they's" with "her/his/their"
        sentence = sentence.replace(
            / she's | he's | they's /g,
            ' ' + possessiveAdjective + ' '
        );

        // If the patient's pronouns are "she" or "he", apply 
        // additional replacements with the specific pronoun pack.
        if (pronouns == PatientPronouns.She) {
            sentence = replacePronouns(sentence, pronounPack);
        } else if (pronouns == PatientPronouns.He) {
            sentence = replacePronouns(sentence, pronounPack);
        }

        // Handle other specific cases, such as replacing "yourself" 
        // with "herself/himself".
        sentence = sentence.replace(
            / yourself /g,
            ' ' + possessiveAdjective + 'self '
        );
        sentence = sentence.replace(/ your /g, ' ' + possessiveAdjective + ' ');
        sentence = sentence.replace(/ you /g, ' ' + subjectPronoun + ' ');

        return sentence;
    });

    // Combine the modified sentences back into a single string, 
    // retaining the original punctuation.
    return newHpiString.join(''); 
};

// TODO: add it applying 'getThirdPersonSingularForm'
const conjugateThirdPerson = (hpiString: string) => hpiString;

/**
 * Corrects grammatical errors in the input string based on predefined mappings.
 * e.g. ' she do ' -> ' she does '
 **/
const partOfSpeechCorrection = (hpiString: string): string => {
    PART_OF_SPEECH_CORRECTION_MAP.forEach((value: string, key: string) => {
        const regEx = new RegExp(`${key}`, 'gi');
        hpiString = hpiString.replace(regEx, value);
    });
    return hpiString;
};

/** Address medical term replacement operation **/
export const fillMedicalTerms = (hpiString: string): string => {
    return replaceMappedWords(hpiString, MEDICAL_TERM_TRANSLATOR);
};

/** Address abbreviate term replacement operation **/
export const abbreviate = (hpiString: string): string => {
    return replaceMappedWords(hpiString, ABBREVIFY);
};

/**
 * Generates a complete HPI text by processing the input string with the 
 * patient's name and pronouns.
 *
 * This function handles several key tasks:
 * 1. Defines and initializes the patient's name and pronouns using 
 *   `definePatientNameAndPronouns`.
 * 2. Replaces general patient references with appropriate pronouns 
 *    using `handlePAITerms`.
 * 3. Replaces specific occurrences of the patient's name and pronouns within 
 *    the HPI string using `fillNameAndPronouns`.
 * 4. Applies part-of-speech corrections to ensure grammatical accuracy with 
 *   `partOfSpeechCorrection`.
 * 5. Expands or corrects medical terms within the HPI string using 
 *    `fillMedicalTerms`.
 * 6. Applies common abbreviations where appropriate using `abbreviate`.
 */
export const doAllHPIWordReplacements = (
    hpiString: string,
    patientName: string,
    pronouns: PatientPronouns
): string => {
    const patientInfo = definePatientNameAndPronouns(patientName, pronouns);
    hpiString = handlePAITerms(hpiString); // General patient pronoun handling
    hpiString = fillNameAndPronouns(hpiString, patientInfo); // Specific name and pronoun handling
    // hpiString = conjugateThirdPerson(hpiString); TODO: add to conjugate a base verb into its third-person singular form.
    hpiString = partOfSpeechCorrection(hpiString); // Apply part-of-speech corrections
    hpiString = fillMedicalTerms(hpiString); // Fill or correct medical terms
    hpiString = abbreviate(hpiString); // Apply common abbreviations
    // extractHeadingsWithNormalText(hpiString);
    return hpiString;
};

/**
 * This function is designed to standardize and clean up generated text for 
 * consistency in non-advanced reporting contexts.
 * It formats text by removing specific phrases and capitalizing the first 
 * letter of each sentence.
 *
 * Usage: HpiNote
 */
export function advancedReportFormatter(str: string): string {
    // Remove punctuation except periods, commas, forward slashes, apostrophes, colons, hyphens, and parentheses
    let sentence = retainAllowedPunctuation(str);
    // Apply selective uppercasing.
    sentence = uppercaseEthnicityAndMonths(sentence);
    // Capitalizing the first letter of each sentence
    sentence = capitalize(sentence);
    return sentence;
}

/**
 * A Helper Function to extract headings from a string based on a specific format.
 *
 * Headings are defined as at least 8 uppercase letters followed by a colon (`:`).
 *
 * e.g., ['REASON FOR REFERRAL:', 'PRESENTATION:'].
 */
function extractHeadings(str: string): string[] {
    // Regular expression to match potential headings
    const headingRegex = /([A-Z\s]{8,}:)/g;
    // Extract headings
    const headings = str.match(headingRegex)?.filter(Boolean);
    // If no headings are found, return an empty array
    return headings || [];
}

/**
 * Extracts manually specified headings and 
 * associated normal text from a string.
 * 
 * Manually specified headings are those that are hardcoded into the 
 * knowledge graph via a specific capitalization and colon format.
 * The function identifies headings based on a specific format (capitalized 
 * words followed by a colon), then extracts the normal text that follows 
 * each heading. The result is an array of objects where each
 * object contains a heading and its corresponding normal text.
 *
 * Example output:
 * [
 *   { heading: 'Reason For Referral', normalText: '...' },
 *   { heading: 'Presentation', normalText: '...' }
 * ]
 */
export function extractHeadingsWithNormalText(str: string) {
    const headings = extractHeadings(str);
    let heading: string = '';
    let normalText: string = str;
    const result: { heading: string; normalText: string }[] = [];
    let remainingText = str;

    for (let i = 0; i < headings.length; i++) {
        const remainingTextArr = remainingText
            .split(headings[i])
            .filter(Boolean);
        if (remainingTextArr.length > 1) {
            if (i === 0) {
                normalText = remainingTextArr[0];
            } else {
                // TODO: Removes the colon (':') from the heading. Consider whether this behavior should be different for advanced reports.
                heading = applyTitleCase(headings[i - 1].replace(':', ''));
                normalText = remainingTextArr[0];
            }
            result.push({ heading, normalText });
            remainingText = remainingTextArr[1];
        } else {
            remainingText = remainingTextArr[0];
        }
    }
    if (remainingText.length && headings.length) {
        heading = applyTitleCase(
            headings[headings.length - 1].replace(':', '')
        );
        normalText = remainingText;
        result.push({ heading, normalText });
    } else {
        result.push({ heading, normalText });
    }
    return result;
}
