import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { CurrentNoteState } from 'redux/reducers';
import { ReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import { selectReviewOfSystemsState } from 'redux/selectors/reviewOfSystemsSelectors';
import { selectPlanState } from 'redux/selectors/planSelectors';
import { SocialHistoryState } from 'redux/reducers/socialHistoryReducer';
import { selectFamilyHistoryState } from 'redux/selectors/familyHistorySelectors';
import { selectAllergiesState } from 'redux/selectors/allergiesSelectors';
import { AllergiesState } from 'redux/reducers/allergiesReducer';
import { selectMedicationsState } from 'redux/selectors/medicationsSelectors';
import { MedicationsState } from 'redux/reducers/medicationsReducer';
import { selectSurgicalHistoryState } from 'redux/selectors/surgicalHistorySelectors';
import { SurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { PhysicalExamState } from 'redux/reducers/physicalExamReducer';
import {
    Button,
    Segment,
    Input,
    Modal,
    Header,
    Form,
    Icon,
} from 'semantic-ui-react';
import { PlanState } from 'redux/reducers/planReducer';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { selectPatientInformationState } from 'redux/selectors/patientInformationSelector';
import { PatientInformationState } from 'redux/reducers/patientInformationReducer';
import {
    updatePatientName,
    UpdatePatientNameAction,
    updatePatientPronouns,
    UpdatePatientPronounsAction,
    UpdatePatientInformationAction,
    updatePatientInformation,
} from 'redux/actions/patientInformationActions';

// import all the individual note sections
import HPINote from './notesections/HPINote';
import MedicalHistoryNote from './notesections/MedicalHistoryNote';
import SurgicalHistoryNote from './notesections/SurgicalHistoryNote';
import MedicationsNote from './notesections/MedicationsNote';
import AllergiesNote from './notesections/AllergiesNote';
import SocialHistoryNote from './notesections/SocialHistoryNote';
import FamilyHistoryNote from './notesections/FamilyHistoryNote';
import ReviewOfSystemsNote from './notesections/ReviewOfSystemsNote';
import PhysicalExamNote from './notesections/PhysicalExamNote';
import PlanNote from './notesections/PlanNote';
import './GenerateNote.css';

import IdentityForm from '../../../../components/tools/IdentityForm';

import './GenerateNote.css';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import { GENERATE_NOTE_MOBILE_BP } from 'constants/breakpoints';
import { PatientPronouns } from 'constants/patientInformation';

interface GenerateNoteProps {
    previousFormClick: () => void;
}

interface DispatchProps {
    updatePatientName: (patientName: string) => UpdatePatientNameAction;
    updatePatientPronouns: (
        pronouns: PatientPronouns
    ) => UpdatePatientPronounsAction;
    updatePatientInformation: (
        patientName: string,
        pronouns: PatientPronouns
    ) => UpdatePatientInformationAction;
}

interface StateProps {
    ROSState: ReviewOfSystemsState;
    planState: PlanState;
    familyHistoryState: FamilyHistoryState;
    socialHistoryState: SocialHistoryState;
    allergiesState: AllergiesState;
    medicationsState: MedicationsState;
    surgicalHistoryState: SurgicalHistoryState;
    medicalHistoryState: MedicalHistoryState;
    physicalExamState: PhysicalExamState;
    patientInformationState: PatientInformationState;
}

const mapStateToProps = (state: CurrentNoteState): StateProps => ({
    ROSState: selectReviewOfSystemsState(state),
    planState: selectPlanState(state),
    familyHistoryState: selectFamilyHistoryState(state),
    socialHistoryState: state.socialHistory,
    allergiesState: selectAllergiesState(state),
    medicationsState: selectMedicationsState(state),
    surgicalHistoryState: selectSurgicalHistoryState(state),
    medicalHistoryState: state.medicalHistory,
    physicalExamState: state.physicalExam,
    patientInformationState: selectPatientInformationState(state),
});

type Props = GenerateNoteProps & StateProps & DispatchProps;

// TODO: look into <li> keys -- throws a warning if duplicats, not a huge deal but probably fix
const GenerateNote: React.FunctionComponent<Props> = (props: Props) => {
    const {
        previousFormClick,
        updatePatientName,
        updatePatientPronouns,
        updatePatientInformation,
        ROSState,
        planState,
        familyHistoryState,
        socialHistoryState,
        allergiesState,
        medicationsState,
        surgicalHistoryState,
        medicalHistoryState,
        physicalExamState,
        patientInformationState,
    } = props;

    const { patientName, pronouns } = patientInformationState;

    // Opening and closing modal with patient information
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (): void => setIsModalOpen(true);
    const closeModal = (): void => setIsModalOpen(false);
    const savePatientInfo = () => {
        updatePatientInformation(patientName, pronouns);
        closeModal();
    };

    const [isRichText, setIsRichText] = useState(false);

    /** TODO: This logic is loosely duplicated from NavMenu.tsx. This function has been brute-force copied
     * throughout the codebase 10+ times to determine whether or not each individual component is "mobile".
     * Many times the logic uses a different px value to determine what "mobile" is. The "mobile" prop is also
     * prop-drilled through many levels when used. Recomendations to clean this up:
     * 1) There should only be one value for "mobile" in terms of px width across the app.
     * 2) The logic for determining if the app is displaying at the mobile breakpoint should only appear once.
     * 3) Prop-drilling should be avoided. This is a good article that details
     * how to use composition to avoid prop-drilling: https://javascript.plainenglish.io/composition-in-react-f02afe24bc46
     */
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const updateDimensions = (): void => {
            const windowWidth =
                typeof window !== 'undefined' ? window.innerWidth : 0;
            setIsMobile(windowWidth < GENERATE_NOTE_MOBILE_BP);
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return (): void =>
            window.removeEventListener('resize', updateDimensions);
    }, []);

    const copyNote = () => {
        const note = document.querySelectorAll('.generate-note-text');
        const blob = new Blob([note[0].innerHTML], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
            ['text/html']: blob,
        });
        navigator.clipboard.write([clipboardItem]);
    };

    const richOrPlainButtons = (
        <Button.Group>
            <Button
                onClick={() => setIsRichText(false)}
                className={`hpi-ph-button${isRichText ? '' : '-selected'}`}
            >
                Plain Text{' '}
            </Button>
            <Button.Or />
            <Button
                onClick={() => setIsRichText(true)}
                className={`hpi-ph-button${isRichText ? '-selected' : ''}`}
            >
                Rich Text
            </Button>
        </Button.Group>
    );

    let generateNoteButtons;
    if (!isMobile) {
        generateNoteButtons = (
            <Fragment>
                <div className={'ui input large'}>
                    <input
                        id='patientName'
                        type='text'
                        autoComplete='off'
                        placeholder="Patient's name (optional)"
                        value={patientName}
                        onChange={(e) => updatePatientName(e.target.value)}
                    ></input>
                </div>
                <Button.Group>
                    <Button
                        onClick={() =>
                            updatePatientPronouns(PatientPronouns.She)
                        }
                        className={`hpi-ph-button${
                            pronouns === PatientPronouns.She ? '-selected' : ''
                        }`}
                    >
                        She
                    </Button>
                    <Button.Or />
                    <Button
                        onClick={() =>
                            updatePatientPronouns(PatientPronouns.They)
                        }
                        className={`hpi-ph-button${
                            pronouns === PatientPronouns.They ? '-selected' : ''
                        }`}
                    >
                        They
                    </Button>
                    <Button.Or />
                    <Button
                        onClick={() =>
                            updatePatientPronouns(PatientPronouns.He)
                        }
                        className={`hpi-ph-button${
                            pronouns === PatientPronouns.He ? '-selected' : ''
                        }`}
                    >
                        He
                    </Button>
                </Button.Group>
                {richOrPlainButtons}
            </Fragment>
        );
    } else {
        generateNoteButtons = (
            <Modal
                className='patient-modal'
                onClose={closeModal}
                onOpen={openModal}
                open={isModalOpen}
                size='tiny'
                dimmer='inverted'
                trigger={
                    <Button basic color='teal' name='home' icon='info circle' />
                }
            >
                <Header>Patient Information</Header>
                <Modal.Content>
                    <Form>
                        <Form.Field
                            fluid
                            autoComplete='off'
                            id='patientName'
                            type='text'
                            label="Patient's Name"
                            className='patient-info-input'
                            placeholder="Enter the patient's name, e.g. Ms. Lee (optional)"
                            control={Input}
                            value={patientName}
                            onChange={(e: any) =>
                                updatePatientName(e.target.value)
                            }
                        />
                        <IdentityForm />
                        {richOrPlainButtons}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='blue'
                        type='submit'
                        onClick={savePatientInfo}
                        content='Save'
                    />
                </Modal.Actions>
            </Modal>
        );
    }

    return (
        <div>
            <div className='generate-note-buttons'>
                <Segment
                    id='generateNoteButtonsContainer'
                    className='generate-note-buttons__container'
                >
                    {generateNoteButtons}
                    <Button.Group floated='right'>
                        <Button
                            className='copy-button'
                            onClick={() => copyNote()}
                        >
                            Copy Note
                        </Button>
                    </Button.Group>
                </Segment>
            </div>
            <Segment className='generate-note-text'>
                {/* <h1> {this.context.title} </h1> */}
                <h3> History of Present Illness </h3>
                <HPINote />
                <h3> Patient History </h3>
                <h4> Medical History </h4>
                <MedicalHistoryNote
                    isRich={isRichText}
                    medicalHistory={medicalHistoryState}
                />
                <h4> Surgical History </h4>
                <SurgicalHistoryNote
                    isRich={isRichText}
                    surgicalHistory={surgicalHistoryState}
                />
                <h4> Medications </h4>
                <MedicationsNote
                    isRich={isRichText}
                    medications={medicationsState}
                />
                <h4> Allergies </h4>
                <AllergiesNote isRich={isRichText} allergies={allergiesState} />
                <h4> Social History </h4>
                <SocialHistoryNote
                    isRich={isRichText}
                    socialHistory={socialHistoryState}
                />
                <h4> Family History </h4>
                <FamilyHistoryNote
                    isRich={isRichText}
                    familyHistory={familyHistoryState}
                />
                <h3> Review of Systems </h3>
                <ReviewOfSystemsNote isRich={isRichText} ROSState={ROSState} />
                <h3> Physical Exam </h3>
                <PhysicalExamNote
                    isRich={isRichText}
                    physicalExam={physicalExamState}
                />
                <h3> Plan </h3>
                <PlanNote planState={planState} />
            </Segment>
            <Button
                icon
                labelPosition='left'
                floated='left'
                onClick={previousFormClick}
                className='note-previous-button'
            >
                Previous
                <Icon name='arrow left' />
            </Button>
            {/* mobile */}
            <Button
                icon
                floated='left'
                onClick={previousFormClick}
                className='small-note-previous-button'
            >
                <Icon name='arrow left' />
            </Button>
        </div>
    );
};

export default connect(mapStateToProps, {
    updatePatientName,
    updatePatientPronouns,
    updatePatientInformation,
})(GenerateNote);
