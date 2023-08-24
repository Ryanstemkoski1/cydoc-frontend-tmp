import Loader from 'components/tools/Loader/Loader';
import { Clinician } from 'pages/BrowseNotes/BrowseNotes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import style from './Input.module.scss';

interface Props {
    items: Clinician[] | null;
    placeholder?: string;
    onChange: (id: number) => void;
    canEnterNewValue?: boolean;
    value?: any;
}

function getDummyClinician(value: string): Clinician {
    return {
        first_name: value,
        last_name: '',
        id: -1,
        email: '',
        institution_id: -1,
    };
}

export function getFullName(first_name: string, last_name: string) {
    return `${last_name}, ${first_name}`;
}

function getfilteredItems(
    items: Clinician[] | null,
    value: string,
    canEnterNewValue: boolean
) {
    if (items === null) {
        return null;
    }

    let filteredItems = items.filter((item) =>
        getFullName(item.first_name, item.last_name).includes(value)
    );

    filteredItems =
        canEnterNewValue && value
            ? [getDummyClinician(value), ...filteredItems]
            : filteredItems;
    return filteredItems;
}

function DropdownForClinicians({
    items,
    placeholder = '',
    onChange,
    canEnterNewValue = false,
    value: defaultValue = '',
}: Props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredItems = useMemo(
        () => getfilteredItems(items, value, canEnterNewValue),
        [items, value, canEnterNewValue]
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

            {showDropdown &&
                (filteredItems === null ? (
                    <Loader />
                ) : (
                    <div className={style.input__suggestion}>
                        {filteredItems.map((item) => (
                            <a
                                key={item.id}
                                onClick={() => {
                                    onChange(item.id);
                                    setShowDropdown(false);
                                    setValue(
                                        getFullName(
                                            item.first_name,
                                            item.last_name
                                        )
                                    );
                                }}
                            >
                                {getFullName(item.first_name, item.last_name)}
                            </a>
                        ))}
                        {!filteredItems.length && <span>No record found</span>}
                    </div>
                ))}
        </div>
    );
}

export default DropdownForClinicians;
