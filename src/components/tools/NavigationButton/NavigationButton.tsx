import ButtonLoader from '@components/ButtonLoader/ButtonLoader';
import React from 'react';
import style from './NavigationButton.module.scss';

interface NavigationButtonProps {
    previousClick?: any;
    nextClick?: any;
    firstButtonLabel?: string;
    secondButtonLabel?: string;
    loading?: boolean;
}

const NavigationButton = ({
    previousClick,
    nextClick,
    firstButtonLabel = 'Previous',
    secondButtonLabel = 'Next',
    loading = false,
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
                    disabled={loading}
                    onClick={($event) => {
                        nextClick($event);
                    }}
                >
                    {secondButtonLabel}
                    {loading && <ButtonLoader />}
                </button>
            )}
        </div>
    );
};
export default NavigationButton;
