import React from 'react';
import style from './RemoveButton.module.scss';

const RemoveButton = ({ onClick }: any) => {
    return (
        <button
            className={style.removeButton}
            onClick={onClick}
            aria-label='remove'
        >
            <img src={'/images/delete.svg'} alt='Remove' />
            <span>Remove</span>
        </button>
    );
};
export default RemoveButton;
