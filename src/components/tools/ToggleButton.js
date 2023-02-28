import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

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

    const cn =
        className === 'tag_text'
            ? 'hpi-chiefcomplaint-button'
            : 'hpi-ph-button';

    return (
        <Button
            condition={condition}
            active={active}
            onClick={onToggleButtonClick}
            size={size}
            compact={compact}
            title={title}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${cn}${active ? '-selected' : ''} ${className}`}
        >
            {title}
        </Button>
    );
}

ToggleButton.propTypes = {
    active: PropTypes.bool,
    compact: PropTypes.bool,
    condition: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    disabled: PropTypes.bool,
    onToggleButtonClick: PropTypes.func.isRequired,
    size: PropTypes.string,
    title: PropTypes.string,
    ariaLabel: PropTypes.string,
    className: PropTypes.string,
};
