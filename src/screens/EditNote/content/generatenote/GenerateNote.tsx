import React, { Fragment, useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';

import {
    updatePatientInformation,
    updatePatientName,
    updatePatientPronouns,
} from '@redux/actions/patientInformationActions';
import { CurrentNoteState } from '@redux/reducers';
import { AllergiesState } from '@redux/reducers/allergiesReducer';
import { FamilyHistoryState } from '@redux/reducers/familyHistoryReducer';
import { MedicalHistoryState } from '@redux/reducers/medicalHistoryReducer';
import { MedicationsState } from '@redux/reducers/medicationsReducer';
import { PatientInformationState } from '@redux/reducers/patientInformationReducer';
import { PlanState } from '@redux/reducers/planReducer';
import { ReviewOfSystemsState } from '@redux/reducers/reviewOfSystemsReducer';
import { SocialHistoryState } from '@redux/reducers/socialHistoryReducer';
import { SurgicalHistoryState } from '@redux/reducers/surgicalHistoryReducer';
import { selectAllergiesState } from '@redux/selectors/allergiesSelectors';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectPlanState } from '@redux/selectors/planSelectors';
import { selectReviewOfSystemsState } from '@redux/selectors/reviewOfSystemsSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { selectChiefComplaintsState } from '@redux/selectors/chiefComplaintsSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { AdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { PhysicalExamState } from '@redux/reducers/physicalExamReducer';
import {
    selectSurgicalHistoryProcedures,
    selectSurgicalHistoryState,
} from '@redux/selectors/surgicalHistorySelectors';
import { Button, Segment } from 'semantic-ui-react';

// import all the individual note sections
import './GenerateNote.css';
import AllergiesNote from './notesections/AllergiesNote';
import FamilyHistoryNote from './notesections/FamilyHistoryNote';
import HPINote from './notesections/HPINote';
import MedicalHistoryNote from './notesections/MedicalHistoryNote';
import MedicationsNote from './notesections/MedicationsNote';
import PhysicalExamNote from './notesections/PhysicalExamNote';
import PlanNote from './notesections/PlanNote';
import ReviewOfSystemsNote from './notesections/ReviewOfSystemsNote';
import SocialHistoryNote from './notesections/SocialHistoryNote';
import SurgicalHistoryNote from './notesections/SurgicalHistoryNote';

import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { PatientPronouns } from '@constants/patientInformation';
import 'screens/EditNote/content/hpi/knowledgegraph/css/Button.css';
import getHPIText, { HPIText } from '@utils/getHPIText';
import './GenerateNote.css';
import PatientInfo from './PatientInfo';

interface OwnProps {
    previousFormClick: () => void;
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
    additionalSurveyState: AdditionalSurvey;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

// TODO: look into <li> keys -- throws a warning if duplicates, not a huge deal but probably fix
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
        additionalSurveyState,
    } = props;

    const { patientName, pronouns } = patientInformationState;

    // Opening and closing modal with patient information
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const openModal = (): void => setIsModalOpen(true);
    // const closeModal = (): void => setIsModalOpen(false);
    // const savePatientInfo = () => {
    //     updatePatientInformation(patientName, pronouns);
    //     closeModal();
    // };
    const [isBulletNoteView, setIsBulletNoteView] = useState(true);
    const [isRichText, setIsRichText] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isNoteExpanded, setIsNoteExpanded] = useState(false);

    /** TODO: This logic is loosely duplicated from NavMenu.tsx. This function has been brute-force copied
     * throughout the codebase 10+ times to determine whether or not each individual component is "mobile".
     * Many times the logic uses a different px value to determine what "mobile" is. The "mobile" prop is also
     * prop-drilled through many levels when used. Recomendations to clean this up:
     * 1) There should only be one value for "mobile" in terms of px width across the app.
     * 2) The logic for determining if the app is displaying at the mobile breakpoint should only appear once.
     * 3) Prop-drilling should be avoided. This is a good article that details
     * how to use composition to avoid prop-drilling: https://javascript.plainenglish.io/composition-in-react-f02afe24bc46
     */
    useEffect(() => {
        prefillName();
        prefillPronouns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const prefillPronouns = () => {
        const preferredPronouns =
            additionalSurveyState?.userInfo?.preferredPronouns;
        if (!preferredPronouns) {
            return;
        }
        if (preferredPronouns.includes('She')) {
            updatePatientPronouns(PatientPronouns.She);
        } else if (preferredPronouns.includes('They')) {
            updatePatientPronouns(PatientPronouns.They);
        } else if (preferredPronouns.includes('He')) {
            updatePatientPronouns(PatientPronouns.He);
        }
    };
    const prefillName = () => {
        const age = diff_years(
            new Date(additionalSurveyState.dateOfBirth),
            new Date()
        );
        if (age > 18) {
            updatePatientInformation(
                additionalSurveyState?.userInfo?.title +
                    ' ' +
                    additionalSurveyState?.legalLastName,
                pronouns
            );
        } else {
            updatePatientInformation(
                additionalSurveyState.legalFirstName,
                pronouns
            );
        }
    };

    function diff_years(dt2: Date, dt1: Date) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60 * 24;
        return Math.abs(Math.round(diff / 365.25));
    }

    const copyNote = () => {
        const note = document.querySelectorAll('.generated-note-text');
        if (note?.length > 0) {
            navigator.clipboard.writeText(
                (note[0] as HTMLHeadingElement)?.innerText || ''
            );
        }
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

    const bulletPointToggler = (
        <Button.Group className='btn-right'>
            <Button
                onClick={() => setIsBulletNoteView(!isBulletNoteView)}
                className={`margin-left-1 hpi-ph-button${
                    isBulletNoteView ? '-selected' : ''
                }`}
            >
                Bullet Point HPI
            </Button>
        </Button.Group>
    );

    const generateNoteButtons = (
        <Fragment>
            <div className={'ui input large'}>
                <input
                    id='patientName'
                    type='text'
                    autoComplete='off'
                    placeholder="Patient's name (optional)"
                    value={patientName}
                    disabled={true}
                    onChange={(e) => updatePatientName(e.target.value)}
                ></input>
            </div>
            <Button.Group className='generate-note-button-spacing'>
                <Button
                    onClick={() => updatePatientPronouns(PatientPronouns.She)}
                    className={`hpi-ph-button${
                        pronouns === PatientPronouns.She ? '-selected' : ''
                    }`}
                >
                    She
                </Button>
                <Button.Or />
                <Button
                    onClick={() => updatePatientPronouns(PatientPronouns.They)}
                    className={`hpi-ph-button${
                        pronouns === PatientPronouns.They ? '-selected' : ''
                    }`}
                >
                    They
                </Button>
                <Button.Or />
                <Button
                    onClick={() => updatePatientPronouns(PatientPronouns.He)}
                    className={`hpi-ph-button${
                        pronouns === PatientPronouns.He ? '-selected' : ''
                    }`}
                >
                    He
                </Button>
            </Button.Group>
            {richOrPlainButtons}
            {bulletPointToggler}
        </Fragment>
    );

    return (
        <div className='generate-note-wrap'>
            <div className='generate-note-buttons'>
                <Segment
                    id='generateNoteButtonsContainer'
                    className='generate-note-buttons__container'
                >
                    <h3 onClick={() => setIsExpanded(!isExpanded)}>
                        <img
                            src={'/images/angle-down.svg'}
                            alt='bottom'
                            style={{
                                transform: isExpanded ? '' : 'rotate(-90deg)',
                            }}
                        />
                        Patient Information
                    </h3>

                    {generateNoteButtons}
                </Segment>
            </div>
            {isExpanded && (
                <Segment>
                    <PatientInfo
                        isRichText={isRichText}
                        additionalSurveyState={additionalSurveyState}
                    />
                </Segment>
            )}

            <Segment>
                <div className='title'>
                    <h3 onClick={() => setIsNoteExpanded(!isNoteExpanded)}>
                        <img
                            src={'/images/angle-down.svg'}
                            alt='bottom'
                            style={{
                                transform: isNoteExpanded
                                    ? ''
                                    : 'rotate(-90deg)',
                            }}
                        />
                        Note
                    </h3>

                    <Button.Group floated='right'>
                        <Button
                            className='copy-button'
                            onClick={() => copyNote()}
                        >
                            Copy Note
                        </Button>
                    </Button.Group>
                </div>

                <div
                    className='notes-wrapper'
                    style={{
                        height: isNoteExpanded === true ? '100%' : '0px',
                    }}
                >
                    <Segment className='generated-note-text'>
                        <h3> History of Present Illness </h3>
                        <HPINote
                            text={
                                getHPIText(isBulletNoteView, {
                                    hpi: props.hpi,
                                    chiefComplaints: props.chiefComplaints,
                                    familyHistory: props.familyHistoryState,
                                    medications: props.medicationsState,
                                    medicalHistory: props.medicalHistoryState,
                                    patientInformation:
                                        props.patientInformationState,
                                    surgicalHistory: props.surgicalHistory,
                                    userSurvey: props.userSurvey,
                                }) as HPIText[]
                            }
                            bulletNoteView={isBulletNoteView}
                        />
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
                        <AllergiesNote
                            isRich={isRichText}
                            allergies={allergiesState}
                        />
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
                        <ReviewOfSystemsNote
                            isRich={isRichText}
                            ROSState={ROSState}
                        />
                        <h3> Physical Exam </h3>
                        <PhysicalExamNote
                            isRich={isRichText}
                            physicalExam={physicalExamState}
                        />
                        <h3> Plan </h3>
                        <PlanNote planState={planState} />
                    </Segment>
                </div>
            </Segment>
            <NavigationButton previousClick={previousFormClick} />
        </div>
    );
};

const mapStateToProps = (state: CurrentNoteState) => ({
    ROSState: selectReviewOfSystemsState(state),
    planState: selectPlanState(state),
    familyHistoryState: selectFamilyHistoryState(state),
    socialHistoryState: state.socialHistory,
    allergiesState: selectAllergiesState(state),
    medicationsState: selectMedicationsState(state),
    surgicalHistoryState: selectSurgicalHistoryState(state),
    medicalHistoryState: selectMedicalHistoryState(state),
    physicalExamState: state.physicalExam,
    patientInformationState: selectPatientInformationState(state),
    additionalSurveyState: state.additionalSurvey,
    hpi: selectHpiState(state),
    surgicalHistory: selectSurgicalHistoryProcedures(state),
    chiefComplaints: selectChiefComplaintsState(state),
    userSurvey: selectInitialPatientSurvey(state),
});

const mapDispatchToProps = {
    updatePatientName,
    updatePatientPronouns,
    updatePatientInformation,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(GenerateNote);
