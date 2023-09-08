import React from 'react';
import { HPIText } from 'utils/getHPIText';
import { capitalizeFirstLetter } from '../generateHpiText';
import styles from './HPINote.module.scss';

export function ParseAndRenderHpiNote({ hpiText = '' }: { hpiText: string }) {
    let parsedHPIText: HPIText[] | string = '';
    try {
        parsedHPIText = JSON.parse(hpiText) as HPIText[] | string;
    } catch (err) {
        parsedHPIText = hpiText;
    }

    return <HpiNote text={parsedHPIText} bulletNoteView={false} />;
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
                      <b>{capitalizeFirstLetter(item.title)}</b>
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
                      <b>{item.title}</b>
                      {item.text.split('. ').map((sentence, index) => (
                          <li key={index}>{capitalizeFirstLetter(sentence)}</li>
                      ))}

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
