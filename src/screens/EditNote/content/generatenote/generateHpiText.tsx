import { PART_OF_SPEECH_CORRECTION_MAP } from '@constants/hpiTextGenerationMapping';
import { PatientPronouns } from '@constants/patientInformation';
import { ABBREVIFY, MEDICAL_TERM_TRANSLATOR } from '@constants/word-mappings';
import { text } from 'stream/consumers';
import {
    capitalizeFirstLetter,
    splitByPeriod,
} from '@utils/textGeneration/common/textUtils';

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
    const [
        subjectPronoun,
        objectPronoun,
        possessiveAdjective,
        reflexivePronoun,
        possessivePronoun,
    ] = pronounPack;

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
