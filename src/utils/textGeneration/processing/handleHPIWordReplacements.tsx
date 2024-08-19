import { replaceWordCaseSensitive } from '../common/textUtils';
import { PART_OF_SPEECH_CORRECTION_MAP } from '@constants/hpiTextGenerationMapping';
import { ABBREVIFY, MEDICAL_TERM_TRANSLATOR } from '@constants/word-mappings';
import { PatientPronouns } from '@constants/patientInformation';
import { definePatientNameAndPronouns } from './handlePatientNameAndPronouns';
import { fillNameAndPronouns } from './handlePatientNameAndPronouns';

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
