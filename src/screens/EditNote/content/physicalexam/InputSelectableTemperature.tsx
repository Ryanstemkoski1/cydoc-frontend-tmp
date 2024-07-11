import React, { SyntheticEvent, useState } from 'react';
import {
    Dropdown,
    Input,
    InputOnChangeData,
    DropdownProps,
} from 'semantic-ui-react';

const options = [
    { key: '°C', text: '°C', value: '°C' },
    { key: '°F', text: '°F', value: '°F' },
];

const styledInput = {
    width: 100,
    height: 39,
};
const styledDropDown = {
    display: 'flex',
    justifyContent: 'space-evenly',
};
interface Props {
    temperature: number;
    tempUnit: number;
    handleTempChange: (val: string) => void;
    handleTempUnitChange: (val: string) => void;
}

const celsiusToFahrenheit = (newVal: string) => {
    return Number(newVal) * 1.8 + 32;
};
const fahrenheitToCelsius = (newVal: string) => {
    return (Number(newVal) - 32) * 0.5556;
};

const InputSelectableTemperature = (props: Props) => {
    const [currentUnit, setCurrentUnit] = useState<number>(props.tempUnit);
    const [currentTemperature, setCurrentTemperature] = useState<string>(
        props.temperature.toString()
    );
    const handleChangeInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData
    ) => {
        const newVal = data.value;
        setCurrentTemperature(newVal);
        if (currentUnit === 0) {
            props.handleTempChange(newVal + '');
            props.handleTempUnitChange('0');
        } else {
            props.handleTempChange(newVal + '');
            props.handleTempUnitChange('1');
        }
    };

    const toggleUnit = (
        e: SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        const convertedData = data.value === '°C' ? 0 : 1;
        if (currentUnit !== convertedData) {
            setCurrentUnit(convertedData as number);
            if (data.value === '°C') {
                const val = fahrenheitToCelsius(currentTemperature);
                setCurrentTemperature(+val.toFixed(1) + '');
                props.handleTempChange(+val.toFixed(1) + '');
                props.handleTempUnitChange('0');
            } else {
                const val = celsiusToFahrenheit(currentTemperature);
                setCurrentTemperature(+val.toFixed(1) + '');
                props.handleTempChange(+val.toFixed(1) + '');
                props.handleTempUnitChange('1');
            }
        }
    };
    return (
        <Input
            label={
                <Dropdown
                    defaultValue='°C'
                    value={currentUnit == 0 ? '°C' : '°F'}
                    options={options}
                    style={styledDropDown}
                    onChange={toggleUnit}
                />
            }
            labelPosition='right'
            placeholder='0'
            type='number'
            style={styledInput}
            className='selectable-temperature'
            onChange={handleChangeInput}
            name='temperature'
            value={currentTemperature}
        />
    );
};

export default InputSelectableTemperature;
