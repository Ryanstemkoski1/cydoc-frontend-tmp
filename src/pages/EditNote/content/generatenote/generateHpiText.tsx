import { MEDICAL_TERM_TRANSLATOR, ABBREVIFY } from 'constants/word-mappings';

/**
 * keys: ints for the question order
 * value: list of length 2 in which the first element is the fill in the blank
 *        phrase and the second element is the patient's answer
 *
 * for yes/no questions, we only need the fill in the blank phrase for the
 * answer they gave, and the patient's answer can be the empty string
 */
interface HPI {
    [questionOrder: number]: [string, string];
    [questionOrder: string]: [string, string];
}

/**
 * Patient's display name in the note
 */
interface PatientDisplayName {
    name: string;
    objPronoun: string;
    posPronoun: string;
}

type Gender = 'F' | 'M';

const END_OF_SENTENCE_PUNC = '.!?';

/**
 * Removes whitespace from beginning and end of a sentence. Lowercases.
 * Removes punctuation (except periods, commas, forward slashes, apostrophes,
 * and colons). Removes multiple spaces.
 */
export const fullClean = (sentence: string): string => {
    sentence = sentence.toLowerCase();

    // remove punctuations
    sentence = sentence.replace(/[^\w\s.,:/']/g, '');

    // condense multiple whitespace into single space
    sentence = sentence.split(/\s+/).join(' ');

    // remove period from the end of sentence (not all periods to preserve
    // decimal measurements of lesion)
    return sentence.replace(/\.\s?$/, '').trim();
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
        let [fillSentence, answer] = hpi[key] || hpi[key.toString()];
        fillSentence = fullClean(fillSentence);
        answer = fullClean(answer);
        if (fillSentence.includes('answer')) {
            fillSentence = fillSentence.replace('answer', answer);
        }
        hpiString += fillSentence + '. ';
    });
    return hpiString;
};

/**
 * Defines what string will be used as the patient's name in the note
 */
export const definePatientNameAndPronouns = (
    title: string,
    lastName: string,
    gender: Gender
): PatientDisplayName => {
    // define patient name
    let prefix = title.trim();
    if (title === 'general') {
        prefix = gender === 'F' ? 'Ms.' : 'Mr.';
    }
    const name = `${prefix} ${lastName.trim()}`;

    // define pronouns
    let objPronoun, posPronoun: string;
    if (gender === 'F') {
        objPronoun = 'she';
        posPronoun = 'her';
    } else {
        objPronoun = 'he';
        posPronoun = 'his';
    }
    return { name, objPronoun, posPronoun };
};

/**
 * Returns modified hpiString such that:
 * -  "the patient's" (possessive) and "their" (generic possessive) are
 *    replaced with possessive pronoun (e.g. "her")
 * -  "the patient" is replaced with patient's name (e.g. "Ms. Smith") or
 *    object pronoun (e.g. "she")
 */
export const fillNameAndGender = (
    hpiString: string,
    patientInfo: PatientDisplayName
): string => {
    const { name, objPronoun, posPronoun } = patientInfo;
    hpiString = hpiString.replace(/the patient's|their/g, posPronoun);

    let toggle = 0;
    // TODO: change this so that it gets replaced at random rather than
    // alternating
    const newHpiString = hpiString.split('. ').map((sentence) => {
        if (sentence.includes('the patient')) {
            const noun = toggle === 0 ? name : objPronoun;
            toggle = (toggle + 1) % 2;
            sentence = sentence.replace(/the patient/g, noun);
        }
        return sentence;
    });
    return newHpiString.join('. ');
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

// TODO
const conjugateThirdPerson = (hpiString: string) => hpiString;

const capitalizeWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Capitalizes first word of every sentence and all ' i 's
 */
export const capitalize = (hpiString: string): string => {
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

export const createHPI = (
    hpi: HPI,
    lastName: string,
    gender: Gender,
    title: string
): string => {
    const patientInfo = definePatientNameAndPronouns(title, lastName, gender);

    let hpiString = fillAnswers(hpi);
    hpiString = fillNameAndGender(hpiString, patientInfo);
    hpiString = fillMedicalTerms(hpiString);
    hpiString = conjugateThirdPerson(hpiString);
    hpiString = abbreviate(hpiString);
    hpiString = capitalize(hpiString);

    return hpiString;
};
