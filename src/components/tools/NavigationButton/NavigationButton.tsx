import React from 'react';
import style from './NavigationButton.module.scss';

interface NavigationButtonProps {
    previousClick?: any;
    nextClick?: any;
    firstButtonLabel?: string;
    secondButtonLabel?: string;
}

const NavigationButton = ({
    previousClick,
    nextClick,
    firstButtonLabel = 'Previous',
    secondButtonLabel = 'Next',
}: NavigationButtonProps) => {
    return (
        <div className={style.navigationButton}>
            {previousClick && (
                <button
                    className='button outline'
                    onClick={($event) => {
                        previousClick($event);
                    }}
                >
                    {firstButtonLabel}
                </button>
            )}
            {nextClick && (
                <button
                    className='button'
                    onClick={($event) => {
                        nextClick($event);
                    }}
                >
                    {secondButtonLabel}
                </button>
            )}
        </div>
    );
};
export default NavigationButton;
