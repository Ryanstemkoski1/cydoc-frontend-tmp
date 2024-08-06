import React from 'react';
import { HPIText } from '@utils/getHPIText';
import { capitalizeFirstLetter } from '../generateHpiText';
import styles from './HPINote.module.scss';

export function ParseAndRenderHpiNote({
    hpiText = '',
    isParagraphFormat = false,
}: {
    hpiText: string;
    isParagraphFormat: boolean;
}) {
    let parsedHPIText: HPIText[] | string = '';
    try {
        parsedHPIText = JSON.parse(hpiText) as HPIText[] | string;
    } catch (err) {
        parsedHPIText = hpiText;
    }

    if (isParagraphFormat) {
        const generatedParagraph = (parsedHPIText as HPIText[]).map((item) => {
            return (
                <div key={item.title} style={{ marginBottom: '10px' }}>
                    <b>{item.title}</b>
                    <br />
                    <span>{processSentence(formatSentence(item.text))}</span>
                    <br />
                </div>
            );
        });
        return <>{generatedParagraph}</>;
    } else {
        return <HpiNote text={parsedHPIText} bulletNoteView={true} />;
    }
}

function formatSentence(sentence: string) {
    // Replace 'Mr.|Ms.|Mx.' ends with space ' '.
    const updatedSentence = sentence
        .replace(/(\.)(?!\s)/g, '$1 ')
        // .replace(/\b(Mr\.|Ms\.|Mx\.)\b/g, (match) => match + ' ')
        .replace(/PARAGRAPHBREAK/g, '\n');

    return updatedSentence;
}

function processSentence(sentence: string) {
    let id = 1;
    const addHeading = (str: string) => {
        str = str
            .trim()
            .toLowerCase()
            .split(' ')
            .map((word) => capitalizeFirstLetter(word))
            .join(' ');
        return (
            <React.Fragment key={str + id++}>
                <br />
                {/* Added a new line before each heading specifically for Advanced Report Generation.*/}
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
            jsx.push(<br />);
            continue;
        }
        if (char === ':' && headingText.trim().length > 7) {
            jsx.push(addHeading(headingText));
            headingText = '';
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

const HpiNote = ({
    text,
    bulletNoteView = false,
    isAdvancedReport = false,
}: {
    text: HPIText[] | string;
    bulletNoteView?: boolean;
    isAdvancedReport?: boolean; // A boolean flag to identify Advanced Report generation.
}) => {
    if (typeof text === 'string') {
        return <p>{formatSentence(text)}</p>;
    }

    // This note is generated for the Advanced Report with changing any capitalization and punctuation.
    const notesForAdvancedReport = text.map((item) => {
        return (
            <li key={item.title} className={styles.listItem}>
                <b>{item.title}</b>
                <ul className={styles.noBullets}>
                    <span>{processSentence(formatSentence(item.text))}</span>
                </ul>

                {item.miscNote &&
                    item.miscNote.split('. ').map((sentence, index) => (
                        <li key={index}>
                            {capitalizeFirstLetter(sentence.trim())}
                            {sentence.trim().endsWith('.') ? '' : '.'}
                        </li>
                    ))}
            </li>
        );
    });

    const notes = !bulletNoteView
        ? text.map((item) => {
              return (
                  <p key={item.title}>
                      <b>{capitalizeFirstLetter(item.title)}</b>
                      <br />
                      {capitalizeFirstLetter(formatSentence(item.text))}
                      {item.miscNote ? (
                          <>
                              {' '}
                              <br />
                              <br />
                              {capitalizeFirstLetter(item.miscNote)}
                          </>
                      ) : (
                          ''
                      )}
                  </p>
              );
          })
        : text.map((item) => {
              // Split the text into sentences only at '. ' (period followed by space)
              const sentences = item.text
                  .split(/(?<=\.\s)/)
                  .filter((sentence) => sentence.trim().length > 0);
              return (
                  <li key={item.title} className={styles.listItem}>
                      <b>{item.title}</b>
                      <ul className={styles.noBullets}>
                          {sentences.map((sentence: string, index: number) => (
                              <li key={index}>
                                  {processSentence(
                                      formatSentence(sentence.trim())
                                  )}
                              </li>
                          ))}
                      </ul>

                      {item.miscNote &&
                          item.miscNote.split('. ').map((sentence, index) => (
                              <li key={index}>
                                  {capitalizeFirstLetter(sentence.trim())}
                                  {sentence.trim().endsWith('.') ? '' : '.'}
                              </li>
                          ))}
                  </li>
              );
          });

    // Display Notes
    const renderNotes =
        isAdvancedReport || bulletNoteView ? (
            <ul className={styles.noBullets}>
                {isAdvancedReport ? notesForAdvancedReport : notes}
            </ul>
        ) : (
            <>{notes}</>
        );
    return renderNotes;
};
export default HpiNote;
