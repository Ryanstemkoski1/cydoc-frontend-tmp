import ToggleButton from '@components/tools/ToggleButton/ToggleButton';
import { HpiStateProps, ResponseTypes } from '@constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    singleMultipleChoiceHandleClick,
    SingleMultipleChoiceHandleClickAction,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { isSelectOneResponse } from '@redux/reducers/hpiReducer';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { PatientPronouns } from '@constants/patientInformation';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import {
    updatePatientPronouns,
    UpdatePatientPronounsAction,
} from '@redux/actions/patientInformationActions';

interface MultipleChoiceProps {
    node: string;
    name: string;
}

class MultipleChoice extends React.Component<Props> {
    handleButtonClick = (): void => {
        const {
            node,
            name,
            hpi,
            singleMultipleChoiceHandleClick,
            updatePatientPronouns,
            // patientInformationState,
        } = this.props;
        const responseType = hpi.nodes[node].responseType;
        // call the singleMultipleChoiceHandleClick function
        singleMultipleChoiceHandleClick(node, name);
        // call the updatePatientPronouns function if the responseType is ResponseTypes.PRONOUN.
        if (responseType === ResponseTypes.PRONOUN) {
            updatePatientPronouns(
                name.toLowerCase() === 'he'
                    ? PatientPronouns.He
                    : name.toLowerCase() === 'she'
                      ? PatientPronouns.She
                      : PatientPronouns.They
            );
        }
    };
    render() {
        const { hpi, node, name } = this.props;
        const response = hpi.nodes[node].response;
        const included = isSelectOneResponse(response) && response[name];
        return (
            <ToggleButton
                className='button_question'
                active={included}
                condition={name}
                title={name}
                onToggleButtonClick={this.handleButtonClick}
            />
        );
    }
}

interface DispatchProps {
    singleMultipleChoiceHandleClick: (
        medId: string,
        name: string
    ) => SingleMultipleChoiceHandleClickAction;
    updatePatientPronouns: (
        pronoun: PatientPronouns
    ) => UpdatePatientPronounsAction;
}

const mapStateToProps = (state: CurrentNoteState) => ({
    hpi: selectHpiState(state),
    patientInformationState: selectPatientInformationState(state),
});

interface patientStateProps {
    patientInformationState: PatientInformationState;
}

type Props = patientStateProps &
    HpiStateProps &
    DispatchProps &
    MultipleChoiceProps;

const mapDispatchToProps = {
    singleMultipleChoiceHandleClick,
    updatePatientPronouns,
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleChoice);
