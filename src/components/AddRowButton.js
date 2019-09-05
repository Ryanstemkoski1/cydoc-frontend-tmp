import React, {Fragment} from 'react';
import {Button} from "semantic-ui-react";
import PropTypes from 'prop-types';

export default class AddRowButton extends React.Component {
    render() {
        return <Fragment>
            <Button basic circular icon="plus" onClick={this.props.onClick}/>
            add row
        </Fragment>;
    }
}

AddRowButton.propTypes = {onClick: PropTypes.func};