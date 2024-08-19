import React from 'react';
import { HPIText } from '@utils/textGeneration/extraction/getHPIArray';
import { extractHeadingsWithNormalText } from '../formatter/handleManuallySpecifiedHeadings';
import styles from './HPINote.module.scss';
import { splitByPeriod } from '@utils/textGeneration/common/textUtils';
import { smartFormFormatter } from '../formatter/handleSmartFormFormatting';

/**
 * The HpiNote component is responsible for formatting and displaying the HPI.
 * Text can be displayed either as a list or paragraph based on the provided
 * flags[`isAdvancedReport` and `isParagraphFormat`].
 * - Advanced Report: Formats the text without altering punctuation or
 *   capitalization.
 * - Standard Format (for Smart Patient Intake Form): Truncates the beginning
 *   of sentences, capitalizes the first letter of each sentence,
 *   and applies specific formatting rules.
 *
 * Function Calls:
 * - smartFormFormatter: Truncates the beginning of sentences and capitalizes
 *   the first letter of each sentence for standard formatting.
 * - formatSentenceHeadingsAndNewlines: Formats text by managing headings
 *   and newlines, adjusting for advanced reports if applicable.
 * - splitByPeriod: Splits text into sentences while retaining periods,
 *   useful for creating list items from text.
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
    // Handle 'No history of present illness reported.'
    if (typeof text === 'string') {
        return <p>{text}</p>;
    }

    const notes = text.map((item) => {
        // For non-advanced reports: Sentence beginnings are being cut off,
        // and capitalizes the first letter of each sentence.
        const mainTexts =
            !isAdvancedReport && item.text
                ? smartFormFormatter(item.text)
                : item.text;

        const miscTexts =
            !isAdvancedReport && item.miscNote
                ? smartFormFormatter(item.miscNote)
                : item.miscNote;

        // extract heading and associated normal text
        const headingsAndTexts: { heading: string; normalText: string }[] =
            extractHeadingsWithNormalText(mainTexts);

        // Display the generated notes as a paragraph:
        if (isAdvancedReport || isParagraphFormat) {
            return (
                <div key={item.title} style={{ marginBottom: '10px' }}>
                    <b>{item.title}</b>
                    <br />
                    {headingsAndTexts.map(({ heading, normalText }, index) => (
                        <div key={index} style={{ whiteSpace: 'pre-line' }}>
                            {heading && (
                                <>
                                    <br />
                                    <b>{heading}</b>
                                    <br />
                                </>
                            )}
                            <span>{normalText}</span>
                        </div>
                    ))}
                    {miscTexts && <span>{miscTexts}</span>}
                </div>
            );
        }

        // Display the generated notes as a list:
        return (
            <li key={item.title} className={styles.noBullets}>
                <b>{item.title}</b>
                {headingsAndTexts.map(({ heading, normalText }, index) => {
                    return (
                        <ul
                            className={styles.noBullets}
                            key={index}
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {heading && (
                                <>
                                    <br />
                                    <b>{heading}</b>
                                    <br />
                                </>
                            )}
                            {splitByPeriod(normalText).map(
                                (sentence: string, index: number) => {
                                    return <li key={index}>{sentence}</li>;
                                }
                            )}
                        </ul>
                    );
                })}
                <br />
                {item.miscNote &&
                    splitByPeriod(miscTexts).map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                    ))}
            </li>
        );
    });

    return notes;
};

export default HpiNote;
