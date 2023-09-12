import React, { memo, useMemo } from 'react';
import { FastField, useField, useFormikContext } from 'formik';
import { TextField, TextFieldProps } from '@mui/material';
import InputMask from 'react-input-mask';
import { SignUpFormData } from './SignUpForm';

interface Props {
    fieldName: keyof SignUpFormData;
    label?: string;
    placeholder?: string;
    type?: string;
}

function SignUpTextInput({
    fieldName,
    label,
    placeholder,
    type = 'text',
}: Props) {
    const [field, , helpers] = useField<number | string>(fieldName);
    const { validateField } = useFormikContext();

    const InputField = useMemo(() => {
        if (type === 'tel') {
            return FormikPhoneField;
        } else {
            return FormikTextField;
        }
    }, [type]);

    return useMemo(
        () => (
            <>
                <FastField
                    as={InputField}
                    id={fieldName}
                    fullWidth
                    required
                    placeholder={placeholder}
                    type={type}
                    label={label}
                    name={fieldName}
                    {...(type === 'password'
                        ? { autoComplete: 'new-password' }
                        : null)}
                    onChange={(e: any) => {
                        const newValue = e.target.value || '';
                        // const newValue = format(targetValue);
                        // const isTextOnly = !isNumber && !isCurrency;
                        // const isValidNumber = !isNaN(newValue);
                        if (
                            field.value !== newValue &&
                            newValue !== undefined
                        ) {
                            helpers.setTouched(true, true);
                            helpers.setError('');
                            helpers.setValue(newValue, false);
                            setTimeout(() => validateField(fieldName), 1);
                        }
                    }}
                    variant='outlined'
                />
            </>
        ),
        [
            InputField,
            fieldName,
            placeholder,
            type,
            label,
            field.value,
            helpers,
            validateField,
        ]
    );
}

export default memo(SignUpTextInput);

/**
 * wrapped to allow easy use of Formik validation
 */

export const FormikTextField = (props: TextFieldProps & { name: string }) => {
    const [field, meta] = useField(props.name);
    const errorText = meta.error && meta.touched ? meta.error : '';

    return (
        <TextField
            {...field}
            {...props}
            helperText={errorText}
            error={!!errorText}
        />
    );
};

export const FormikPhoneField = (props: TextFieldProps & { name: string }) => {
    const [field, meta] = useField(props.name);
    const errorText = meta.error && meta.touched ? meta.error : '';

    const { onBlur, onChange, value } = field;

    return (
        <InputMask
            // mask='999-999-9999'
            mask='+1-999-999-9999'
            onChange={onChange}
            onBlur={onBlur}
            alwaysShowMask={false}
            value={value}
            // error={errorText}
            // helperText={!!er`rorText}
        >
            <TextField
                {...field}
                {...{ ...props, ...{ onChange: undefined } }}
                helperText={errorText}
                error={!!errorText}
                // className={classes.MuiInputBase}
            />
        </InputMask>
    );
};
