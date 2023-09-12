import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '../../assets/images/search.svg';
import style from './Input.module.scss';
interface Props {
    items: { title: string; onClick: (event?: any) => void }[];
    placeholder?: string;
    value: string;
    onChange: (event: any) => void;
    minCharacter?: number;
}

function Search({
    items,
    placeholder,
    value,
    onChange,
    minCharacter = 1,
}: Props) {
    const [showDropdown, setShowDropdown] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showDropdown) {
            setShowDropdown(true);
        }
    }, [value]);

    function handleMouseDown(e: any) {
        if (!dropdownRef.current?.contains(e.target)) {
            setShowDropdown(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    });

    return (
        <div ref={dropdownRef}>
            <div className={style.input}>
                <div className={style.input__search}>
                    <input
                        type='text'
                        onChange={onChange}
                        placeholder={placeholder}
                        value={value}
                    />
                    <img src={SearchIcon} alt='Search' />
                </div>

                {items && value.length > minCharacter && showDropdown && (
                    <div className={style.input__suggestion}>
                        {items.map((item) => (
                            <a
                                key={item.title}
                                onClick={(e) => {
                                    item.onClick();
                                    setShowDropdown(false);
                                }}
                            >
                                {item.title}
                            </a>
                        ))}
                        {!items.length && <span>No record found</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
