import React, { useEffect, useState } from 'react';
import Input from './Input';
import style from './MobileDatePicker.module.scss';
import Select from './Select';

const month_names = [
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
    maxDate?: Date;
    value?: string;
    handleChange: (value: string) => void;
    disabled?: boolean;
}

const isLeapYear = (year: number) =>
    year !== 0 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);

const MobileDatePicker = ({
    maxDate,
    value = '',
    handleChange,
    disabled = false,
}: DatePickerProps) => {
    const dateValue = new Date(value);

    const [month, setMonth] = useState(value ? dateValue.getMonth() + 1 : 0);
    const [day, setDay] = useState(value ? dateValue.getDate() : 0);
    const [year, setYear] = useState(value ? dateValue.getFullYear() : 0);

    useEffect(() => {
        let newMaxDay = 31;

        if (month !== 2) {
            newMaxDay = [4, 6, 9, 11].includes(month) ? 30 : 31;
        } else if (month === 2) {
            newMaxDay = isLeapYear(year) ? 29 : 28;
        }

        if (day > newMaxDay) {
            setDay(0);
            return;
        }

        if (!day || !month || !year) {
            handleChange('');
            return;
        }

        const newDay = String(day).padStart(2, '0');
        const newMonth = String(month).padStart(2, '0');

        const newDate = new Date(year, month - 1, day);

        if (maxDate && newDate > maxDate) {
            setDay(0);
            setMonth(0);
            setYear(0);

            handleChange('');
            return;
        }

        handleChange(`${year}-${newMonth}-${newDay}`);
    }, [day, month, year]);

    return (
        <div className={`${style.datePicker} flex`}>
            <Select
                name='month'
                disabled={disabled}
                items={month_names}
                value={month ? month_names[month - 1] : ''}
                onChange={(selectedMonth) =>
                    setMonth(
                        month_names.findIndex(
                            (month) => selectedMonth === month
                        ) + 1
                    )
                }
                placeholder='Month'
            />

            <Input
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                value={day ? String(day) : ''}
                placeholder='Day'
                className='day'
                onPaste={(e: any) => {
                    e.preventDefault();
                    return;
                }}
                onKeyPress={(e: any) => {
                    const charCode =
                        typeof e.which == 'undefined' ? e.keyCode : e.which;
                    const charStr = String.fromCharCode(charCode);

                    if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
                }}
                onChange={(e: any) => {
                    const newValue = parseInt(e.currentTarget.value);

                    if (isNaN(newValue)) {
                        setDay(0);
                        return;
                    }

                    if (newValue > 0 && newValue < 9999) {
                        setDay(newValue);
                    }
                }}
            />

            <Input
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                value={year ? String(year) : ''}
                className='year'
                placeholder='Year'
                onPaste={(e: any) => {
                    e.preventDefault();
                    return;
                }}
                onKeyPress={(e: any) => {
                    const charCode =
                        typeof e.which == 'undefined' ? e.keyCode : e.which;
                    const charStr = String.fromCharCode(charCode);

                    if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
                }}
                onChange={(e: any) => {
                    const newValue = parseInt(e.currentTarget.value);

                    if (isNaN(newValue)) {
                        setYear(0);
                        return;
                    }

                    if (newValue > 0 && newValue < 9999) {
                        setYear(newValue);
                    }
                }}
            />
        </div>
    );
};

export default MobileDatePicker;
