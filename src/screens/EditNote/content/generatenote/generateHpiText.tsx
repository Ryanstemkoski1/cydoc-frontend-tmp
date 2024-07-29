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
        if (str.match(new RegExp('(^|[^a-zA-Z])' + item, 'ig'))) {
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

    // decimal measurements of lesion)
    return sentence.replace(/\.\s?$/, '').trim();
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
    return fillSentence
        .split('. ')
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
        hpiString += fillSentence + '. ';
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
    return { name: patientName, pronouns, objPronoun, posPronoun };
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

    hpiString = name.length
        ? hpiString.replace(/the patient's|their/g, posPronoun)
        : hpiString;

    let toggle = 1;

    const sentenceHelper = (sentence: string): string => {
        // Remove period from the end if present and pad with spaces
        return ` ${sentence.replace(/\.$/, '')} `;
    };

    const replaceWord = (word: string, replace: string) => {
        return /^[A-Z]/.test(word) ? capitalizeFirstLetter(replace) : replace;
    };

    const replacePronouns = (sentence: string, pronoun: string) => {
        const validPronouns = ['he', 'she', 'they'];
        if (!validPronouns.includes(pronoun)) {
            throw new Error(
                'Invalid pronoun. Please provide "he", "she", or "they".'
            );
        }

        const pronounReplacements = {
            he: ['he', 'him', 'his', 'himself'],
            she: ['she', 'her', 'her', 'herself'],
            they: ['they', 'them', 'their', 'themselves'],
        };

        const [subject, object, possessive, reflexive] =
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
                ? replaceWord(match, possessive + ` ${noun} `)
                : replaceWord(match, object);
        });

        sentence = sentence.replace(
            /\bher\b(?=\s*\b(?:\w|[a-zA-Z])\b)/gi,
            (match) => replaceWord(match, possessive)
        );
        sentence = sentence.replace(
            /\b(himself|herself|themselves)\b/gi,
            (match) => replaceWord(match, reflexive)
        );

        return sentence;
    };

    // process each sentence
    const newHpiString = hpiString.split('. ').map((sentence) => {
        // Replace "the patient" with "she/he/they/name"
        if (/[Tt]he patient/.test(sentence)) {
            const noun = name
                ? toggle
                    ? name
                    : objPronoun
                : toggle
                  ? undefined
                  : objPronoun;
            if (noun) {
                sentence = sentence.replace(/[Tt]he patient/g, noun);
            }
            toggle = (toggle + 1) % 2;
        }

        sentence = sentenceHelper(sentence);
        sentence = sentence.replace(
            / she's | he's | they's /g,
            ' ' + posPronoun + ' '
        );

        if (pronouns == PatientPronouns.She) {
            // sentence = sentence.replace(/ them /g, ' ' + posPronoun + ' ');
            sentence = replacePronouns(sentence, 'she');
        } else if (pronouns == PatientPronouns.He) {
            sentence = replacePronouns(sentence, 'he');
        } else {
            sentence = replacePronouns(sentence, 'they');
        }

        // other cases:
        sentence = sentence.replace(/ yourself /g, ' ' + posPronoun + 'self ');
        sentence = sentence.replace(/ your /g, ' ' + posPronoun + ' ');
        sentence = sentence.replace(/ you /g, ' ' + objPronoun + ' ');

        sentence = sentence.trim();
        return sentence;
    });

    return newHpiString.join('. ') + '.';
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
    hpiString = hpiString.replace(/\bi\b/g, 'I');
    const punctuation = new Set(END_OF_SENTENCE_PUNC);
    const words = hpiString.split(' ');
    const capitalizedWords = words.map((word, i) => {
        if (
            i - 1 < 0 ||
            punctuation.has(words[i - 1][words[i - 1].length - 1])
        ) {
            word = capitalizeWord(word);
        }
        return word;
    });
    return capitalizedWords.join(' ');
};

export const createInitialHPI = (
    hpi: HPI,
    isAdvancedReport: boolean
): string => {
    return isAdvancedReport
        ? fillAnswersForAdvancedReport(hpi)
        : fillAnswers(hpi);
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

/**
 * This function generates text specifically for Advanced Report Generation.
 * It returns the text without altering the provided fillSentence value.
 * Note: This function does not change any capitalization or punctuation.
 *
 * @returns {string} The original texts filled with original answers.
 */
export const fillAnswersForAdvancedReport = (hpi: HPI): string => {
    if (hpi && typeof hpi === 'object') {
        const sortedKeys: number[] = Object.keys(hpi).map((val) =>
            parseInt(val)
        );
        sortedKeys.sort((lhs, rhs) => lhs - rhs);
        let hpiString = '';
        sortedKeys.forEach((key) => {
            let [fillSentence, answer, negAnswer] =
                hpi[key] || hpi[key.toString()];
            answer = fullClean(answer);
            negAnswer = fullClean(negAnswer);
            if (!answer.length)
                fillSentence = removeSentence(fillSentence, 'ANSWER');
            else if (answer === 'all no') {
                fillSentence = fillSentence.substring(
                    fillSentence.indexOf('ANSWER') + 6
                );
            } else if (fillSentence.match(/ANSWER/)) {
                fillSentence = fillSentence.replace(
                    /ANSWER/,
                    stringHasI(answer)
                );
            }
            if (!negAnswer.length)
                fillSentence = removeSentence(fillSentence, 'NOTANSWER');
            else if (fillSentence.match(/NOTANSWER/)) {
                fillSentence = fillSentence.replace(/NOTANSWER/, negAnswer);
            }
            hpiString += fillSentence + ' ';
        });
        return hpiString.trim();
    }
    return '';
};
