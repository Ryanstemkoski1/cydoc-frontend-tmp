import PropTypes from 'prop-types';
import React from 'react';
import style from './AddRowButton.module.scss';

//Functional component for the add row option in notes
export default function AddRowButton(props) {
    const { name, onClick } = props;
    return (
        <button
            className={style.addButton}
            onClick={onClick}
            aria-label='add-row'
        >
            <img src={'/images/add.svg'} alt='Add' />
            <span>Add {name}</span>
        </button>
    );
}

AddRowButton.propTypes = {
    ariaLabel: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
};
