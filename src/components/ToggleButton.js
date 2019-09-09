import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, data){
        this.props.onToggleButtonClick(event, data);
    }
    render() {
        const { active, size, title, compact, condition } = this.props;

        return (
            <Button
                condition={condition}
                color={active ? 'violet' : null}
                active={active}
                onClick={this.handleClick}
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