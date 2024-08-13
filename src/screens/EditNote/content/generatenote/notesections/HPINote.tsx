import React from 'react';
import { HPIText } from '@utils/getHPIText';
import { splitByPeriod, capitalize, removePhrases } from '../generateHpiText';
import styles from './HPINote.module.scss';

/**
 * Processes a given sentence and formats it into JSX elements based on certain rules.
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
 * TODO: Issue caused by .trim()
 */
function processSentence(sentence: string, isParagraphFormat?: boolean) {
    let id = 1;
    const addHeading = (str: string) => {
        str = str
            .trim()
            .toLowerCase()
            .split(' ')
            .map((word) => capitalize(word))
            .join(' ');
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

    // TODO: trim is always call here();
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
            jsx.push(addNormalText(normalText));
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
 * HpiNote: Formats and displays the generated text based on `isAdvancedReport` and `isParagraphFormat`.
 *
 * - Advanced Report: Formats text without changing any punctuation or capitalization.
 * - Other Formats: Truncates sentences at the beginning and capitalizes the first letter of each sentence.
 * - Processes special tokens like PARAGRAPHBREAK as needed (this is not specific to a particular product type).
 * - Finalizes formatting and displays the text and titles appropriately.
 *
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
        const mainTexts = isAdvancedReport
            ? item.text
            : capitalize(removePhrases(item.text));
        const miscTexts = isAdvancedReport
            ? item.miscNote
            : capitalize(removePhrases(item.miscNote));

        if (isAdvancedReport || isParagraphFormat) {
            return (
                <div key={item.title} style={{ marginBottom: '10px' }}>
                    <b>{item.title}</b>
                    <br />
                    <span>{processSentence(mainTexts, true)}</span>
                    <br />
                    {miscTexts && (
                        <span>{processSentence(miscTexts, true)}</span>
                    )}
                </div>
            );
        }

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
                        <li key={index}>{processSentence(sentence)}</li>
                    ))}
                </ul>
                <br />
                {item.miscNote &&
                    miscSentences.map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                    ))}
            </li>
        );
    });

    return notes;
};
export default HpiNote;
