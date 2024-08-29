/** Capitalizes first letter. */
export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Splits a string into sentences, while carefully handling special cases
 * like hyperlinks, titles, and abbreviations to prevent them from being
 * split incorrectly.
 *
 * This function performs the following steps:
 * 1. Temporarily replaces hyperlinks with placeholders to prevent them from being split.
 * 2. Replaces titles (e.g., "Mr.", "Ms.") with placeholders to avoid incorrect splitting.
 * 3. Replaces common abbreviations like "e.g." and "i.e." with placeholders to prevent them from being split.
 * 4. Splits the string into sentences based on periods, with an optional flag to modify the splitting behavior.
 * 5. Restores the original content for titles, abbreviations, and hyperlinks after splitting.
 *
 * Details:
 * - By default, uses regex to split on periods followed by one or more
 *   whitespace characters.
 * - If `flag` is true, splits on periods followed by whitespace while
 *   preserving [NEW LINE] characters.
 * - Unique placedholders to avoid splitting these cases:
 *   a. hyperlinks,
 *   b. titles(e.g., "Mr.", "Ms."),
 *   c. common abbreviations (e.g., "e.g.", "i.e.")
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
    // Regular expression to match hyperlinks including those without schema
    const hyperlinkRegex =
        /(\b(?:http|https):\/\/[^\s]+|www\.[^\s]+)(?=\s|$)/gi;
    const hyperlinkPlaceholder = '__HYPERLINK__';
    const hyperlinkMap = new Map<string, string>();

    // Replace hyperlinks with placeholders
    str = str.replace(hyperlinkRegex, (match) => {
        const key = `${hyperlinkPlaceholder}${hyperlinkMap.size}`;
        hyperlinkMap.set(key, match);
        return key;
    });

    // Replace titles like "Mr.", "Mx.", "Ms." with placeholders to avoid splitting them
    str = str
        .replace(/Mr\.\s+/g, '__MR__')
        .replace(/Ms\.\s+/g, '__MS__')
        .replace(/Mx\.\s+/g, '__MX__');

    // Replace "e.g." and "i.e." with placeholders to avoid splitting them
    str = str.replace(/\be\.g\./g, '__EG__').replace(/\bi\.e\./g, '__IE__');

    // Split the string by '. ' or '.\n', but not after titles if flag is true,
    const strArr = flag ? str.split(/(?<=\.\s)/) : str.split(/(?<=\.)\s+/);

    // Restore placeholders to their original content for each sentence
    const result = strArr.map((sentence) => {
        return sentence
            .replace(/__EG__/g, 'e.g.')
            .replace(/__IE__/g, 'i.e.')
            .replace(/__MR__/g, 'Mr. ')
            .replace(/__MS__/g, 'Ms. ')
            .replace(/__MX__/g, 'Mx. ')
            .replace(
                /__HYPERLINK__\d+/g,
                (match) => hyperlinkMap.get(match) || match
            );
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

/**
 * A Helper Function that extracts text inside quotation marks, replaces it with a keyword,
 * and returns both the modified text and a map of the keywords to their original quoted text.
 *
 * e.g:
 * text = 'When asked to describe her father\'s occupation at that time, she replied, "He was a carpenter,"
 *         and when asked about her mother\'s occupation, she stated, "She cleaned houses."';
 *
 * returns:
 * --> replacedText = 'When asked to describe her father\'s occupation at that time, she replied, "Q1R,"
 *                      and when asked about her mother\'s occupation, she stated, "Q2R."'
 *
 * --> quotedTextMap = { Q1R: '"He was a carpenter,"', Q2R: '"She cleaned houses."' }
 */
export const replaceQuotedTextWithKeyword = (
    text: string
): { replacedText: string; quotedTextMap: { [key: string]: string } } => {
    const regex = /"([^"]*)"/g;
    const quotedTextMap: { [key: string]: string } = {};
    let replacedText = text;
    let match: RegExpExecArray | null;
    let counter = 1;

    // Find all matches and replace with keywords
    while ((match = regex.exec(text)) !== null) {
        const quotedText = match[1];
        const keyword = `Q${counter}R`;

        // Update the map with the quoted text and its keyword
        quotedTextMap[keyword] = quotedText;

        // Replace the quoted text with its keyword in the replacedText
        replacedText = replacedText.replace(`"${quotedText}"`, `"${keyword}"`);

        counter++;
    }

    return { replacedText, quotedTextMap };
};

/**
 * A Helper Function is designed to replace specific words in a string with
 * new words based on a given mapping,
 * while also handling punctuation and sentence boundaries.
 *
 * Usage: fillMedicalTerms, abbreviate, handlePAITerms, fillNameAndPronouns
 */
export const replaceMappedWords = (
    hpiString: string,
    mapping: { [key: string]: string }
): string => {
    const END_OF_SENTENCE_PUNC = '.!?';
    Object.entries(mapping).forEach(([key, value]) => {
        const regex = new RegExp(
            `\\b${key}([${END_OF_SENTENCE_PUNC},:]?)\\b`,
            'gi'
        );
        hpiString = hpiString.replace(regex, (match, punctuation) => {
            // Preserve the original case of the first letter
            const replacement =
                match[0] === match[0].toUpperCase()
                    ? capitalizeFirstLetter(value)
                    : value;
            return `${replacement}${punctuation}`;
        });
    });
    return hpiString;
};
