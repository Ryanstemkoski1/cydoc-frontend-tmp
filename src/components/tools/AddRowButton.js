import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './AddRowButton.css';

//Functional component for the add row option in notes
export default function AddRowButton(props) {
    const { ariaLabel, name, onClick } = props;
    return (
        <div className='add-row'>
            <Button
                basic
                circular
                icon='plus'
                onClick={onClick}
                aria-label={ariaLabel ?? 'add-row'}
            />
            add {name}
        </div>
    );
}

AddRowButton.propTypes = {
    ariaLabel: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
};
