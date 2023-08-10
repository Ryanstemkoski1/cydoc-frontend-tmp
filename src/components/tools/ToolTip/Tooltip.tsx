import React from 'react';
import style from './Tooltip.module.scss';

interface ToolTipProps {
    children: any;
    messageContent: any;
    messageShow: boolean;
    direction?: 'top' | 'bottom';
}

const ToolTip = ({
    children,
    messageContent = '',
    messageShow,
    direction = 'top',
}: ToolTipProps) => {
    return (
        <div
            className={`${style.tooltip} ${
                direction == 'top' ? style.tooltipTop : ''
            }`}
        >
            {children}
            {messageShow && (
                <div className={style.tooltip__message}>{messageContent}</div>
            )}
        </div>
    );
};
export default ToolTip;
