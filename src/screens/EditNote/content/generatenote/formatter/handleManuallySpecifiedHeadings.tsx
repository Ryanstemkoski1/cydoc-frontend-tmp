import { capitalizeFirstLetter } from '@utils/textGeneration/common/textUtils';

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

/**
 * A Helper Function to extract headings from a string based on a specific format.
 *
 * Headings are defined as at least 8 uppercase letters followed by a colon (`:`).
 *
 * e.g., ['REASON FOR REFERRAL:', 'PRESENTATION:'].
 * Usage: extractheadingsWithNormalText()
 */
export function extractHeadings(str: string): string[] {
    // Regular expression to match potential headings
    const headingRegex = /([A-Z\s]{8,}:)/g;
    // Extract headings
    const headings = str.match(headingRegex)?.filter(Boolean);
    // If no headings are found, return an empty array
    return headings || [];
}

/**
 * A Helper Function to capitalize the first letter of each word in the sentence,
 * ensuring that all other letters are in lowercase.
 *
 * Usage: extractheadingsWithNormalText()
 */
export function applyTitleCase(str: string) {
    return str
        .toLowerCase() // Convert the entire sentence to lowercase first
        .split(' ') // Split the sentence into words
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(' ');
}
