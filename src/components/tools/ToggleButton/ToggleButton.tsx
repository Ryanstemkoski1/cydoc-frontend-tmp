import '@screens/EditNote/content/hpi/knowledgegraph/css/Button.css';
import PropTypes from 'prop-types';
import React from 'react';

export interface ButtonProps<T = string> {
    active?: boolean;
    title: string;
    condition?: T;
    onToggleButtonClick?: (
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
    } = props;

    // ensures "condition" is properly defaulted
    const propsWithCondition = {
        ...props,
        condition,
    } as ButtonProps & { condition: T };

    const extraProps = { condition };

    return (
        <button
            data-testid={`toggle-button-${condition}`}
            title={title}
            {...extraProps}
            onClick={(e) =>
                onToggleButtonClick &&
                onToggleButtonClick(e, propsWithCondition)
            }
            disabled={disabled}
            data-hover={false}
            className={`button outline info pill sm ${active ? 'active' : ''}`}
        >
            {title}
        </button>
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
