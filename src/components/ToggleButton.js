import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class ToggleButton extends Component {

    render() {
        const { active, size, title, compact, condition, onToggleButtonClick } = this.props;

        return (
            <Button
                condition={condition}
                color={active ? 'violet' : null}
                active={active}
                onClick={onToggleButtonClick}
                basic={!active}
                size={size}
                compact={compact}
                title={title}>
                {title}
            </Button>
        )
    }
}

ToggleButton.propTypes = {
  active: PropTypes.bool,
  compact: PropTypes.bool,
  condition: PropTypes.string,
  onToggleButtonClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  title: PropTypes.string
};