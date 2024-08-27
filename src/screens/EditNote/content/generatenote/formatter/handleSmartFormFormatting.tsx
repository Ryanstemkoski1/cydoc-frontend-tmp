import { capitalizeFirstLetter } from '../../../../../utils/textGeneration/common/textUtils';

/**
 * This function is designed to standardize and clean up generated text for
 * consistency in smart form contexts.
 * It formats text by editing punctuation and capitalizing the first
 * letter of each sentence.
 * TODO: Consider more cases
 * Usage: HpiNote
 */
export function smartFormFormatter(str: string): string {
    // Remove punctuation except periods, commas, forward slashes, apostrophes, colons, hyphens, and parentheses
    // let sentence = retainAllowedPunctuation(str);
    // Capitalizing the first letter of each sentence
    return capitalize(str);
}

/**
 * Removes punctuation except periods (.), commas (,),
 * forward slashes (/), apostrophes ('), colons (:), hyphens (-),
 * and parentheses (()).
 *
 * Usage: smartFromFormatter()
 */
export const retainAllowedPunctuation = (str: string): string => {
    return str.replace(/[^\w\s'.,:/@()-]/g, '');
};

/**
 * Capitalizes the first letter of each sentence and the standalone 'i' in the text.
 * However, ignore cases ("e.g", "i.g")
 * - Replaces standalone 'i' with 'I' to ensure proper capitalization.
 * - Capitalizes the first letter of the entire string if it's not empty.
 * - Capitalizes the first letter of each sentence following punctuation marks (.!?).
 * - Capitalizes the first letter following a colon when used in headings.
 *
 * Usage: smartFromFormatter()
 * */
export const capitalize = (hpiString: string): string => {
    // Define special cases to be handled
    const specialCases = /e\.g\.|i\.e\./gi;
    const placeholder = '__SPECIAL_CASE__';

    // Replace 'i' with a placeholder to avoid affecting 'i.e.'
    hpiString = hpiString.replace(/\bi\b(?!\.\s*(e\.|i\.e\.))/g, '__TEMP__');

    // Capitalize the very first letter of the string
    if (hpiString.length > 0) {
        hpiString = capitalizeFirstLetter(hpiString);
    }
    // Capitalize the first letter of each sentence after each [.?!]
    // but skip if followed by 'e.g.', 'i.e.', etc.
    hpiString = hpiString.replace(/([.?!])\s+([a-z])/g, (match, p1, p2) => {
        // Check if the previous text ends with a special case
        const precedingText = hpiString.slice(
            0,
            hpiString.indexOf(match) + match.length
        );
        const isSpecialCase = specialCases.test(precedingText);
        return isSpecialCase ? match : `${p1} ${p2.toUpperCase()}`;
    });

    // Replace the placeholder back to 'i'
    hpiString = hpiString.replace(/__TEMP__/g, 'I');

    // replace to capitalize the word after heading ends with ':'
    hpiString = hpiString.replace(/:\s+(\w)/g, (match, p1) => {
        return `: ${capitalizeFirstLetter(p1)}`;
    });
    return hpiString;
};
