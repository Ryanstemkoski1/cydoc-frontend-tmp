import {
    HpiStateProps,
    ResponseTypes,
    SelectOneInput,
} from '@constants/hpiEnums';
import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import {
    handleOtherOptionChange,
    HandleOtherOptionChangeAction,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { isSelectOneResponse } from '@redux/reducers/hpiReducer';
import TextField from '@mui/material/TextField';

interface HandleWriteInInputProps {
    node: string;
    name: string;
    options: string[];
}

const HandleWriteInInput: React.FC<Props> = ({
    hpi,
    node,
    name,
    options,
    handleOtherOptionChange,
}) => {
    const response = hpi.nodes[node].response || {};
    const included = isSelectOneResponse(response) && response[name];
    const isCenter = hpi.nodes[node].responseType === ResponseTypes.SELECTMANY;
    const questionType = hpi.nodes[node].responseType;

    const getPrevInputValue = (): string => {
        const responseKeys = Object.keys(response);
        const valuesNotInOrigin = responseKeys.filter(
            (key) => !options.includes(key)
        );

        // Return the first value not in origin if there is exactly one, otherwise return an empty string
        return valuesNotInOrigin.length === 1 ? valuesNotInOrigin[0] : '';
    };

    const [inputValue, setInputValue] = useState(getPrevInputValue());

    const handleInputValueChange = (value: string) => {
        setInputValue(value);
    };

    const handleBlur = () => {
        setInputValue((prevValue) => prevValue.trim());
    };

    const getNewResponse = useCallback(() => {
        const newResponse: Record<string, boolean | any> = {};
        options.forEach((option) => {
            switch (questionType) {
                case ResponseTypes.SELECTMANY:
                    if (response.hasOwnProperty(option)) {
                        newResponse[option] = response[option];
                    }
                    break;
                case ResponseTypes.SELECTONE:
                    newResponse[option] = false;
                    break;
                case ResponseTypes.SELECTMANYDENSE:
                    newResponse[option] = response[option] || false;
                    break;
                default:
                    throw new Error('Unexpected question type.');
            }
        });
        newResponse[name] = true; // set other to be true
        return newResponse;
    }, [response]);

    useEffect(() => {
        if (included && inputValue !== '') {
            const updatedRes = getNewResponse();
            updatedRes[inputValue] = included;
            handleOtherOptionChange(node, updatedRes); // call reducer to update response
        }
    }, [inputValue]);

    return included ? (
        <TextField
            id='outlined-textarea'
            multiline
            sx={{
                fontSize: '12px',
                '&:focus-within': {
                    width: '100%',
                    maxWidth: '250px',
                },
                '& .MuiInputBase-input': {
                    fontSize: '12px',
                    textAlign: isCenter ? 'center' : 'default',
                },
                '& ::placeholder': {
                    fontSize: '12px',
                    textAlign: isCenter ? 'center' : 'default',
                },
            }}
            value={inputValue}
            variant='standard'
            InputProps={{
                disableUnderline: true,
            }}
            placeholder='Other Answer'
            onChange={(e) => {
                handleInputValueChange(e.target.value);
            }}
            onBlur={handleBlur}
        />
    ) : null;
};

interface DispatchProps {
    handleOtherOptionChange: (
        medId: string,
        newResponse: SelectOneInput
    ) => HandleOtherOptionChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & HandleWriteInInputProps;

const mapDispatchToProps = {
    handleOtherOptionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleWriteInInput);
