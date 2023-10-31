import React from 'react';
import Input from './Input';
import style from './MobileDatePicker.module.scss';
import Select from './Select';

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

interface DatePickerProps {
    value?: string;
    handleChange: (value: string) => void;
    disabled?: boolean;
}

const isLeapYear = (year: number) =>
    year !== 0 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);

function handleKeyPress(e: React.KeyboardEvent<HTMLElement>) {
    const charCode = typeof e.which == 'undefined' ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);

    if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
}

function handlePaste(e: React.ClipboardEvent<HTMLElement>) {
    e.preventDefault();
    return;
}

function validateDate(
    day: number | string,
    monthIndex: number | string,
    year: number | string
) {
    day = Number(day);
    monthIndex = Number(monthIndex);
    year = Number(year);

    let maxDaysAllowed = 31;

    if (monthIndex === 2) {
        maxDaysAllowed = isLeapYear(year) ? 29 : 28;
    } else {
        maxDaysAllowed = [4, 6, 9, 11].includes(monthIndex) ? 30 : 31;
    }

    if (day > maxDaysAllowed) {
        day = 0;
    }

    return {
        newDay: String(day).padStart(2, '0'),
        newMonthIndex: String(monthIndex).padStart(2, '0'),
        newYear: String(year).padStart(4, '0'),
    };
}

const MobileDatePicker = ({
    value = '',
    handleChange,
    disabled = false,
}: DatePickerProps) => {
    const dateValue = value.split('-');

    const year = Number(dateValue[0] ?? '');
    const monthIndex = Number(dateValue[1] ?? '');
    const day = Number(dateValue[2] ?? '');

    return (
        <div className={`${style.datePicker} flex`}>
            <Select
                name='month'
                disabled={disabled}
                items={MONTH_NAMES}
                value={monthIndex ? MONTH_NAMES[monthIndex - 1] : ''}
                onChange={(value) => {
                    const index =
                        MONTH_NAMES.findIndex((month) => value === month) + 1;

                    const { newDay, newMonthIndex, newYear } = validateDate(
                        day,
                        index,
                        year
                    );

                    handleChange(`${newYear}-${newMonthIndex}-${newDay}`);
                }}
                placeholder='Month'
            />

            <Input
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                value={day || ''}
                placeholder='Day'
                className='day'
                onPaste={handlePaste}
                onKeyPress={handleKeyPress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { newDay, newMonthIndex, newYear } = validateDate(
                        e.currentTarget.value,
                        monthIndex,
                        year
                    );

                    handleChange(`${newYear}-${newMonthIndex}-${newDay}`);
                }}
            />

            <Input
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                value={year || ''}
                className='year'
                placeholder='Year'
                onPaste={handlePaste}
                onKeyPress={handleKeyPress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { newDay, newMonthIndex, newYear } = validateDate(
                        day,
                        monthIndex,
                        e.currentTarget.value
                    );

                    if (Number(newYear) < 10000) {
                        handleChange(`${newYear}-${newMonthIndex}-${newDay}`);
                    }
                }}
            />
        </div>
    );
};

export default MobileDatePicker;
