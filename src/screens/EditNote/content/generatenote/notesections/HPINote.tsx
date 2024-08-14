import React from 'react';
import { HPIText } from '@utils/getHPIText';
import {
    splitByPeriod,
    standardFormatter,
    capitalizeWords,
} from '../generateHpiText';
import styles from './HPINote.module.scss';

/**
 * Helper function to process a given sentence and formats it into JSX elements based on certain rules.
 *
 * This function takes a string sentence and formats it into an array of JSX elements. It handles the differentiation
 * between headings and normal text based on the length of text and specific characters such as newlines and colons.
 * The output format is affected by the `isParagraphFormat` flag which determines whether to add additional line breaks.
 *
 * - Headings are bold and capitalized, added if text length exceeds 7 characters.
 * - Normal text is rendered as is.
 * - Handles newlines and colons for formatting.
 * - Adds extra line breaks if `isParagraphFormat` is true.
 *
 */
function formatSentenceHeadingsAndNewlines(
    sentence: string,
    isParagraphFormat?: boolean
) {
    let id = 1;
    const addHeading = (str: string) => {
        str = capitalizeWords(str.trim());
        return (
            <React.Fragment key={str + id++}>
                <br />
                <b>{str}</b>
                <br />
            </React.Fragment>
        );
    };
    const addNormalText = (str: string) => (
        <React.Fragment key={str + id++}>{str}</React.Fragment>
    );

    let normalText = '';
    let headingText = '';
    let toggle = false; // To control new lines in paragraphs, separating headings from text.
    const jsx: JSX.Element[] = [];

    for (const char of sentence) {
        // Handle newlines
        if (char === '\n') {
            if (headingText.trim().length > 0) {
                if (headingText.trim().length >= 7) {
                    jsx.push(addHeading(headingText));
                } else {
                    jsx.push(addNormalText(headingText));
                }
                headingText = '';
            }
            if (normalText.trim().length > 0) {
                jsx.push(addNormalText(normalText));
                normalText = '';
            }
            // Add a line break
            if (isParagraphFormat) {
                jsx.push(<br />);
            }
            continue;
        }
        if (char === ':' && headingText.trim().length > 7) {
            if (isParagraphFormat && toggle) {
                jsx.push(<br />);
            }
            jsx.push(addHeading(headingText));
            headingText = '';
            toggle = true;
            continue;
        }

        if (char === ' ') {
            if (headingText.length > 0) headingText += ' ';
            else normalText += ' ';
            continue;
        }

        if ((char.match(/[A-Z]/g) ?? []).length) {
            headingText += char;
            jsx.push(addNormalText(normalText + ' '));
            normalText = '';
        } else {
            normalText += char;
            if (headingText.trim().length >= 7) {
                jsx.push(addHeading(headingText));
            } else {
                jsx.push(addNormalText(headingText));
            }
            headingText = '';
        }
    }

    jsx.push(addNormalText(normalText));

    if (headingText.trim().length >= 7) {
        jsx.push(addHeading(headingText));
    } else {
        jsx.push(addNormalText(headingText));
    }

    return jsx.map((el, index) => {
        return <React.Fragment key={index}>{el}</React.Fragment>;
    });
}

/**
 * The HpiNote component is responsible for formatting and displaying Generate Notes. It manages the presentation of
 * notes either as a list or paragraph based on the provided flags[`isAdvancedReport` and `isParagraphFormat`].
 *
 * - Advanced Report: Formats the text without altering punctuation or capitalization.
 * - Standard Format: Truncates the beginning of sentences, capitalizes the first letter of each sentence, and applies specific formatting rules.
 *
 * Function Calls:
 * - standardFormatter: Truncates the beginning of sentences and capitalizes the first letter of each sentence
 * - formatSentenceHeadingsAndNewlines: Formats text by handling sentence headings and inserting newlines as needed. Adjusts formatting based on whether it’s an advanced report or not.
 * - splitByPeriod: Splits text into individual sentences based on periods. Helps in creating list items from the text.
 *
 * @param {HPIText[]} props.text - The text data to be formatted and displayed.
 * @param {boolean} [props.isParagraphFormat=false] - Flag to determine if the text should be displayed in paragraph format.
 * @param {boolean} [props.isAdvancedReport=false] - Flag to determine if the text is for an advanced report, which affects text formatting.
 */
const HpiNote = ({
    text,
    isParagraphFormat = false,
    isAdvancedReport = false,
}: {
    text: HPIText[];
    isParagraphFormat?: boolean;
    isAdvancedReport?: boolean; // A boolean flag to identify Advanced Report generation.
}) => {
    if (!text || text.length === 0 || !Array.isArray(text)) {
        return <div>No history of present illness reported</div>;
    }

    const notes = text.map((item) => {
        // For non-advanced reports: Sentence beginnings are being cut off, and each sentence appears on a new line.
        const mainTexts = isAdvancedReport
            ? item.text
            : standardFormatter(item.text);
        const miscTexts = isAdvancedReport
            ? item.miscNote
            : standardFormatter(item.miscNote);

        // Display the generated notes as a paragraph:
        if (isAdvancedReport || isParagraphFormat) {
            return (
                <div key={item.title} style={{ marginBottom: '10px' }}>
                    <b>{item.title}</b>
                    <br />
                    <span>
                        {formatSentenceHeadingsAndNewlines(mainTexts, true)}
                    </span>
                    <br />
                    {miscTexts && (
                        <span>
                            {formatSentenceHeadingsAndNewlines(miscTexts, true)}
                        </span>
                    )}
                </div>
            );
        }

        // Display the generated notes as a list:
        const sentences = item.text.length
            ? splitByPeriod(mainTexts).filter((sentence) => sentence.length > 0)
            : [];

        const miscSentences = item.miscNote
            ? splitByPeriod(miscTexts).filter((sentence) => sentence.length > 0)
            : [];

        return (
            <li key={item.title} className={styles.noBullets}>
                <b>{item.title}</b>
                <ul className={styles.noBullets}>
                    {sentences.map((sentence: string, index: number) => (
                        <li key={index}>
                            {formatSentenceHeadingsAndNewlines(sentence)}
                        </li>
                    ))}
                </ul>
                <br />
                {item.miscNote &&
                    miscSentences.map((sentence, index) => (
                        <li key={index}>
                            {formatSentenceHeadingsAndNewlines(sentence)}
                        </li>
                    ))}
            </li>
        );
    });

    return notes;
};
export default HpiNote;
