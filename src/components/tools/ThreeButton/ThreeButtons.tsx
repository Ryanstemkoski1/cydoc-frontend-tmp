import { SubstanceUsageResponse } from 'constants/enums';
import React from 'react';
import ToggleButton from '../ToggleButton/ToggleButton';
import './ThreeButtons.css';

const HistoryButtons = ({
    value,
    onToggle,
    options,
    condition,
    keyToCompare,
}: {
    value: any;
    onToggle: any;
    options: any[];
    condition: string;
    keyToCompare: string;
}) => {
    const GenerateUsageButton = ({
        response,
        title,
    }: {
        response: SubstanceUsageResponse;
        title: string;
    }) => {
        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    onToggle(response);
                }}
                condition={condition}
                className='social-hist-buttons'
                title={title}
                active={value?.[keyToCompare] === response}
            />
        );
    };

    return (
        <div className='sur-block'>
            {options.map(
                (el: { value: SubstanceUsageResponse; label: string }) => {
                    return (
                        <GenerateUsageButton
                            key={el.label}
                            response={el.value}
                            title={el.label}
                        />
                    );
                }
            )}
        </div>
    );
};
export default HistoryButtons;
