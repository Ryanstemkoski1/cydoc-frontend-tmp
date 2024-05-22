import Input from '@components/Input/Input';
import React from 'react';
import { connect } from 'react-redux';
import {
    InitialSurveyAddDateOrPlaceActions,
    initialSurveyAddDateOrPlace,
} from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';

interface InputTextOrDateResponseProps {
    id: string;
    type: 'date' | 'text';
    defaultValue: string;
    required: boolean;
    placeholder: string;
    name: string;
    disabled?: boolean;
}

// Define the state interface for the component
interface InputTextOrDateResponseState {
    value: string; // Define the value property
}

class InputTextOrDateResponse extends React.Component<
    Props,
    InputTextOrDateResponseState
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.defaultValue || '', // Initialize state with defaultValue
        };
    }

    handleTodayClick = () => {
        const todayDate = new Date().toISOString().split('T')[0];
        const { id, initialSurveyAddDateOrPlace } = this.props;
        initialSurveyAddDateOrPlace(id, todayDate);
        this.setState({ value: todayDate });
    };

    handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, initialSurveyAddDateOrPlace } = this.props;
        const { value } = e.target;
        this.setState({ value });
        initialSurveyAddDateOrPlace(id, value);
    };

    render() {
        const {
            id,
            defaultValue,
            required,
            type,
            placeholder,
            name,
            initialSurveyAddDateOrPlace,
            disabled = false,
        } = this.props;

        if (name === 'dateOfAppointment') {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <button
                        className='button'
                        style={{
                            marginRight: '10px',
                        }}
                        onClick={this.handleTodayClick}
                    >
                        Today
                    </button>
                    <Input
                        defaultValue={defaultValue}
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
        return (
            <Input
                defaultValue={defaultValue}
                required={required}
                type={type}
                placeholder={placeholder}
                name={name}
                onChange={(e: any) =>
                    initialSurveyAddDateOrPlace(id, e.target.value)
                }
                disabled={disabled}
            />
        );
    }
}

export interface InitialSurveyProps {
    userSurveyState: UserSurveyState;
}

const mapStateToProps = (state: CurrentNoteState): InitialSurveyProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

interface DispatchProps {
    initialSurveyAddDateOrPlace: (
        uid: string,
        response: string
    ) => InitialSurveyAddDateOrPlaceActions;
}

type Props = InputTextOrDateResponseProps & InitialSurveyProps & DispatchProps;

const mapDispatchToProps = {
    initialSurveyAddDateOrPlace,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputTextOrDateResponse);
