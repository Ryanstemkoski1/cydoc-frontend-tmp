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
                    <b style={{ textDecoration: 'underline' }}>{item.title}</b>
                    <br />
                    <span>{item.text}</span>
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
}: {
    text: HPIText[] | string;
    bulletNoteView?: boolean;
}) => {
    if (typeof text === 'string') {
        return <p>{text}</p>;
    }

    const notes = !bulletNoteView
        ? text.map((item) => {
            return (
                <p key={item.title}>
                    <b style={{ textDecoration: 'underline' }}>{capitalizeFirstLetter(item.title)}</b>
                    <br />
                    {capitalizeFirstLetter(item.text)}
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
                    <b style={{ textDecoration: 'underline' }}>{item.title}</b>
                    <ul className={styles.noBullets}>
                        {item.text.split('. ').map((sentence, index, arr) => (
                            <li key={index}>
                                {processSentence(
                                    capitalizeFirstLetter(sentence)
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

    if (bulletNoteView) {
        return <ul className={styles.noBullets}>{notes}</ul>;
    }
    return <>{notes}</>;
};
export default HpiNote;
