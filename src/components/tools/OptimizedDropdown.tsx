import React, { useMemo, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
    ActionMeta,
    GroupBase,
    MultiValue,
    OnChangeValue,
    OptionsOrGroups,
    PropsValue,
    SingleValue,
    WindowedMenuList,
} from 'react-windowed-select';
import Select, { createFilter, components } from 'react-select';
import './OptimizedDropdown.css';
import { DropdownOption, OptionMapping } from '_processOptions';

type OnAddItem = (
    value1: React.SyntheticEvent | null,
    option: OptionMapping | any
) => unknown;
/**
 * Overrides and removes mouseover event handlers from react-select's default
 * `Option` component for optimization. Otherwise, a rerender would be
 * triggered on each hover.
 */
const CustomOption = (props: {
    [x: string]: any;
    children?: any;
    isFocused?: any;
    innerProps?: any;
}) => {
    const { innerProps } = props;
    const newEditedProps = props;
    delete newEditedProps.isFocused;
    delete innerProps.onMouseMove;
    delete innerProps.onMouseOver;

    const newProps = {
        innerProps,
        ...newEditedProps,
    };

    return (
        // @ts-expect-error this is existing code that doesn't match our types, but we also need to limit our changes right now. If it's broken, change it!
        <components.Option {...newProps} className='option' role='option'>
            {props.children}
        </components.Option>
    );
};

// Adds prefix to class to make overriding styling easier. Default was `css-<HASH>`.
const MenuList = (props: any) => (
    <WindowedMenuList {...props} classNamePrefix='dropdown' />
);

const OptimizedDropdown = (props: {
    [x: string]: any;
    fluid: boolean;
    transparent?: boolean;
    disabled?: boolean;
    loading?: boolean;
    multiple?: boolean;
    clearable?: boolean;
    search: any;
    options?: OptionMapping | undefined;
    value?: string | string[] | undefined;
    onAddItem?: OnAddItem;
    onChange?: OnAddItem;
}) => {
    const [val, setVal] = useState('');
    const [show, setShow] = useState(false);
    // Pull out props that go by different names in Semantic
    const {
        fluid,
        transparent,
        disabled,
        loading,
        multiple,
        clearable,
        search,
        options = {},
        value = '',
        onAddItem = () => undefined,
        onChange = () => undefined,
        ...otherProps
    } = props;

    const flatOptions = useMemo(() => Object.values(options), [options]);

    const sortedOptions = flatOptions.sort(
        (a: { label?: string } | unknown, b: { label?: string } | unknown) =>
            // @ts-expect-error missing "label" field is already handled acceptably
            a?.label?.length > b?.label?.length ? 1 : -1
        // NOTE:
        // overriding types because this is legacy code that is working.
        // if it stops working, re-evaluate types
    ) as OptionsOrGroups<DropdownOption, GroupBase<DropdownOption>>;

    // Format onChange so that it has access to additional props similarly to
    // Semantic UI's Dropdowns
    const handleOnChange: (
        // newValue: OnChangeValue<DropdownOption, true>,
        newValue: MultiValue<DropdownOption> | SingleValue<DropdownOption>,
        actionMeta?: ActionMeta<DropdownOption>
    ) => void = (newValue) => {
        let value;
        if (multiple) {
            const multiOption = newValue as MultiValue<DropdownOption>;
            value = multiOption?.[0]?.label || '';
            Array.isArray(newValue)
                ? (value = newValue.map((opt) => opt.value))
                : (value = [(newValue as SingleValue<DropdownOption>)?.value]);
        } else {
            value = (newValue as SingleValue<DropdownOption>)?.label || '';
        }
        onChange(null, { ...otherProps, value });
    };

    // Format onAddItem to resembler Semantic's. Trigger onChange as
    // react-select's innate handler does not do this for us.
    const handleOnCreateOption = (value: any) => {
        onAddItem(null, { ...otherProps, value });
        handleOnChange({ value, label: value });
    };

    const handleInputChange = (value: any, action: any) => {
        if (action.action !== 'input-blur' && action.action !== 'menu-close') {
            setVal(value);
        }
        if (value.length > 2) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    const handleMenuClose = () => {
        const inputVal = { val }.val;
        if (inputVal !== '') {
            onAddItem(null, { ...otherProps, inputVal });
            const newValue:
                | MultiValue<DropdownOption>
                | SingleValue<DropdownOption> = value;
            handleOnChange({ value: newValue, label: inputVal });
        }
    };
    // When toggling between sections of note body, all options added by the
    // user disappear (because they only persist in local state). To prevent
    // the dropdown from looking as if it has no value, add it on load.
    useEffect(() => {
        if (typeof value === 'object') {
            // handle array values
            const valueArray = value as string[];
            valueArray.map((value) =>
                onAddItem(null, { ...otherProps, value })
            );
        } else if (!(value in options)) {
            onAddItem(null, { ...otherProps, value });
        }
    }, [onAddItem, options, otherProps, value]);

    const Dropdown = otherProps.allowAdditions ? CreatableSelect : Select;

    let parsedValue;
    // Account for multi dropdowns whose `value` prop _should_ be a list
    if (multiple || typeof value == 'object') {
        const valueArray = value as unknown as string[];
        parsedValue = valueArray?.map((val) => options?.[val]);
    } else {
        parsedValue = options?.[value]; // as PropsValue<Option> | undefined;
    }

    // forces placeholder to show when value is empty string
    const valueToDisplay = (value !== '' &&
        typeof value !== 'object' &&
        // NOTE:
        // overriding types because this is legacy code that is working.
        // if it stops working, re-evaluate types
        parsedValue) as PropsValue<DropdownOption> | undefined;

    return (
        <Dropdown
            classNamePrefix='dropdown'
            className={`opt-dropdown ${otherProps.className} ${
                fluid && 'fluid'
            } ${transparent && 'transparent'}`}
            components={{
                MenuList,
                Option: CustomOption,
            }}
            filterOption={createFilter({ ignoreAccents: false })} // speeds up filtering tremendously
            pageSize={1}
            maxMenuHeight={184}
            createOptionPosition='first'
            {...otherProps}
            inputValue={{ val }.val}
            value={valueToDisplay}
            options={{ show }.show ? sortedOptions : undefined}
            noOptionsMessage={() => null}
            isClearable={clearable}
            isLoading={loading}
            isSearchable={search}
            isMulti={multiple}
            isDisabled={disabled}
            onCreateOption={handleOnCreateOption}
            onChange={handleOnChange}
            onInputChange={handleInputChange}
            onMenuClose={handleMenuClose}
            formatCreateLabel={(userInput) => `${userInput}`}
        />
    );
};

export default OptimizedDropdown;
