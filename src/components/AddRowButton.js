import React, {Fragment} from 'react';
import {Button} from "semantic-ui-react";
import PropTypes from 'prop-types';

//Functional component for the add row option in notes
export default function AddRowButton(props) {
    return <Fragment>
        <Button
            basic
            circular
            icon="plus"
            onClick={props.onClick}
        />
        add row
    </Fragment>;
}

AddRowButton.propTypes = {onClick: PropTypes.func};