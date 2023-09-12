import React from 'react';
import Delete from '../../../assets/delete.svg';
import style from './RemoveButton.module.scss';

const RemoveButton = ({ onClick }: any) => {
    return (
        <button
            className={style.removeButton}
            onClick={onClick}
            aria-label='remove'
        >
            <img src={Delete} alt='Remove' />
            <span>Remove</span>
        </button>
    );
};
export default RemoveButton;
