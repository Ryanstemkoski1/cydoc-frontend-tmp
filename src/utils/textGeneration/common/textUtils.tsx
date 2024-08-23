/** Capitalizes first letter. */
export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
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

/**
 * Function to capitalizes the replacement word if the original
 * word starts with an uppercase letter.
 */
export const replaceWordCaseSensitive = (word: string, replace: string) => {
    return /^[A-Z]/.test(word.trim())
        ? capitalizeFirstLetter(replace)
        : replace;
};
