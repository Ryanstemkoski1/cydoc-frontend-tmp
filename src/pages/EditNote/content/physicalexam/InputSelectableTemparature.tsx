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
    handleChange: (val: string, data: InputOnChangeData) => void;
}

const InputSelectableTemparature = (props: Props) => {
    const [currentUnit, setCurrentUnit] = useState<string>('°C');
    const [currentTemparature, setCurrentTemparature] = useState<string>('0');
    const celciusToForeignheight = () => {
        return Number(currentTemparature) * 1.8 + 32;
    };
    const foreignheightToCelcius = (newVal: string) => {
        return (Number(newVal) - 32) * 0.5556;
    };
    const handleChangeInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData
    ) => {
        const newVal = data.value;
        setCurrentTemparature(newVal);
        if (currentUnit === '°C') {
            props.handleChange(newVal, data);
        } else {
            props.handleChange(foreignheightToCelcius(newVal) + '', data);
        }
    };
    const toggleUnit = (
        e: SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps
    ) => {
        if (currentUnit !== data.value) {
            setCurrentUnit(data.value as string);
            if (data.value === '°C') {
                const val = foreignheightToCelcius(currentTemparature);
                setCurrentTemparature(+val.toFixed(1) + '');
            } else {
                const val = celciusToForeignheight();
                setCurrentTemparature(+val.toFixed(1) + '');
            }
        }
    };
    return (
        <Input
            label={
                <Dropdown
                    defaultValue='°C'
                    options={options}
                    style={styledDropDown}
                    onChange={toggleUnit}
                />
            }
            labelPosition='right'
            placeholder='0'
            type='number'
            style={styledInput}
            className='selectable-temparature'
            onChange={handleChangeInput}
            name='temperature'
            value={currentTemparature}
        />
    );
};

export default InputSelectableTemparature;
