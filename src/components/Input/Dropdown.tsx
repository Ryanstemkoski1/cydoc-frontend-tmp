import React, { useEffect, useMemo, useRef, useState } from 'react';
import style from './Input.module.scss';

interface Props {
    items: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    canEnterNewValue?: boolean;
    value?: any;
    resetValueAfterClick?: boolean;
}

function getfilteredItems(
    items: string[],
    value: string,
    canEnterNewValue: boolean
) {
    value = value.toLowerCase();

    let filteredItems = items.filter((item) =>
        item.toLowerCase().includes(value)
    );

    filteredItems =
        canEnterNewValue && value ? [value, ...filteredItems] : filteredItems;
    return filteredItems;
}

function Dropdown({
    items,
    placeholder = '',
    onChange,
    canEnterNewValue = false,
    resetValueAfterClick = false,
    value: defaultValue = '',
}: Props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredItems = useMemo(
        () => getfilteredItems(items, value, canEnterNewValue),
        [canEnterNewValue, items, value]
    );

    function handleMouseDown(e: any) {
        if (!dropdownRef.current?.contains(e.target)) {
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
            className={`${style.input} ${style.inputDropdown}`}
            ref={dropdownRef}
        >
            <div className={style.input__search}>
                <input
                    type='text'
                    onChange={(e) => {
                        if (!showDropdown) setShowDropdown(true);
                        setValue(e.target.value);
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(true);
                    }}
                    placeholder={placeholder}
                    value={value}
                />
            </div>

            {filteredItems && showDropdown && (
                <div className={style.input__suggestion}>
                    {filteredItems.map((item) => (
                        <a
                            key={item}
                            onClick={() => {
                                onChange(item);
                                setShowDropdown(false);
                                if (resetValueAfterClick) {
                                    setValue('');
                                } else {
                                    setValue(item);
                                }
                            }}
                        >
                            {item}
                        </a>
                    ))}
                    {!filteredItems.length && <span>No record found</span>}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
