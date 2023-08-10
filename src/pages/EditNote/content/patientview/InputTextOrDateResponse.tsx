import Input from 'components/Input/Input';
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
        } = this.props;

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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputTextOrDateResponse);
