import Input from 'components/Input/Input';
import MobileDatePicker from 'components/Input/MobileDatePicker';
import { withDimensionsHook } from 'hooks/useDimensions';
import React from 'react';
import { connect } from 'react-redux';
import {
    InitialSurveyAddDateOrPlaceActions,
    initialSurveyAddDateOrPlace,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { userSurveyState } from 'redux/reducers/userViewReducer';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';

interface InputTextOrDateResponseProps {
    id: string;
    type: 'date' | 'text';
    defaultValue: string;
    required: boolean;
    placeholder: string;
    name: string;
    disabled?: boolean;
    dimensions: { windowWidth: number; windowHeight: number };
}

class InputTextOrDateResponse extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

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
            dimensions,
        } = this.props;

        const isMobile = dimensions.windowWidth < 768;

        if (isMobile && type === 'date') {
            return (
                <MobileDatePicker
                    value={defaultValue}
                    handleChange={(value) => {
                        initialSurveyAddDateOrPlace(id, value);
                    }}
                    disabled={disabled}
                />
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

export interface initialSurveyProps {
    userSurveyState: userSurveyState;
}

const mapStateToProps = (state: CurrentNoteState): initialSurveyProps => {
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

type Props = InputTextOrDateResponseProps & initialSurveyProps & DispatchProps;

const mapDispatchToProps = {
    initialSurveyAddDateOrPlace,
};

export default withDimensionsHook(
    connect(mapStateToProps, mapDispatchToProps)(InputTextOrDateResponse)
);
