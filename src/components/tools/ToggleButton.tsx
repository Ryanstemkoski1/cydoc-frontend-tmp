import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

export interface ButtonProps<T = string> {
    active: boolean;
    title: string;
    condition?: T;
    onToggleButtonClick: (
        e: React.MouseEvent,
        props: ButtonProps & { condition: T }
    ) => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
}
/**
 * functional component for a basic button that toggles to purple when active
 * @param props: Button Props
 * @returnsType "T" passed in is the type of "condition" with the onToggleButtonClick callback
 */
export default function ToggleButton<T = string>(props: ButtonProps<T>) {
    const {
        active,
        title,
        condition = '', // only used in onToggleButtonClick
        onToggleButtonClick,
        disabled,
        ariaLabel,
        className,
    } = props;

    // ensures "condition" is properly defaulted
    const propsWithCondition = {
        ...props,
        condition,
    } as ButtonProps & { condition: T };

    const cn =
        className === 'tag_text'
            ? 'hpi-chiefcomplaint-button'
            : 'hpi-ph-button';

    // NOTE: due to an issue with the semantic button, I've switched to Material UI's button
    // Below is a rough approximation of semantic button's css
    // update as needed with appropriate styling or delete entirely if we do a UI overhaul
    const semanticButtonStyles: React.CSSProperties = {
        backgroundClip: 'border-box',
        backgroundColor: active ? 'rgb(55, 59, 103)' : 'rgb(224, 225, 227)',
        borderBottomColor: 'white',
        color: active ? 'white' : 'black',
        borderRadius: '20px',
        border: '1px solid darkGrey',
        fontFamily: 'Nunito,Arial,Helvetica,sans-serif',
        fontSize: '1rem',
        margin: '0 .25em 0 0',
        textTransform: 'capitalize',
        outlineColor: 'rgb(0, 0, 0)',
        padding: '.4rem 1.2rem .4rem 1.2rem',
    };

    // extra props for testing & node identification
    const extraProps = { condition };

    return (
        <Button
            title={title}
            {...extraProps}
            onClick={(e) => onToggleButtonClick(e, propsWithCondition)}
            disabled={disabled}
            aria-label={ariaLabel}
            style={semanticButtonStyles}
            className={`${cn}${active ? '-selected' : ''} ${className}`}
        >
            {title}
        </Button>
    );
}

ToggleButton.propTypes = {
    active: PropTypes.bool,
    compact: PropTypes.bool,
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    onToggleButtonClick: PropTypes.func.isRequired,
    size: PropTypes.string,
    title: PropTypes.string,
    ariaLabel: PropTypes.string,
    className: PropTypes.string,
};
