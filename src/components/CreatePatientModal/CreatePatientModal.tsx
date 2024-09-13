import { MouseEvent, default as React, useEffect, useRef } from 'react';
import style from './CreatePatientModal.module.scss';
import { Box, Typography } from '@mui/material';
import Dropdown from '@components/Input/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '@components/Input/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdditionalSurveyDetails } from '@redux/actions/additionalSurveyActions';
import { initialSurveyAddDateOrPlace } from '@redux/actions/userViewActions';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import useQuery from '@hooks/useQuery';
import useUser from '@hooks/useUser';
import { apiClient } from '@constants/api';
import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import getHPIFormData from '@utils/getHPIFormData';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectSurgicalHistoryProcedures } from '@redux/selectors/surgicalHistorySelectors';
import { selectChiefComplaintsState } from '@redux/selectors/chiefComplaintsSelectors';
import MobileDatePicker from '@components/Input/MobileDatePicker';
import useIsMobile from '@hooks/useIsMobile';
import { AppointmentTemplate } from '@cydoc-ai/types';

export interface CreatePatientModalProps {
    showModal: boolean;
    templates: AppointmentTemplate[];
    setShowModal: (value: boolean) => void;
    onCreatedPatient: () => void;
}

const CreatePatientModal = ({
    showModal,
    templates,
    setShowModal,
    onCreatedPatient,
}: CreatePatientModalProps) => {
    const dispatch = useDispatch();
    const modalRef = useRef<HTMLDivElement>(null);
    const [patientDetails, setPatientDetails] = React.useState({
        legalFirstName: '',
        legalLastName: '',
        legalMiddleName: '',
        dateOfBirth: '',
        dateOfAppointment: '',
        typeOfAppointment: '',
    });
    const [errorMessage, setErrorMessage] = React.useState('');

    const query = useQuery();
    const { user } = useUser();

    const additionalSurvey = useSelector(selectAdditionalSurvey);
    const userSurveyState = useSelector(selectInitialPatientSurvey);
    const chiefComplaints = useSelector(selectChiefComplaintsState);
    const hpi = useSelector(selectHpiState);
    const familyHistoryState = useSelector(selectFamilyHistoryState);
    const medicationsState = useSelector(selectMedicationsState);
    const medicalHistoryState = useSelector(selectMedicalHistoryState);
    const patientInformationState = useSelector(selectPatientInformationState);
    const surgicalHistory = useSelector(selectSurgicalHistoryProcedures);
    const isMobile = useIsMobile();

    const handleClickOutsideModal = (event: MouseEvent<HTMLDivElement>) => {
        if (!modalRef.current?.contains(event.target as HTMLDivElement)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('isHidden');
        }
        return () => {
            document.body.classList.remove('isHidden');
        };
    }, [showModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrorMessage('');
        setPatientDetails({
            ...patientDetails,
            [name]: value,
        });
        if (name === 'dateOfAppointment') {
            dispatch(initialSurveyAddDateOrPlace('8', value));
        }
    };

    const handleBirthdayChange = (value: string) => {
        setErrorMessage('');
        setPatientDetails({
            ...patientDetails,
            dateOfBirth: value,
        });
    };

    const handleAppointmentChange = (value: string) => {
        setErrorMessage('');
        setPatientDetails({
            ...patientDetails,
            dateOfAppointment: value,
        });
        dispatch(initialSurveyAddDateOrPlace('8', value));
    };

    const handleTodayClick = (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        const todayDate = new Date().toISOString().split('T')[0];
        setPatientDetails({
            ...patientDetails,
            dateOfAppointment: todayDate,
        });
        dispatch(initialSurveyAddDateOrPlace('8', todayDate));
    };

    const onSelected = (value: string) => {
        setErrorMessage('');
        setPatientDetails({
            ...patientDetails,
            typeOfAppointment: value,
        });
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    function formatDate(date: string | Date): string {
        const inDateFormat = new Date(date);
        return (
            inDateFormat.getUTCFullYear().toString() +
            '-' +
            (inDateFormat.getUTCMonth() + 1).toString() +
            '-' +
            inDateFormat.getUTCDate().toString()
        );
    }

    const onCreatePatient = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const {
                legalFirstName,
                legalMiddleName,
                legalLastName,
                dateOfBirth,
                dateOfAppointment,
                typeOfAppointment,
            } = patientDetails;

            if (
                legalFirstName.trim() === '' ||
                legalLastName.trim() === '' ||
                dateOfBirth === 'Invalid Date'
            ) {
                setErrorMessage('Please fill in all details');
                return;
            }

            dispatch(
                updateAdditionalSurveyDetails(
                    legalFirstName.trim(),
                    legalLastName.trim(),
                    legalMiddleName.trim(),
                    '',
                    dateOfBirth.trim(),
                    0
                )
            );

            const clinician_id =
                query.get(HPIPatientQueryParams.CLINICIAN_ID) ?? '';
            const institution_id = user?.institutionId ?? '';
            // query.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';

            const createPatientResult = await apiClient.post('/patient', {
                firstName: legalFirstName.trim(),
                middleName: legalMiddleName.trim(),
                lastName: legalLastName.trim(),
                ssn_last_four_digit: '',
                dob: dateOfBirth.trim(),
            });

            const patientId = createPatientResult.data.id;

            const selecetedTemplate = templates.find(
                (template) => template.templateTitle === typeOfAppointment
            );
            await apiClient.post('/appointment', {
                notes: [
                    getHPIFormData(additionalSurvey, userSurveyState, {
                        hpi: hpi,
                        chiefComplaints: chiefComplaints,
                        familyHistory: familyHistoryState,
                        medications: medicationsState,
                        medicalHistory: medicalHistoryState,
                        patientInformation: patientInformationState,
                        surgicalHistory: surgicalHistory,
                        userSurvey: userSurveyState,
                    }),
                ],
                clinicianId: clinician_id,
                institutionId: institution_id,
                appointmentDate: dateOfAppointment,
                patientId: patientId,
                appointmentTemplateId: selecetedTemplate?.id ?? '',
            });
            setShowModal(false);
            setPatientDetails({
                legalFirstName: '',
                legalLastName: '',
                legalMiddleName: '',
                dateOfBirth: '',
                dateOfAppointment: '',
                typeOfAppointment: '',
            });
            onCreatedPatient();
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };

    return (
        <Box
            onClick={handleClickOutsideModal}
            className={`${style.modal} flex-wrap align-center justify-center ${
                !showModal ? style.modalClose : ''
            }`}
        >
            <Box className={style.modal__inner} ref={modalRef}>
                <Box className={style.modal__header}>
                    <Typography variant='h3'>Create patient</Typography>
                    <CloseIcon
                        style={{ cursor: 'pointer' }}
                        onClick={onCloseModal}
                    />
                </Box>
                <Box className={style.modal__innerContent}>
                    <form
                        className={`${style.modal__innerContent__form} flex-wrap`}
                    >
                        <Typography variant='h4'>Patient Info</Typography>
                        <CustomTextField
                            label='Legal First Name'
                            required={true}
                            aria-label='First-Name'
                            name='legalFirstName'
                            placeholder='Legal First Name'
                            value={patientDetails.legalFirstName}
                            onChange={handleChange}
                        />
                        <CustomTextField
                            label='Legal Middle Name'
                            aria-label='middle-Name'
                            name='legalMiddleName'
                            placeholder='Legal Middle Name'
                            value={patientDetails.legalMiddleName}
                            onChange={handleChange}
                        />
                        <CustomTextField
                            label='Legal Last Name'
                            required={true}
                            aria-label='last-Name'
                            name='legalLastName'
                            placeholder='Legal Last Name'
                            value={patientDetails.legalLastName}
                            onChange={handleChange}
                        />
                        {isMobile ? (
                            <>
                                <label>Date of Birth</label>
                                <MobileDatePicker
                                    value={patientDetails.dateOfBirth}
                                    handleChange={(value) =>
                                        handleBirthdayChange(value)
                                    }
                                />
                            </>
                        ) : (
                            <CustomTextField
                                id='dateOfBirth'
                                required={true}
                                type='date'
                                label='Date of Birth'
                                name='dateOfBirth'
                                placeholder='mm/dd/yyyy'
                                max={new Date().toJSON().slice(0, 10)}
                                value={patientDetails.dateOfBirth}
                                onChange={handleChange}
                            />
                        )}
                        <Typography variant='h4' sx={{ marginTop: '16px' }}>
                            Appointment info
                        </Typography>
                        <Box className={style.modal__innerContent__form__date}>
                            {isMobile ? (
                                <div>
                                    <label>Appointment date</label>
                                    <MobileDatePicker
                                        value={patientDetails.dateOfAppointment}
                                        handleChange={(value) =>
                                            handleAppointmentChange(value)
                                        }
                                    />
                                </div>
                            ) : (
                                <CustomTextField
                                    id='dateOfAppointment'
                                    type='date'
                                    label='Appointment date'
                                    name='dateOfAppointment'
                                    placeholder='mm/dd/yyyy'
                                    max={new Date().toJSON().slice(0, 10)}
                                    value={patientDetails.dateOfAppointment}
                                    onChange={handleChange}
                                />
                            )}
                            <button
                                type='button'
                                className={
                                    style.modal__innerContent__form__date__today
                                }
                                onClick={handleTodayClick}
                            >
                                Today
                            </button>
                        </Box>
                        <Typography
                            component={'p'}
                            style={{ marginBottom: '8px' }}
                        >
                            Appointment type
                        </Typography>
                        <Dropdown
                            items={templates.map((t) => t.templateTitle)}
                            value={patientDetails.typeOfAppointment}
                            onChange={onSelected}
                            placeholder='Select'
                            canEnterNewValue={false}
                            resetValueAfterClick={true}
                        />
                        {errorMessage && (
                            <div
                                className={
                                    style.modal__innerContent__form__error
                                }
                            >
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type='submit'
                            className={style.modal__innerContent__form__submit}
                            onClick={onCreatePatient}
                        >
                            Create patient
                        </button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default CreatePatientModal;
