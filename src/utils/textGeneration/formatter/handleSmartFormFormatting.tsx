import { capitalizeFirstLetter } from '../common/textUtils';

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

/**
 * This function is designed to standardize and clean up generated text for
 * consistency in smart form contexts.
 * It formats text by editing punctuation and capitalizing the first
 * letter of each sentence.
 *
 * Usage: HpiNote
 */
export function smartFormFormatter(str: string): string {
    // Remove punctuation except periods, commas, forward slashes, apostrophes, colons, hyphens, and parentheses
    let sentence = retainAllowedPunctuation(str);
    // Capitalizing the first letter of each sentence
    sentence = capitalize(sentence);
    return sentence;
}
