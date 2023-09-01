import React from 'react';
import AddRowButton from '../AddRowButton/AddRowButton';
import style from './GridContent.module.scss';

interface GridContentProps {
    header_titles: { title: string; col?: number }[];
    onAddRow?: () => void;
    rows: React.JSX.Element[] | React.JSX.Element;
    canAddNew?: boolean;
    name?: string;
}

export default function GridContent({
    header_titles,
    onAddRow,
    rows,
    canAddNew = true,
    name,
}: GridContentProps) {
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
