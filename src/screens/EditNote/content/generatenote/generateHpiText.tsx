import { PART_OF_SPEECH_CORRECTION_MAP } from '@constants/hpiTextGenerationMapping';
import { PatientPronouns } from '@constants/patientInformation';
import { ABBREVIFY, MEDICAL_TERM_TRANSLATOR } from '@constants/word-mappings';
/**
 * keys: ints for the question order
 * value: list of length 2 in which the first element is the fill in the blank
 *        phrase and the second element is the patient's answer
 *
 * for yes/no questions, we only need the fill in the blank phrase for the
 * answer they gave, and the patient's answer can be the empty string
 */
export interface HPI {
    [questionOrder: number]: [string, string, string];
    [questionOrder: string]: [string, string, string];
}

/**
 * Patient's display name in the note
 */
interface PatientDisplayName {
    name: string;
    pronouns: PatientPronouns;
    objPronoun: string;
    posPronoun: string;
}

const ETINICITY = ['Hispanic', 'Latino'];
// https://capitalizemytitle.com/abbreviations-for-months/
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

const selectivelyUppercase = (str: string): string => {
    [...ETINICITY, ...MONTHS].forEach((item) => {
        if (str.match(new RegExp(`\\b${item}\\b`, 'ig'))) {
            str = str.replace(new RegExp(item, 'ig'), ' ' + item);
        }
    });
    return str;
};

const END_OF_SENTENCE_PUNC = '.!?';
const PART_OF_SPEECH_CORRECTION_MAP_FIRST_COLUMN = [
    ...PART_OF_SPEECH_CORRECTION_MAP.keys(),
];
const selectivelyLowercase = (str: string): string => {
    [
        'ANSWER',
        'NOTANSWER',
        'ANSWER\\.',
        'NOTANSWER\\.',
        ...PART_OF_SPEECH_CORRECTION_MAP_FIRST_COLUMN,
    ].forEach((item) => {
        const regEx = new RegExp(item, 'ig');
        str = str.replace(regEx, item.toLowerCase().replace(/[\\]/g, ''));
    });

    return str;
};
/**
 * Removes whitespace from beginning and end of a sentence. Lowercases.
 * Removes punctuation (except periods, commas, forward slashes, apostrophes,
 * and colons). Removes multiple spaces.
 */
