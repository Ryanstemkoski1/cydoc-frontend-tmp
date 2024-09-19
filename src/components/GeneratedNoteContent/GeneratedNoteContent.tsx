'use client';

import React, { useEffect, useState } from 'react';
import style from './GeneratedNoteContent.module.scss';
import HpiNote from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import { Appointment, AppointmentTemplate } from '@cydoc-ai/types';
import {
    FormStatus,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import { getFilledForm } from '@modules/filled-form-api';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { HPIText } from '@utils/textGeneration/extraction/getHPIArray';
import { isArray } from 'lodash';
import { RCONNELL_ADULT_MEDID } from '@constants/enums/chiefComplaints.enums';

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
    const {
        patient,
        institutionId,
        appointmentDate,
        notes = [],
    } = selectedAppointment;

    const { firstName, middleName, lastName, dob } = patient;
    const [formStatuses, setFormStatuses] = useState<{
        [form_category: string]: FormStatus;
    }>({});

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

    const filteredNotes = {};
    for (const note of notes) {
        const hpi = JSON.parse(note.hpi);
        if (isArray(hpi)) {
            for (const item of hpi) {
                if (!filteredNotes[item.title]) {
                    filteredNotes[item.title] = {
                        item: item,
                        createdAt: new Date(note.createdDate),
                    };
                } else {
                    const createdAt = new Date(note.createdDate);
                    if (createdAt > filteredNotes[item.title].createdAt) {
                        filteredNotes[item.title] = {
                            item: item,
                            createdAt: new Date(note.createdDate),
                        };
                    }
                }
            }
        }
    }
    const hpiTexts = Object.values(filteredNotes).map(
        (note: Record<string, HPIText>) => note.item
    );

    useEffect(() => {
        const getFilledForms = async () => {
            if (!selectedAppointment || !selectedTemplate?.steps) {
                return;
            }
            const promises = selectedTemplate?.steps
                .filter((step) => step.completedBy != WhoCompletes.Cydoc_ai)
                .map(async (step) => {
                    return getFilledForm(
                        selectedAppointment.id,
                        step.id,
                        step.formCategory
                    );
                });
            const filledForms = await Promise.all(promises);
            const statuses = filledForms
                .filter((form) => form && form.data.filled_form)
                .map((form) => form!.data.filled_form)
                .reduce(
                    (acc, form) => ({
                        ...acc,
                        [form.formCategory]: form.status,
                    }),
                    {}
                );
            setFormStatuses(statuses);

            const rconnellAdultForm = filledForms.find(
                (form) =>
                    form &&
                    form.data.filled_form.formCategory === 'RCONNELL_ADULT'
            );

            if (rconnellAdultForm) {
                const formContent =
                    rconnellAdultForm.data.filled_form.formContent;

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

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    const copyNote = () => {
        const note = document.getElementById('copy-notes');
        if (note) {
            navigator.clipboard.writeText(
                (note as HTMLHeadingElement)?.innerText || ''
            );
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

    return (
        <Box>
            <Box className={style.genNoteHeader}>
                <Typography variant='h1'>{`${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`}</Typography>
                <Box className={style.genNoteHeader__Button} onClick={copyNote}>
                    Copy Note
                </Box>
            </Box>
            <Box className={style.genNoteContent}>
                <Box className={style.genNoteTitle}>
                    <Box className={style.genNoteTitle__Icon}>
                        <img src='/images/cydoc-logo.svg' alt='cydoc-logo' />
                        <Typography variant='h1'>Cydoc</Typography>
                    </Box>
                    <Typography component={'p'}>
                        Psychological Evaluation
                    </Typography>
                </Box>
                <Box className={style.genNoteBody}>
                    <Box className={style.genNoteBody__left}>
                        {Object.keys(metadata1).map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    className={style.genNoteBody__Item1}
                                >
                                    <Typography variant='h3'>
                                        {item ? `${item}:` : ''}
                                    </Typography>
                                    <Typography component={'p'}>
                                        {metadata1[item]}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box>
                        {Object.keys(metadata2).map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    className={style.genNoteBody__Item2}
                                >
                                    <Typography variant='h3'>
                                        {item ? `${item}:` : ''}
                                    </Typography>
                                    <Typography component={'p'}>
                                        {metadata2[item]}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
                {hpiTexts.length > 0 && (
                    <Box className={style.genNoteDetail} id='copy-notes'>
                        <HpiNote text={hpiTexts} isParagraphFormat={false} />
                    </Box>
                )}
                <Box className={style.genNoteSource}>
                    <Typography variant='h1'>Source Data (Forms)</Typography>
                    {!selectedTemplate?.steps && (
                        <div className={style.nodata}>
                            <Typography
                                variant='body2'
                                align='center'
                                paddingY={5}
                            >
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
                                params.append(
                                    'form_name',
                                    form?.diseaseName || ''
                                );
                                params.append(
                                    'appointment_template_id',
                                    selectedTemplate.id
                                );
                                params.append('template_step_id', item.id);
                                params.append(
                                    'appointment_date',
                                    appointmentDate
                                );
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
                                        item.completedBy ===
                                        WhoCompletes.Cydoc_ai
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
        </Box>
    );
};
export default GeneratedNoteContent;
