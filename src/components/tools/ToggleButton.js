import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

//functional component for a basic button that toggles to purple when active
export default function ToggleButton(props) {
    const {
        active,
        size,
        title,
        compact,
        condition,
        onToggleButtonClick,
        disabled,
        ariaLabel,
        className,
    } = props;

    return (
        <Button
            condition={condition}
            color={active ? 'violet' : '#0d5e70'} // violet
            active={active}
            onClick={onToggleButtonClick}
            basic={!active}
            size={size}
            compact={compact}
            title={title}
            disabled={disabled}
            aria-label={ariaLabel}
            className={className}
        >
            {title}
        </Button>
    );
}

ToggleButton.propTypes = {
    active: PropTypes.bool,
    compact: PropTypes.bool,
    condition: PropTypes.string | PropTypes.number,
    disabled: PropTypes.bool,
    onToggleButtonClick: PropTypes.func.isRequired,
    size: PropTypes.string,
    title: PropTypes.string,
    ariaLabel: PropTypes.string,
    className: PropTypes.string,
};