export const fullClean = (sentence: string): string => {
    // remove punctuations except hyphens, parentheses and single apostrophes
    sentence = sentence.replace(/[^\w\s'.,:/@()-]/g, '');

    // condense multiple whitespace into single space
    sentence = sentence.split(/\s+/).join(' ');

    // remove capitalized letters selectively
    sentence = selectivelyLowercase(sentence);

    // capitalized letters selectively
    sentence = selectivelyUppercase(sentence);

    //TODO: Do not remove any punctuation for Advanced Report Generation. (Including decimal measurements of lesion)
    return sentence.trim();
};

// checks if string has I in it, if so, returns it with quotes around.
const stringHasI = (str: string): string => {
    str = ' ' + str + ' ';
    return str.includes(' i ') || str.includes(' I ')
        ? '"' + str.replace(/ i /, ' I ').trim() + '"'
        : str.trim();
};

/*
Filter sentences so that only those that don't have the keyword are kept in 
(unless both answer and notanswer are in it) 
*/
export const removeSentence = (
    fillSentence: string,
    keyword: string
): string => {
    const containsBoth = (sentence: string): boolean =>
        sentence.includes('answer') && sentence.includes('notanswer');

    // Split by period followed by a space but retain the periods in the result
    return fillSentence
        .split(/(?<=\.)\s+/)
        .filter(
            (sentence) =>
                !sentence.match(new RegExp(keyword) || containsBoth(sentence))
        )
        .join('. ');
};

/**
 * Clean the fill sentences and the answers, and insert the answers int the
 * fill sentences
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
        if (!answer.length)
            fillSentence = removeSentence(fillSentence, 'answer');
        else if (answer === 'all no') {
            fillSentence = fillSentence.substring(
                fillSentence.indexOf('answer') + 6
            );
        } else if (fillSentence.match(/answer/)) {
            fillSentence = fillSentence.replace(/answer/, stringHasI(answer));
        }
        if (!negAnswer.length)
            fillSentence = removeSentence(fillSentence, 'notanswer');
        else if (fillSentence.match(/notanswer/)) {
            fillSentence = fillSentence.replace(/notanswer/, negAnswer);
        }
        hpiString += `${fillSentence} `; // Keep original punctuation.
    });
    return hpiString;
};

/**
 * Defines what string will be used as the patient's name in the note
 */
export const definePatientNameAndPronouns = (
    patientName: string,
    pronouns: PatientPronouns
): PatientDisplayName => {
    // define pronouns
    let objPronoun, posPronoun: string;
    if (pronouns === PatientPronouns.She) {
        objPronoun = 'she';
        posPronoun = 'her';
    } else if (pronouns === PatientPronouns.He) {
        objPronoun = 'he';
        posPronoun = 'his';
    } else {
        objPronoun = 'they';
        posPronoun = 'their';
    }
    return {
        name: capitalizeFirstLetter(patientName),
        pronouns,
        objPronoun,
        posPronoun,
    };
};

/**
 * Returns modified hpiString such that:
 * -  "the patient's" (possessive) and "their" (generic possessive) are
 *    replaced with possessive pronoun (e.g. "her")
 * -  "the patient" is replaced with patient's name (e.g. "Ms. Smith") or
 *    object pronoun (e.g. "she")
 */
export const fillNameAndPronouns = (
    hpiString: string,
    patientInfo: PatientDisplayName
): string => {
    const { name, pronouns, objPronoun, posPronoun } = patientInfo;

    const sentenceHelper = (sentence: string): string => {
        // Remove period from the end if present and pad with spaces
        return ` ${sentence.replace(/\.$/, '')} `;
    };

    // the helper function to capitalizes the replacement word if the original word starts with an uppercase letter.
    const replaceWord = (word: string, replace: string) => {
        return /^[A-Z]/.test(word) ? capitalizeFirstLetter(replace) : replace;
    };

    // The helper function to replace pronouns requires only the string and the pronoun as parameters.
    const replacePronouns = (sentence: string, pronoun: string) => {
        const validPronouns = ['he', 'she', 'they'];
        if (!validPronouns.includes(pronoun)) {
            throw new Error(
                'Invalid pronoun. Please provide "he", "she", or "they".'
            );
        }

        const pronounReplacements = {
            he: ['he', 'him', 'his', 'himself', 'his'],
            she: ['she', 'her', 'her', 'herself', 'hers'],
            they: ['they', 'them', 'their', 'themselves', 'theirs'],
        };

        const [subject, object, possessive, reflexive, possessivePronoun] =
            pronounReplacements[pronoun];

        // Replace pronouns in the senetence
        sentence = sentence.replace(/\b(he|she|they)\b/gi, (match) =>
            replaceWord(match, subject)
        );
        sentence = sentence.replace(/\b(him|them)\b/gi, (match) =>
            replaceWord(match, object)
        );
        sentence = sentence.replace(/\b(?:his|their)\b/gi, (match) =>
            replaceWord(match, possessive)
        );
        // Handle special cases for 'her' to avoid wrong replacement
        sentence = sentence.replace(/\bher\b\s+(\b\w+\b)/gi, (match, noun) => {
            return noun
                ? replaceWord(match, possessive + ` ${noun}`)
                : replaceWord(match, object);
        });

        sentence = sentence.replace(
            /\bher\b(?=\s*\b(?:\w|[a-zA-Z])\b)/gi,
            (match) => replaceWord(match, possessive)
        );

        // Handle "theirs" and "hers" plural
        sentence = sentence.replace(/\b(hers|theirs)\b/gi, (match) =>
            replaceWord(match, possessivePronoun)
        );

        sentence = sentence.replace(
            /\b(himself|herself|themselves)\b/gi,
            (match) => replaceWord(match, reflexive)
        );

        return sentence;
    };

    //  The Personality Assessment Inventory (PAI) uses "respondent" and "the client's"
    //  instead of "patient" and "the patient's," and "he/she" instead of "patient."
    //  Perform the following string replacements before inserting name and pronouns:
    //  Replace "respondent" with "patient" | Replace "the client's" with "the patient's" |
    //  Replace "he/she" with "patient" (as in literally the strong "he/she" with the slash included, needs to be changed to "patient")
    //  Replace "him/her" with "patient's"
    hpiString = hpiString.replace(/\brespondent/gi, (match) =>
        replaceWord(match, 'patient')
    );
    hpiString = hpiString.replace(/\bclient/gi, (match) =>
        replaceWord(match, 'patient')
    );
    hpiString = hpiString.replace(/he\/she/gi, (match) =>
        replaceWord(match, 'patient')
    );
    hpiString = hpiString.replace(/him\/her/gi, (match) =>
        replaceWord(match, 'them')
    );

    // Replace "the patient's" and "their" with given posPronoun.
    hpiString = name.length
        ? hpiString.replace(/\bthe patient's\b|\btheir\b/g, posPronoun)
        : hpiString;

    // TODO: change this so that it gets replaced at random rather than alternating.
    let toggle = 1;

    // process each sentence
    // If patient's pronouns ia available, replace "[t]he patient|[patient]" with "she/he/they/name".
    // Otherwise, if patient's pronouns are not they/them, replace:
    // 1) they with she/he 2) their with her/his 3) she's/he's with her/his 4) theirs with hers/his
    // 5) them with her/him 6) himselves/herselves with himself/herself
    const newHpiString = hpiString.split('. ').map((sentence) => {
        // Replace "[t]he patient|[patient]" with "she/he/they/name"
        if (/\b[Tt]he patient\b|\b[Pp]atient\b/.test(sentence)) {
            if (name) {
                sentence = toggle
                    ? sentence.replace(
                          /\b[Tt]he patient\b|\b[Pp]atient\b/g,
                          objPronoun === 'he'
                              ? `Mr.${name}`
                              : objPronoun === 'she'
                                ? `Ms.${name}`
                                : `Mx.${name}`
                      )
                    : sentence.replace(
                          /\b[Tt]he patient\b|\b[Pp]atient\b/g,
                          (match) => replaceWord(match, objPronoun)
                      );
            } else {
                sentence = toggle
                    ? sentence
                    : sentence.replace(
                          /\b[Tt]he patient\b|\b[Pp]atient\b/g,
                          (match) => replaceWord(match, objPronoun)
                      );
            }
            toggle = (toggle + 1) % 2;
        }

        sentence = sentenceHelper(sentence);

        // Replace all pronouns for PatientPronouns.They ['they', 'them', 'their', 'themselves', 'theirs']
        sentence = replacePronouns(sentence, 'they');

        // Replace "she's/he's/they's" with "her/his/their"
        sentence = sentence.replace(
            / she's | he's | they's /g,
            ' ' + posPronoun + ' '
        );

        // If patient's pronouns are not they/them/their, replace:
        if (pronouns == PatientPronouns.She) {
            sentence = replacePronouns(sentence, 'she');
        } else if (pronouns == PatientPronouns.He) {
            sentence = replacePronouns(sentence, 'he');
        }

        // other cases:
        sentence = sentence.replace(/ yourself /g, ' ' + posPronoun + 'self ');
        sentence = sentence.replace(/ your /g, ' ' + posPronoun + ' ');
        sentence = sentence.replace(/ you /g, ' ' + objPronoun + ' ');

        sentence = sentence.trim();
        return sentence;
    });

    return newHpiString.join('. ').trim() + '.';
};

const partOfSpeechCorrection = (hpiString: string): string => {
    PART_OF_SPEECH_CORRECTION_MAP.forEach((value: string, key: string) => {
        const regEx = new RegExp(`${key}`, 'g');
        hpiString = hpiString.replace(regEx, value);
    });
    return hpiString;
};

const replaceMappedWords = (
    hpiString: string,
    mapping: { [key: string]: string }
): string => {
    Object.entries(mapping).forEach(([key, value]) => {
        hpiString = hpiString.replace(
            new RegExp(`\\b${key}([\b${END_OF_SENTENCE_PUNC},:]?)`),
            `${value}$1`
        );
    });
    return hpiString;
};

export const fillMedicalTerms = (hpiString: string): string => {
    return replaceMappedWords(hpiString, MEDICAL_TERM_TRANSLATOR);
};

export const abbreviate = (hpiString: string): string => {
    return replaceMappedWords(hpiString, ABBREVIFY);
};

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// TODO
const conjugateThirdPerson = (hpiString: string) => hpiString;

const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Capitalizes first word of every sentence and all ' i 's
 */
export const capitalize = (hpiString: string): string => {
    hpiString = hpiString.trim();
    // replace 'i' with I
    hpiString = hpiString.replace(
        /(^|\s|\b)i(\s|$|\b)/g,
        (match, p1, p2) => p1 + 'I' + p2
    );
    // Capitalize the very first letter of the string
    if (hpiString.length > 0) {
        hpiString = capitalizeWord(hpiString);
    }
    // Capitalize the first letter of each sentence
    hpiString = hpiString.replace(
        /([.?!])\s*([a-z])/g,
        (match, p1, p2) => `${p1} ${p2.toUpperCase()}`
    );
    // replace to capitalize the word after 'PARAGRAPHBREAK'
    hpiString = hpiString.replace(/PARAGRAPHBREAK\s+(\w)/g, (match, p1) => {
        return `PARAGRAPHBREAK ${capitalizeWord(p1)}`;
    });
    // replace to capitalize the word after heading ends with ':'
    hpiString = hpiString.replace(/:\s+(\w)/g, (match, p1) => {
        return `: ${capitalizeWord(p1)}`;
    });
    return hpiString;
};

export const createInitialHPI = (hpi: HPI): string => {
    return fillAnswers(hpi);
};

export const createHPI = (
    hpiString: string,
    patientName: string,
    pronouns: PatientPronouns,
    isAdvancedReport?: boolean
): string => {
    const patientInfo = definePatientNameAndPronouns(patientName, pronouns);

    hpiString = fillNameAndPronouns(hpiString, patientInfo);
    hpiString = partOfSpeechCorrection(hpiString);
    // hpiString = combineHpiString(hpiString, 3);

    if (!isAdvancedReport) {
        hpiString = fillMedicalTerms(hpiString);
        hpiString = conjugateThirdPerson(hpiString);
        hpiString = abbreviate(hpiString);
        hpiString = capitalize(hpiString);
    }
    return hpiString;
};
