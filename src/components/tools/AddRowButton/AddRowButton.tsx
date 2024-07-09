import React, { MouseEventHandler } from 'react';
import style from './AddRowButton.module.scss';

interface Props {
    ariaLabel?: string;
    name?: string;
    onClick?: (() => void) | MouseEventHandler<HTMLButtonElement>;
}

//Functional component for the add row option in notes
export default function AddRowButton(props: Props) {
    const { ariaLabel = 'add-row', name, onClick } = props;
    return (
        <button
            className={style.addButton}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            <img src={'/images/add.svg'} alt='Add' />
            <span>Add {name}</span>
        </button>
    );
}
