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
                <p className={style.selected__chip__title}>{item}</p>
                <span onClick={() => onRemove(item)}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24'
                        viewBox='0 -960 960 960'
                        width='24'
                    >
                        <path
                            fill='#fff'
                            d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'
                        />
                    </svg>
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
