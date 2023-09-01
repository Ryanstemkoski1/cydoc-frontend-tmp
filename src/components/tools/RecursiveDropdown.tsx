import {
    DiagnosesOptionMapping,
    DropdownOption,
    OptionMapping,
    getDiagnosesOptionMapping,
} from '_processOptions';
import React, { useMemo, useState } from 'react';
import Select, { components, createFilter } from 'react-select';
import {
    GroupBase,
    InputActionMeta,
    OptionsOrGroups,
    PropsValue,
    StylesConfig,
    WindowedMenuList,
} from 'react-windowed-select';
import { Divider } from 'semantic-ui-react';
import './RecursiveDropdown.css';

type OnAddItem = (
    value1: React.SyntheticEvent | null,
    option: OptionMapping | any
) => unknown;

// Custom styled tag before the normally formatted text
const TagLabel = (props: { children: any; isHeader: boolean }) => {
    return (
        <div className={`tag ${props.isHeader && 'isHeader'}`}>
            {props.children}
        </div>
    );
};

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
    // Extract the label and value from the option
    const { label, value, ...otherProps } = props;
    const code = value;
    const isHeader = otherProps.data?.isHeader || false;

    const { innerProps, ...newEditedProps } = otherProps;

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
            {code && <TagLabel isHeader={isHeader}>{code}</TagLabel>}
            {label}
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
    clearable?: boolean;
    search: boolean;
    options?: DiagnosesOptionMapping | undefined;
    value?: string | undefined;
    code?: string | undefined;
    onChange?: OnAddItem;
    recursiveLevel?: number;
}) => {
    // Pull out recursive props
    const { recursiveLevel = 0, options = {}, ...nonRecursiveProps } = props;
    // Pull out props that go by different names in Semantic
    const {
        fluid,
        transparent,
        disabled,
        loading,
        clearable,
        search,
        value = '',
        code = '',
        onChange = () => undefined,
        ...otherProps
    } = nonRecursiveProps;

    const dropdownOptions = getDiagnosesOptionMapping(options);
    if (code !== '') {
        dropdownOptions[code] = { value: code, label: value };
    }
    const flatOptions = useMemo(
        () => Object.values(dropdownOptions),
        [dropdownOptions]
    );
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

    // NOTE:
    // overriding types because this is legacy code that is working.
    // if it stops working, re-evaluate types
    const finalOptions = uniqueOptions as OptionsOrGroups<
        DropdownOption,
        GroupBase<DropdownOption>
    >;

    // add text styling to options (headers are italicized)
    const optionsStyles: StylesConfig<DropdownOption> = {
        option: (styles, { data }) => {
            const fontStyle = data?.isHeader ? 'italic' : 'normal';
            return {
                ...styles,
                fontStyle,
                cursor: 'pointer',
            };
        },
        singleValue: (styles, { data }) => {
            const fontStyle = data?.isHeader ? 'italic' : 'normal';
            return {
                ...styles,
                fontStyle,
            };
        },
    };

    // set state variables
    const [val, setVal] = useState('');
    const [show, setShow] = useState(recursiveLevel > 0);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(
        code !== '' ? code : undefined
    );
    const [valueToDisplay, setValueToDisplay] = useState<
        PropsValue<DropdownOption> | undefined
    >(code !== '' ? dropdownOptions[code] : undefined);

    // Format onChange so that it has access to additional props similarly to
    // Semantic UI's Dropdowns
    const handleOnChange = (option: any) => {
        const newCode = option?.value || '';
        setSelectedValue(newCode);
        setValueToDisplay(newCode !== '' ? dropdownOptions.newCode : undefined);
        if (newCode == '') {
            onChange(null, { ...otherProps, value: '' });
        } else if (newCode in options && !('items' in options[newCode])) {
            const newValue = options[newCode]['label'];
            onChange(null, {
                ...otherProps,
                value: { diagnosis: newValue, code: newCode },
            });
        } else if (value !== '') {
            onChange(null, { ...otherProps, value: '' });
        }
    };

    const handleInputChange = (value: string, action: InputActionMeta) => {
        if (action.action !== 'input-blur' && action.action !== 'menu-close') {
            setVal(value);
        }
        if (value.length > 2 || recursiveLevel > 0) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    const Dropdown = Select;

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
                {...otherProps}
                inputValue={{ val }.val}
                value={valueToDisplay}
                options={{ show }.show ? finalOptions : undefined}
                styles={optionsStyles}
                noOptionsMessage={() => null}
                isClearable={clearable}
                isLoading={loading}
                isSearchable={search}
                isDisabled={disabled}
                onChange={handleOnChange}
                onInputChange={handleInputChange}
            />
            {selectedValue &&
                selectedValue in options &&
                'items' in options[selectedValue] && (
                    <>
                        <Divider className='dropdown-divider' />
                        <RecursiveDropdown
                            recursiveLevel={recursiveLevel + 1}
                            options={options[selectedValue].items}
                            {...nonRecursiveProps}
                        />
                    </>
                )}
        </>
    );
};

export default RecursiveDropdown;
