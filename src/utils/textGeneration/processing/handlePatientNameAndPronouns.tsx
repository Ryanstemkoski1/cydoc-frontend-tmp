import { extractHeadings } from '@screens/EditNote/content/generatenote/formatter/handleManuallySpecifiedHeadings';
import { PatientPronouns } from '@constants/patientInformation';
import {
    replaceWordCaseSensitive,
    capitalizeFirstLetter,
    splitByPeriod,
    replaceQuotedTextWithKeyword,
    replaceMappedWords,
} from '../common/textUtils';

/**
 * Patient's display name in the note
 * Usage: definePatientNameAndPronouns, fillNameAndPronouns
 */
interface PatientDisplayName {
    name: string;
    pronouns: PatientPronouns;
    subjectPronoun: string; // she, he, they
    possessiveAdjective: string; // her, his, their
    objectPronoun: string; // her, him, them
    possessivePronoun: string; // hers, his, theirs
    reflexivePronoun: string; // herself, himself, themselves
}

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
 *
 * Usage: DoAllHPIWordReplacements
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
 * Returns modified hpiString such that:
 * - Replaces "the patient's" and "their" with the patient's possessive adjective (e.g., "her").
 * - Replaces "the patient" with the patient's name or subject pronoun (e.g., "Ms. Smith" or "she").
 * - Handles special cases for pronouns, including alternating replacements and updating various pronouns.
 *
 * Used in DoAllHPIWordReplacements
 *
 * // TODO: it should consider the inside quotation marks remain unchanged.
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

    // This retains the original logic. Split the hpiString to ensure the toggle control behavior works.
    let toggle = 1; // change this so that it gets replaced at random rather than alternating.
    let prevEndsWithNewLine = false; // track the beginning of paragraph.
    // Split the hpiString by periods while retaining the periods. [consider 'NEW LINE']
    // If patient's pronouns is available, replace "[t]he patient|[patient]" with "she/he/they/name".
    // Otherwise, if patient's pronouns are not they/them, replace:
    // 1) they -> she/he 2) their -> her/his 3) she's/he's -> her/his 4) theirs -> hers/his
    // 5) them -> her/him 6) himselves/herselves -> himself/herself
    const newHpiString = splitByPeriod(hpiString, true).map((sentence) => {
        // Consider the case: text inside quotation marks:
        const { replacedText, quotedTextMap } =
            replaceQuotedTextWithKeyword(sentence);

        sentence = replacedText;

        // This ensure to insert 'Mx.Lastname' title:
        // The previous sentence is ends with paragraph
        // The sentences contains the headings.
        if (prevEndsWithNewLine || extractHeadings(sentence).length) {
            toggle = 1;
        }

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

        // put back the content back within quotation marks.
        sentence = replaceMappedWords(sentence, quotedTextMap);

        // update prevEndsWithNewLine
        prevEndsWithNewLine = sentence.endsWith('\n');
        return sentence;
    });

    // Combine the modified sentences back into a single string,
    // retaining the original punctuation.
    return newHpiString.join('');
};

/**
 * A Helper Function to generate a title prefix for the given lastname based
 * on the specified pronoun.
 *
 * Used in replacepatientPronounsOrName
 */
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
 *
 * Used in fillNameAndPronouns
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
 * Used in fillNameAndPronouns
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
