import React from 'react';
import Dropdown from './Dropdown';
import style from './MultiSelectDropdown.module.scss';
interface MultiSelectDropdownProps {
    selectedDropdownItems: string[];
    dropdownItems: string[];
    onSelected: (name: string) => void;
    onRemove: (name: string) => void;
}

const MultiSelectDropdown = (props: MultiSelectDropdownProps) => {
    const { selectedDropdownItems, dropdownItems, onSelected, onRemove } =
        props;

    const renderSelectedDropdownItems = selectedDropdownItems.map((item) => {
        return (
            <div
                className={`${style.selected__chip} button sm pill`}
                key={item}
            >
                {item}
                <span onClick={() => onRemove(item)}>
                    <img src={'/images/close-white.svg'} alt='x' />
                </span>
            </div>
        );
    });

    return (
        <div>
            {renderSelectedDropdownItems.length > 0 && (
                <div className={`${style.selected__wrap} flex-wrap`}>
                    {renderSelectedDropdownItems}
                </div>
            )}
            <Dropdown
                items={dropdownItems}
                onChange={onSelected}
                placeholder='Enter form names'
                canEnterNewValue={false}
                resetValueAfterClick={true}
            />
        </div>
    );
};

export default MultiSelectDropdown;
