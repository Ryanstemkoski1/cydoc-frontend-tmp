import React, { useEffect, useRef, useState } from 'react';
import style from './Input.module.scss';

interface Props {
    items: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    value?: any;
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
            className={`${style.input} ${style.inputDropdown} ${style[name]}`}
            ref={dropdownRef}
        >
            <div className={style.input__search}>
                <input
                    type='text'
                    onChange={() => setShowDropdown(true)}
                    onClick={() => {
                        setShowDropdown(true);
                        onChange('');
                    }}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    readOnly
                />
            </div>

            {showDropdown && (
                <div className={style.input__suggestion}>
                    {items.map((item) => (
                        <a
                            key={item}
                            onClick={() => {
                                onChange(item);
                                setShowDropdown(false);
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Select;
