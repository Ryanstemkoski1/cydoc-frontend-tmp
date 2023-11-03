import CustomModal from 'components/CustomModal/CustomModal';
import React, { useEffect, useRef, useState } from 'react';
import style from './Input.module.scss';
import monthStyle from './Select.module.scss';

interface Props {
    items: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    value?: string;
    disabled?: boolean;
    name?: string;
}

function Select({
    items,
    placeholder = '',
    onChange,
    value,
    disabled = false,
    name = '',
}: Props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handleMouseDown(e: MouseEvent) {
        if (!dropdownRef.current?.contains(e.target as HTMLElement)) {
            setShowDropdown(false);
        }
    }

    useEffect(() => {
        if (showDropdown)
            document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [showDropdown]);

    return (
        <div
            className={`${style.input} ${style.inputDropdown} ${style[name]}`}
            ref={dropdownRef}
        >
            <div className={style.input__search}>
                <input
                    type='text'
                    onChange={() => setShowDropdown(true)}
                    onClick={() => {
                        setShowDropdown(true);
                    }}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    readOnly
                />
            </div>

            <CustomModal
                headerShow={false}
                scrollDisable={false}
                modalVisible={showDropdown}
                onClose={() => setShowDropdown(false)}
            >
                <div className={`${monthStyle.monthCard} flex-wrap`}>
                    {items.map((item) => (
                        <div className={monthStyle.monthCard__item} key={item}>
                            <a
                                className={
                                    value === item ? monthStyle.active : ''
                                }
                                onClick={() => {
                                    onChange(item);
                                    setShowDropdown(false);
                                }}
                            >
                                {item}
                            </a>
                        </div>
                    ))}
                </div>
            </CustomModal>
        </div>
    );
}

export default Select;
