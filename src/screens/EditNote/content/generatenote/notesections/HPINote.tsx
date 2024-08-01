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
                    <span>
                        {item.text.replace(
                            /Mr\.|Ms\.|Mx\./g,
                            (match) => match + ' '
                        )}
                    </span>
                    <br />
                </div>
            );
        });
        return <>{generatedParagraph}</>;
    } else {
        return <HpiNote text={parsedHPIText} bulletNoteView={true} />;
    }
}

function processSentence(sentence: string) {
    let id = 1;

    // Replace the string PARAGRAPHBREAK with a newline character.
    sentence = sentence.replace(/PARAGRAPHBREAK/g, '\n');

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
                {id !== 1 ? <br /> : null}
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
        return <p>{text}</p>;
    }

    // This note is generated for the Advanced Report with changing any capitalization and punctuation.
    const notesForAdvancedReport = text.map((item) => {
        return (
            <li key={item.title} className={styles.listItem}>
                <b>{item.title}</b>
                <ul className={styles.noBullets}>
                    <span>
                        {processSentence(
                            item.text.replace(
                                /Mr\.|Ms\.|Mx\./g,
                                (match) => match + ' '
                            )
                        )}
                    </span>
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
                      {capitalizeFirstLetter(
                          item.text.replace(
                              /Mr\.|Ms\.|Mx\./g,
                              (match) => match + ' '
                          )
                      )}
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
              return (
                  <li key={item.title} className={styles.listItem}>
                      <b>{item.title}</b>
                      <ul className={styles.noBullets}>
                          {item.text.split('. ').map((sentence, index, arr) => (
                              <li key={index}>
                                  {processSentence(
                                      capitalizeFirstLetter(sentence).replace(
                                          /Mr\.|Ms\.|Mx\./g,
                                          (match) => match + ' '
                                      )
                                  )}
                                  {index < arr.length - 1 && '.'}
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
