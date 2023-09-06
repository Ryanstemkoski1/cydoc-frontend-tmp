import React from 'react';
import { HPIText } from 'utils/getHPIText';

export function ParseAndRenderHpiNote({ hpiText = '' }: { hpiText: string }) {
    const parsedHPIText = JSON.parse(hpiText) as HPIText[] | string;
    return <HpiNote text={parsedHPIText} />;
}

const HpiNote = ({ text }: { text: HPIText[] | string }) => {
    if (typeof text === 'string') {
        return <p>{text}</p>;
    }
    const notes = text.map((item) => {
        return (
            <p key={item.title}>
                <b>{item.title}</b>
                <br />
                {item.text}
                {item.miscNote ? (
                    <>
                        {' '}
                        <br />
                        <br />
                        {item.miscNote}
                    </>
                ) : (
                    ''
                )}
            </p>
        );
    });
    return <>{notes}</>;
};
export default HpiNote;
