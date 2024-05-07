import React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { CurrentNoteState } from '@redux/reducers';
import {
    updatePatientPronouns,
    UpdatePatientPronounsAction,
} from '@redux/actions/patientInformationActions';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';

import { PatientPronouns } from 'constants/patientInformation';
import './IdentityForm.css';

interface DispatchProps {
    updatePatientPronouns: (
        pronouns: PatientPronouns
    ) => UpdatePatientPronounsAction;
}

interface StateProps {
    patientInformationState: PatientInformationState;
}

type Props = DispatchProps & StateProps;

const IdentityForm: React.FunctionComponent<Props> = (props: Props) => {
    const { updatePatientPronouns, patientInformationState } = props;

    return (
        <Form.Group grouped className='identity-groups field'>
            <label>Pronouns</label>
            <Form.Radio
                className='identity-fields'
                name='pronouns'
                label='They/them'
                value={PatientPronouns.They}
                checked={
                    patientInformationState.pronouns === PatientPronouns.They
                }
                onClick={() => updatePatientPronouns(PatientPronouns.They)}
            />
            <Form.Radio
                className='identity-fields'
                name='pronouns'
                label='She/her'
                value={PatientPronouns.She}
                checked={
                    patientInformationState.pronouns === PatientPronouns.She
                }
                onClick={() => updatePatientPronouns(PatientPronouns.She)}
            />
            <Form.Radio
                className='identity-fields'
                name='pronouns'
                label='He/him'
                value={PatientPronouns.He}
                checked={
                    patientInformationState.pronouns === PatientPronouns.He
                }
                onClick={() => updatePatientPronouns(PatientPronouns.He)}
            />
        </Form.Group>
    );
};

export default connect(
    (state: CurrentNoteState) => ({
        patientInformationState: selectPatientInformationState(state),
    }),
    { updatePatientPronouns }
)(IdentityForm);
