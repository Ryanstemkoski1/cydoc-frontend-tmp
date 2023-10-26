import React, { useEffect, useMemo, useState } from 'react';
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

    const [maxDay, setMaxDay] = useState(31);

    useEffect(() => {
        let newMaxDay = 31;

        if (month !== 2) {
            newMaxDay = [4, 6, 9, 11].includes(month) ? 30 : 31;
        } else if (month === 2) {
            newMaxDay = isLeapYear(year) ? 29 : 28;
        }

        setMaxDay(newMaxDay);

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

    const days = useMemo(
        () => new Array(maxDay).fill(null).map((_, index) => String(index + 1)),
        [maxDay]
    );

    const years = useMemo(
        () =>
            new Array(200)
                .fill(null)
                .map((_, index) => String(new Date().getFullYear() - index)),
        []
    );

    return (
        <div className={`${style.datePicker} flex`}>
            <Select
                name='day'
                disabled={disabled}
                items={days}
                value={day ? String(day) : ''}
                onChange={(selectedDay) => setDay(parseInt(selectedDay))}
                placeholder='Day'
            />

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

            <Select
                name='year'
                disabled={disabled}
                items={years}
                value={year ? String(year) : ''}
                onChange={(selectedYear) => setYear(parseInt(selectedYear))}
                placeholder='Year'
            />
        </div>
    );
};

export default MobileDatePicker;
