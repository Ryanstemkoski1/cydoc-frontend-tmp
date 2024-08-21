import '@screens/EditNote/content/hpi/knowledgegraph/css/Button.css';
import React from 'react';
import { Button } from '@mui/material';
import style from './ToggleButton.module.scss';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

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

    const customButtonStyle = {
        padding: '8px 22px',
        borderRadius: '10px',
        color: active ? 'white' : '#047A9B',
        backgroundColor: active ? '#047A9B' : '#EAF3F5',
        boxShadow: active
            ? '0px 1px 20px 0px rgba(5, 122, 155, 0.04), 0px 2px 20px 0px rgba(5, 122, 155, 0.12), 0px 3px 2px -2px rgba(26, 82, 97, 0.20)'
            : 'none',

        '&:hover': {
            backgroundColor: active ? '#047A9B' : '#EAF3F5',
            boxShadow: active
                ? '0px 1px 20px 0px rgba(5, 122, 155, 0.04), 0px 2px 20px 0px rgba(5, 122, 155, 0.12), 0px 3px 2px -2px rgba(26, 82, 97, 0.20)'
                : 'none',
        },
    };

    return (
        <Button
            {...extraProps}
            variant='contained'
            data-testid={`toggle-button-${condition}-${title}`}
            title={title}
            data-hover={false}
            disabled={disabled}
            sx={customButtonStyle}
            className={style.toogleButton}
            onClick={(e) =>
                onToggleButtonClick &&
                onToggleButtonClick(e, propsWithCondition)
            }
        >
            {active && <CheckRoundedIcon />}
            <span className={style.toogleButton__title}>{title}</span>
        </Button>
    );
}
