import React, { useMemo, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { WindowedMenuList } from 'react-windowed-select';
import Select, { createFilter, components } from 'react-select';
import './OptimizedDropdown.css';

/**
 * Overrides and removes mouseover event handlers from react-select's default
 * `Option` combponent for optimization. Otherwise, a rerender would be
 * triggered on each hover.
 */
const CustomOption = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { isFocused, innerProps, ...otherProps } = props;
    // eslint-disable-next-line no-unused-vars
    const { onMouseMove, onMouseOver, ...otherInnerProps } = innerProps;
    const newProps = {
        innerProps: { ...otherInnerProps },
        ...otherProps,
    };

    return (
        <components.Option {...newProps} className='option' role='option'>
            {props.children}
        </components.Option>
    );
};

// Adds prefix to class to make overriding styling easier. Default was `css-<HASH>`.
const MenuList = (props) => (
    <WindowedMenuList {...props} classNamePrefix='dropdown' />
);

const OptimizedDropdown = (props) => {
    // Pull out props that go by different names in Semantic
    let {
        fluid,
        transparent,
        disabled,
        loading,
        multiple,
        clearable,
        search,
        options = {},
        value = '',
        onAddItem = () => {},
        onChange = () => {},
        ...otherProps
    } = props;

    const flatOptions = useMemo(() => Object.values(options), [options]);

    // Format onChange so that it has access to additional props similarly to
    // Semantic UI's Dropdowns
    const handleOnChange = (option) => {
        let value = option?.value || '';
        if (multiple) {
            Array.isArray(option)
                ? (value = option.map((opt) => opt.value))
                : (value = [option.value]);
        }
        onChange(null, { ...otherProps, value });
    };

    // Format onAddItem to resembler Semantic's. Trigger onChange as
    // react-select's innate handler does not do this for us.
    const handleOnCreateOption = (value) => {
        onAddItem(null, { ...otherProps, value });
        handleOnChange({ value, label: value });
    };

    // When toggling between sections of note body, all options added by the
    // user disappear (because they only persist in local state). To prevent
    // the dropdown from looking as if it has no value, add it on load.
    useEffect(() => {
        if (!(value in options)) {
            onAddItem(null, { ...otherProps, value });
        }
    }, []);

    const Dropdown = otherProps.allowAdditions ? CreatableSelect : Select;

    // Account for multi dropdowns whose `value` prop _should_ be a list
    let parsedValue = options[value];
    if (multiple) {
        parsedValue = value.map((val) => options[val]);
    }

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
            value={value !== '' && value !== [] && parsedValue} // forces placeholder to show when value is empty string
            options={flatOptions}
            isClearable={clearable}
            isLoading={loading}
            isSearchable={search}
            isMulti={multiple}
            isDisabled={disabled}
            onCreateOption={handleOnCreateOption}
            onChange={handleOnChange}
        />
    );
};

export default OptimizedDropdown;
