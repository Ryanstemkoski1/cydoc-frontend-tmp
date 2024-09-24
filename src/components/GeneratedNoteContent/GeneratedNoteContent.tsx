'use client';

import React, { useEffect, useState } from 'react';
import style from './GeneratedNoteContent.module.scss';
import Image from 'next/image';

import HpiNote from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import { Appointment, AppointmentTemplate, Institution } from '@cydoc-ai/types';
import {
    FormStatus,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectSurgicalHistoryProcedures } from '@redux/selectors/surgicalHistorySelectors';
import { getFilledForm } from '@modules/filled-form-api';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import {
    HPIText,
    WholeNoteReduxValues,
} from '@utils/textGeneration/extraction/getHPIArray';
import { RCONNELL_ADULT_MEDID } from '@constants/enums/chiefComplaints.enums';
import { getInstitution } from '@modules/institution-api';
import { useSelector } from 'react-redux';
import getHPIFormData from '@utils/getHPIFormData';

interface GeneratedNoteContentProps {
    selectedAppointment: Appointment;
    selectedTemplate?: AppointmentTemplate;
    allDiseaseForms: DiseaseForm[];
    user: any;
}
const GeneratedNoteContent = ({
    selectedAppointment,
    selectedTemplate,
    allDiseaseForms,
    user,
}: GeneratedNoteContentProps) => {
    const { patient, institutionId, appointmentDate } = selectedAppointment;

    const { firstName, middleName, lastName, dob } = patient;
    const [formStatuses, setFormStatuses] = useState<{
        [form_category: string]: FormStatus;
    }>({});
    const [institution, setInstitution] = React.useState<Institution | null>(
        null
    );

    const data1 = {
        Name: `${firstName} ${middleName ? middleName : ''} ${lastName}`,
        Age: `${calculateAge(dob)} Years-old`,
        DOB: formatDate(dob),
        Education: '-/-',
        Occupation: '-/-',
    };
    const data2 = {
        'Date of Evaluation': formatDate(appointmentDate),
        'Referred by': '-/-',
        Examiners: user.firstName + ' ' + user.lastName,
    };

    const [metadata1, setMetadata1] = useState(data1);
    const [metadata2, setMetadata2] = useState(data2);
    const [hpiTexts, setHpiTexts] = useState<HPIText[]>([]);

    const additionalSurvey = useSelector(selectAdditionalSurvey);
    const userSurveyState = useSelector(selectInitialPatientSurvey);
    const familyHistoryState = useSelector(selectFamilyHistoryState);
    const medicationsState = useSelector(selectMedicationsState);
    const medicalHistoryState = useSelector(selectMedicalHistoryState);
    const patientInformationState = useSelector(selectPatientInformationState);
    const surgicalHistory = useSelector(selectSurgicalHistoryProcedures);

    useEffect(() => {
        const getFilledForms = async () => {
            if (!selectedAppointment || !selectedTemplate?.steps) {
                return;
            }
            const promises = selectedTemplate?.steps
                .sort((a, b) => a.stepOrder - b.stepOrder)
                .filter((step) => step.completedBy != WhoCompletes.Cydoc_ai)
                .map(async (step) => {
                    return getFilledForm(
                        selectedAppointment.id,
                        step.id,
                        step.formCategory
                    );
                });
            const filledForms = (await Promise.all(promises))
                .filter((form) => form && form.data.filled_form)
                .map((form) => form!.data.filled_form);
            const statuses = filledForms.reduce(
                (acc, form) => ({
                    ...acc,
                    [form.formCategory]: form.status,
                }),
                {}
            );
            setFormStatuses(statuses);

            const generatedHpi = filledForms
                .filter(
                    (form) =>
                        statuses[form.formCategory] === FormStatus.Finished ||
                        statuses[form.formCategory] === FormStatus.In_Progress
                )
                .map((form) => {
                    const hpiState = form.formContent;
                    const formCategory = form.formCategory;
                    const formName =
                        allDiseaseForms.find(
                            (form) => form.diseaseKey === formCategory
                        )?.diseaseName || '';
                    const state: WholeNoteReduxValues = {
                        hpi: hpiState,
                        familyHistory: familyHistoryState,
                        medications: medicationsState,
                        surgicalHistory: surgicalHistory,
                        medicalHistory: medicalHistoryState,
                        patientInformation: patientInformationState,
                        chiefComplaints: {
                            [formName]: '',
                        },
                        userSurvey: userSurveyState,
                    };
                    return getHPIFormData(
                        additionalSurvey,
                        userSurveyState,
                        state,
                        lastName
                    );
                });

            const hpiTexts = generatedHpi
                .map((hpi) => JSON.parse(hpi.hpi_text))
                .flat()
                .filter((hpi) => !!hpi.title && !!hpi.text.trim()) as HPIText[];
            setHpiTexts(hpiTexts);

            const rconnellAdultForm = filledForms.find(
                (form) => form && form.formCategory === 'RCONNELL_ADULT'
            );

            if (rconnellAdultForm) {
                const formContent = rconnellAdultForm.formContent;

                let education = '-/-';
                let occupation = '-/-';
                let referredBy = '-/-';

                const nodes = formContent.nodes;
                const highSchoolEducationNode =
                    nodes[
                        RCONNELL_ADULT_MEDID
                            .Education_High_Scholl_Graduated_YES_NO
                    ];
                if (
                    highSchoolEducationNode &&
                    highSchoolEducationNode.response
                ) {
                    const response = highSchoolEducationNode.response;
                    if (response.yes) {
                        education = 'High School';
                    } else if (response.no) {
                        education = 'Less than High School';
                    }
                }

                const degreeNode = nodes[RCONNELL_ADULT_MEDID.Education_Degree];
                if (degreeNode && degreeNode.response) {
                    const response = degreeNode.response;
                    if (response['graduated from college']) {
                        education = 'College';
                    } else if (response['trade school']) {
                        education = 'Trade School';
                    } else if (response["an associate's degree"]) {
                        education = "Associate's Degree";
                    } else if (response["a bachelor's degree"]) {
                        education = "Bachelor's Degree";
                    } else if (response['a doctor degree']) {
                        education = 'Doctoral Degree';
                    }
                }

                const occupationNode = nodes[RCONNELL_ADULT_MEDID.Occupation];
                if (occupationNode && occupationNode.response) {
                    occupation = occupationNode.response;
                }

                const referredByNode = nodes[RCONNELL_ADULT_MEDID.Reffered_By];
                if (referredByNode && referredByNode.response) {
                    const response = referredByNode.response;
                    if (response['primary care physician']) {
                        referredBy = 'Primary Care Physician';
                    } else if (response['other']) {
                        referredBy = 'Other';
                    }
                }

                setMetadata1({
                    ...metadata1,
                    Education: education,
                    Occupation: occupation,
                });

                setMetadata2({
                    ...metadata2,
                    'Referred by': referredBy,
                });
            } else {
                setMetadata1({ ...data1 });
                setMetadata2({ ...data2 });
            }
        };

        getFilledForms();
    }, [selectedAppointment, selectedTemplate]);
    function calculateAge(dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dobDate.getDate())
        ) {
            age--;
        }
        return age;
    }

    useEffect(() => {
        const fetchInstitution = async () => {
            const institution = await getInstitution(user!.institutionId);
            setInstitution(institution);
        };
        fetchInstitution();
    }, [user]);

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    const copyNote = () => {
        const note = document.getElementById('copy-content');
        if (note) {
            function getComputedStyleString(element: HTMLElement): string {
                const computedStyle = window.getComputedStyle(element);
                let styleString = '';
                for (let i = 0; i < computedStyle.length; i++) {
                    const property = computedStyle[i];
                    styleString += `${property}: ${computedStyle.getPropertyValue(property)}; `;
                }
                return styleString;
            }

            function inlineStyles(element: HTMLElement): void {
                const children = element.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i] as HTMLElement;
                    child.setAttribute('style', getComputedStyleString(child));
                    inlineStyles(child); // Recursively inline styles for child elements
                }
            }

            const noteElement = document.getElementById(
                'copy-content'
            ) as HTMLElement;
            inlineStyles(noteElement);
            const htmlContent = noteElement.outerHTML;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({ 'text/html': blob });

            navigator.clipboard
                .write([clipboardItem])
                .then(() => {})
                .catch((err) => {
                    console.error('Failed to copy: ', err);
                });

            toast.success('Copied to Clipboard!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
                closeOnClick: true,
                theme: 'light',
            });
        } else {
            toast.error('No notes to copy!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
                closeOnClick: true,
                theme: 'light',
            });
        }
    };

    function getReporterIcon(reporter: string) {
        switch (reporter) {
            case WhoCompletes.Staff:
                return '/images/reporter-staff.svg';
                break;
            case WhoCompletes.Clinician:
                return '/images/reporter-clinician.svg';
                break;
            case WhoCompletes.Patient:
                return '/images/reporter-patient.svg';
                break;
            default:
                return '/images/reporter-staff.svg';
        }
    }

    const renderBody = (
        <Box className={style.genNoteContent} id={'copy-content'}>
            <Box className={style.genNoteTitle}>
                <Box className={style.genNoteTitle__logoBox}>
                    <Image
                        height={54}
                        width={54}
                        src={institution?.logo || '/images/cydoc-logo.svg'}
                        alt={institution?.name || 'Cydoc'}
                    />
                    <div>
                        <Typography
                            className={style.genNoteTitle__logoBox__title}
                            sx={{
                                fontFamily: 'Nunito !important',
                                fontWeight: 'bold !important',
                            }}
                        >
                            {institution?.name || 'Cydoc'}
                        </Typography>
                    </div>
                </Box>
                <Typography component={'p'} sx={{ pt: '8px' }}>
                    Psychological Evaluation
                </Typography>
            </Box>
            <Box className={style.genNoteBody}>
                <table>
                    <tbody>
                        {Object.keys(metadata2).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td
                                        className={
                                            style.genNoteBody__noteHeading
                                        }
                                    >
                                        {Object.keys(metadata1)[index]} :{' '}
                                    </td>
                                    <td className='pl-10'>
                                        {
                                            metadata1[
                                                Object.keys(metadata1)[index]
                                            ]
                                        }
                                    </td>
                                    <td
                                        className={`
                                            ${style.genNoteBody__noteHeading} pl-30
                                        `}
                                    >
                                        {item} :{' '}
                                    </td>
                                    <td className='pl-10'>{metadata2[item]}</td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td className={style.genNoteBody__noteHeading}>
                                Education:{' '}
                            </td>
                            <td className='pl-10'>{metadata1['Education']}</td>
                        </tr>
                        <tr>
                            <td className={style.genNoteBody__noteHeading}>
                                Occupation:{' '}
                            </td>
                            <td className='pl-10'>{metadata1['Occupation']}</td>
                        </tr>
                    </tbody>
                </table>
            </Box>
            {hpiTexts.length > 0 && (
                <Box className={style.genNoteDetail} id='copy-notes'>
                    <HpiNote text={hpiTexts} isParagraphFormat={false} />
                </Box>
            )}
        </Box>
    );

    return (
        <Box>
            <Box className={style.genNoteHeader}>
                <Typography variant='h1'>{`${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`}</Typography>
                <Box className={style.genNoteHeader__Button} onClick={copyNote}>
                    Copy Note
                </Box>
            </Box>
            {renderBody}
            <Box className={style.genNoteSource}>
                <Typography variant='h1'>Source Data (Forms)</Typography>
                {!selectedTemplate?.steps && (
                    <div className={style.nodata}>
                        <Typography variant='body2' align='center' paddingY={5}>
                            No forms found
                        </Typography>
                    </div>
                )}
                {selectedTemplate &&
                    selectedTemplate.steps &&
                    selectedTemplate.steps.map((item, index) => {
                        let statusStyle = {};
                        let dotStyle = {};
                        let textStyle = {};
                        const status =
                            formStatuses[item.formCategory] ||
                            FormStatus.Not_Started;
                        const form = allDiseaseForms.find(
                            (form) => form.diseaseKey === item.formCategory
                        );
                        switch (status) {
                            case FormStatus.Not_Started:
                                statusStyle = {
                                    backgroundColor: '#F5F5F5',
                                };
                                dotStyle = { backgroundColor: '#7F8485' };
                                textStyle = { color: '#00000099' };
                                break;
                            case FormStatus.Finished:
                                statusStyle = {
                                    backgroundColor: '#EAF3F5',
                                };
                                dotStyle = { backgroundColor: '#057A9B' };
                                textStyle = { color: '#057A9B' };
                                break;
                            case FormStatus.In_Progress:
                                statusStyle = {
                                    backgroundColor: '#EFA7001A',
                                };
                                dotStyle = { backgroundColor: '#EFA700' };
                                textStyle = { color: '#EFA700' };
                                break;
                            default:
                                statusStyle = {
                                    backgroundColor: '#F5F5F5',
                                };
                                dotStyle = { backgroundColor: '#7F8485' };
                                textStyle = { color: '#00000099' };
                        }

                        let link;
                        if (item.completedBy === WhoCompletes.Cydoc_ai) {
                            link = 'javascript: void(0)'; // Disable link for Cydoc.ai
                        } else {
                            const params = new URLSearchParams();
                            params.append('institution_id', institutionId);
                            params.append(
                                'appointment_id',
                                selectedAppointment.id
                            );
                            params.append(
                                'form_category',
                                item.formCategory || ''
                            );
                            params.append('form_name', form?.diseaseName || '');
                            params.append(
                                'appointment_template_id',
                                selectedTemplate.id
                            );
                            params.append('template_step_id', item.id);
                            params.append('appointment_date', appointmentDate);
                            params.append(
                                'patient_id',
                                selectedAppointment.patientId
                            );

                            link = `${window.location.origin}/hpi/form-advance?${params.toString()}`;
                        }

                        return (
                            <a
                                key={index}
                                target={
                                    item.completedBy === WhoCompletes.Cydoc_ai
                                        ? '_self'
                                        : '_blank'
                                }
                                rel='noreferrer'
                                href={link}
                            >
                                <Box className={style.genNoteSource__Item}>
                                    <Box
                                        className={
                                            style.genNoteSource__ItemIcon
                                        }
                                    >
                                        <img
                                            src={getReporterIcon(
                                                item.completedBy
                                            )}
                                            alt={`${item.completedBy}`}
                                        />
                                        <Typography variant='h3'>
                                            {item.completedBy ===
                                            WhoCompletes.Cydoc_ai
                                                ? item.taskType
                                                : form?.diseaseName ||
                                                  item.formCategory}
                                        </Typography>
                                    </Box>
                                    <Box
                                        style={statusStyle}
                                        className={
                                            style.genNoteSource__ItemStatus
                                        }
                                    >
                                        <Box
                                            style={dotStyle}
                                            className={
                                                style.genNoteSource__ItemStatus__circle
                                            }
                                        />
                                        <Typography
                                            component={'p'}
                                            style={textStyle}
                                        >
                                            {status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </a>
                        );
                    })}
            </Box>
        </Box>
    );
};
export default GeneratedNoteContent;
