import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import React from 'react';
import style from './YesAndNo.module.scss';
export default function YesAndNo({
    containerClasses = '',
    yesButtonClasses = '',
    noButtonClasses = '',
    noButtonActive = false,
    yesButtonActive = false,
    noButtonCondition = '',
    yesButtonCondition = '',
    handleNoButtonClick,
    handleYesButtonClick,
}) {
    return (
        <div className={`${style.YesNoButton} ${containerClasses} flex`}>
            <ToggleButton
                active={yesButtonActive}
                condition={yesButtonCondition}
                title='Yes'
                onToggleButtonClick={handleYesButtonClick}
                className={yesButtonClasses}
            />
            <ToggleButton
                active={noButtonActive}
                condition={noButtonCondition}
                title='No'
                onToggleButtonClick={handleNoButtonClick}
                className={noButtonClasses}
            />
        </div>
    );
}
