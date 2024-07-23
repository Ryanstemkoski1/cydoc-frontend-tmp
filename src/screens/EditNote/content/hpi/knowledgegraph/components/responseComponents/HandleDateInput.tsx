import Input from '@components/Input/Input';
import React from 'react';
import { connect } from 'react-redux';
import {
    HandleDateInputChangeAction,
    handleDateInputChange,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { HpiStateProps, DateInput } from '@constants/hpiEnums';
import Button from '@mui/material/Button';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface DateResponseProps {
    id: string;
    type: 'date' | 'text';
    defaultValue: DateInput;
    required: boolean;
    placeholder: string;
    name: string;
    disabled?: boolean;
}

// Define the state interface for the component
interface DateResponseState {
    value: DateInput; // Define the value property
}

class HandleDateInput extends React.Component<Props, DateResponseState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.defaultValue || '', // Initialize state with defaultValue
        };
    }

    handleTodayClick = () => {
        const todayDate = new Date().toISOString().split('T')[0];
        const { id, handleDateInputChange } = this.props;
        handleDateInputChange(id, todayDate);
        this.setState({ value: todayDate });
    };

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, handleDateInputChange } = this.props;
        const { value } = e.target;
        this.setState({ value });
        handleDateInputChange(id, value);
    };

    render() {
        const {
            id,
            required,
            type,
            placeholder,
            name,
            disabled = false,
        } = this.props;

        return (
            <div
                id={id}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    variant='contained'
                    style={{
                        backgroundColor: '#147a9b',
                        marginRight: '10px',
                        fontSize: '12px',
                        textTransform: 'none',
                    }}
                    onClick={this.handleTodayClick}
                >
                    Today
                </Button>
                <Input
                    value={this.state.value}
                    required={required}
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    onChange={this.handleOnChange}
                    disabled={disabled}
                />
            </div>
        );
    }
}

export interface InitialSurveyProps {
    userSurveyState: UserSurveyState;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

interface DispatchProps {
    handleDateInputChange: (
        uid: string,
        response: string
    ) => HandleDateInputChangeAction;
}

type Props = DateResponseProps & HpiStateProps & DispatchProps;

const mapDispatchToProps = {
    handleDateInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleDateInput);
