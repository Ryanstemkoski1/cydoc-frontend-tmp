import React, {Fragment} from 'react';
import {Button} from "semantic-ui-react";
import PropTypes from 'prop-types';
import "../../css/components/addRowButton.css";

//Functional component for the add row option in notes
export default function AddRowButton(props) {
    const name = props.name 
    return <div className="add-row">
        <Button
            basic
            circular
            icon="plus"
            onClick={props.onClick}
        />
        add {name}
    </div>;
}

AddRowButton.propTypes = {onClick: PropTypes.func};