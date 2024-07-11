import Input from '@components/Input/Input';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { initialSurveyAddDateOrPlace } from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';

interface OwnProps {
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

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

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

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

const mapDispatchToProps = {
    initialSurveyAddDateOrPlace,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(InputTextOrDateResponse);
