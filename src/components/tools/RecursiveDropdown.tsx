import React, { useMemo, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
    ActionMeta,
    GroupBase,
    MultiValue,
    OptionsOrGroups,
    PropsValue,
    SingleValue,
    WindowedMenuList,
} from 'react-windowed-select';
import Select, { createFilter, components } from 'react-select';
import './OptimizedDropdown.css';
import { DiagnosesOptions, DropdownOption, OptionMapping, getDiagnosesOptionMapping } from '_processOptions';
import { Divider } from 'semantic-ui-react';

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
    const { innerProps, ...newEditedProps } = props;

    typeof newEditedProps.isFocused !== 'undefined' &&
        delete newEditedProps.isFocused;
    typeof innerProps.onMouseMove !== 'undefined' &&
        delete innerProps.onMouseMove;
    typeof innerProps.onMouseOver !== 'undefined' &&
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

const RecursiveDropdown = (props: {
    [x: string]: any;
    fluid: boolean;
    transparent?: boolean;
    disabled?: boolean;
    loading?: boolean;
    multiple?: boolean;
    clearable?: boolean;
    search: any;
    options?: DiagnosesOptions | undefined;
    value?: string | undefined;
    onAddItem?: OnAddItem;
    onChange?: OnAddItem;
    recursiveLevel?: number;
}) => {
    // Pull out recursive props
    let {
        recursiveLevel = 0,
        options = {},
        ...otherRecursiveProps
    } = props
    const [val, setVal] = useState('');
    const [show, setShow] = useState(recursiveLevel > 0);
    const [selectedValue, setSelectedValue] = useState('');
    const [valueToDisplay, setValueToDisplay] = useState<PropsValue<DropdownOption> | undefined>(undefined);
    // Pull out props that go by different names in Semantic
    const {
        fluid,
        transparent,
        disabled,
        loading,
        multiple,
        clearable,
        search,
        value = '',
        onAddItem = () => undefined,
        onChange = () => undefined,
        ...otherProps
    } = otherRecursiveProps;

    const dropdownOptions = getDiagnosesOptionMapping(options);
    const flatOptions = useMemo(() => Object.values(dropdownOptions), [dropdownOptions]);
    const uniqueOptions: DropdownOption[] = [];
    const uniqueMap = new Map();

    flatOptions.forEach((el) => {
        if (uniqueMap.has(el.label)) {
            uniqueMap.set(el.label, true);
        } else {
            uniqueOptions.push(el);
            uniqueMap.set(el.label, true);
        }
    });

    const sortedOptions = uniqueOptions.sort(
        (a: { label?: string } | unknown, b: { label?: string } | unknown) =>
            // @ts-expect-error missing "label" field is already handled acceptably
            a?.label?.length > b?.label?.length ? 1 : -1
        // NOTE:
        // overriding types because this is legacy code that is working.
        // if it stops working, re-evaluate types
    ) as OptionsOrGroups<DropdownOption, GroupBase<DropdownOption>>;

    // Format onChange so that it has access to additional props similarly to
    // Semantic UI's Dropdowns
    const handleOnChange = (option: any) => {
        let value = option?.value || '';
        setSelectedValue(value);
        setValueToDisplay(value !== '' ? dropdownOptions.value : undefined);
        if (value == '') {
            onChange(null, { ...otherProps, value });
        } else if (value in options && !("items" in options[value])) {
            value = options[value]["label"];
            onChange(null, { ...otherProps, value });
        } else if (!(value in options)) {
            onChange(null, { ...otherProps, value });
        }
    };

    // Format onAddItem to resembler Semantic's. Trigger onChange as
    // react-select's innate handler does not do this for us.
    const handleOnCreateOption = (value: string) => {
        if (recursiveLevel == 0) {
            onAddItem(null, {...otherProps, value});
            handleOnChange({ value, label: value });
        }
    };

    const handleInputChange = (value: any, action: any) => {
        if (action.action !== 'input-blur' && action.action !== 'menu-close') {
            setVal(value);
        }
        if (value.length > 2 || recursiveLevel > 0) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    const handleMenuClose = () => {
        // const inputVal = { val }.val;
        // if (inputVal !== '') {
        //     onAddItem(null, { ...otherProps, inputVal });

        //     handleOnChange({
        //         value:
        //             typeof value === 'string' ? value : JSON.stringify(value),
        //         label: inputVal,
        //     });
        // }
    };
    // When toggling between sections of note body, all options added by the
    // user disappear (because they only persist in local state). To prevent
    // the dropdown from looking as if it has no value, add it on load.
    // useEffect(() => {
    //     if (!selectedValue) {    
    //         if (!(value in dropdownOptions)) {
    //             onAddItem(null, { ...otherProps, value });
    //         }
    //         let parsedValue = dropdownOptions?.[value];

    //         // forces placeholder to show when value is empty string
    //         setValueToDisplay((value !== '' &&
    //             typeof value !== 'object' &&
    //             // NOTE:
    //             // overriding types because this is legacy code that is working.
    //             // if it stops working, re-evaluate types
    //             parsedValue) as PropsValue<DropdownOption> | undefined);
    //     }
    // }, [setValueToDisplay, onAddItem, dropdownOptions, otherProps, value]);

    const Dropdown = otherProps.allowAdditions && recursiveLevel == 0 ? CreatableSelect : Select;

    // let parsedValue = dropdownOptions?.[selectedValue];

    // // forces placeholder to show when value is empty string
    // const valueToDisplay = (value !== '' &&
    //     typeof value !== 'object' &&
    //     // NOTE:
    //     // overriding types because this is legacy code that is working.
    //     // if it stops working, re-evaluate types
    //     parsedValue) as PropsValue<DropdownOption> | undefined;

    return (
        <>
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
                isDisabled={disabled}
                onCreateOption={recursiveLevel == 0 ? handleOnCreateOption : () => undefined}
                onChange={handleOnChange}
                onInputChange={handleInputChange}
                onMenuClose={handleMenuClose}
                formatCreateLabel={(userInput) => `${userInput}`}
            />
            {selectedValue &&
                selectedValue in options &&
                    "items" in options[selectedValue] && (<>
                        <Divider/>
                        <RecursiveDropdown
                            recursiveLevel={recursiveLevel + 1}
                            options={options[selectedValue].items}
                            {...otherRecursiveProps}
                        />
            </>)}
        </>
    );
};

export default RecursiveDropdown;
