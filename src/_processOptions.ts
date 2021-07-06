export interface DropdownOption {
    value: string;
    label: string;
};

export type OptionMapping = { [key: string]: DropdownOption };

/**
 * Returns an OptionMapping already formatted for `OptimizedDropdown.tsx`. A
 * mapping is necessary as `react-select` stores the option objects as opposed
 * to its value attribute. `OptimizedDropdown` abstracts the conversion and
 * allows `onChange` values to continue operating on strings.
 */
export const getOptionMapping = (options: string[] | {[key: string]: string}): OptionMapping => {
    if (options instanceof Array) {
        return options.reduce((mapping, value) => {
            mapping[value] = {
                value,
                label: value,
            };
            return mapping;
        }, {} as OptionMapping);
    };

    return Object
        .keys(options)
        .reduce((mapping, key) => {
            const value = `${key} ${options[key]}`;
            mapping[value] = {
                value,
                label: options[key],
            };
            return mapping;
        }, {} as OptionMapping);
};