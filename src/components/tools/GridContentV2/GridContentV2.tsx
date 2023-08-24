import React from 'react';
import AddRowButton from '../AddRowButton/AddRowButton';
import style from './GridContentV2.module.scss';

interface GridContentV2Props {
    header_titles: { title: string; col?: number }[];
    onAddRow?: () => void;
    rows: React.JSX.Element[] | React.JSX.Element;
    canAddNew?: boolean;
    name?: string;
}

export default function GridContenV2({
    header_titles,
    onAddRow,
    rows,
    canAddNew = true,
    name,
}: GridContentV2Props) {
    return (
        <div className={style.familyTable}>
            <table>
                <thead>
                    <tr>
                        {header_titles.map((item, index) => (
                            <th key={index}>{item.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
            {canAddNew && <AddRowButton onClick={onAddRow} name={name} />}
        </div>
    );
}
