'use client';

import React, { useEffect } from 'react';
import style from './GeneratedNoteContent.module.scss';
import { ParseAndRenderHpiNote } from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient } from '@redux/actions/patientActions';
import axios from 'axios';
import { selectPatientState } from '@redux/selectors/patientSelector';

interface GeneratedNoteContentProps {
    selectedAppointment: any;
    user: any;
}
const GeneratedNoteContent = (
    selectedAppointment: GeneratedNoteContentProps
) => {
    const {
        firstName,
        middleName,
        lastName,
        dob,
        institutionId,
        appointmentDate,
        hpiText,
    } = selectedAppointment.selectedAppointment;

    const dispatch = useDispatch();
    const mockyAPI =
        'https://run.mocky.io/v3/355330c6-60a7-4502-a9fa-0ad0e19f1868';

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post(mockyAPI);
            dispatch(addPatient(response.data));
        };

        fetchData();

        // Cleanup function
        return () => {
            // Perform cleanup tasks if needed
        };
    }, []);

    const link = `${window.location.origin}/hpi/patient-advance?institution_id=${institutionId}`;

    const patientsData = useSelector(selectPatientState);

    const data1 = {
        Name: `${firstName} ${middleName ? middleName : ''} ${lastName}`,
        Age: `${calculateAge(dob)} Years-old`,
        DOB: formatDate(dob),
        Education: 'High School Diploma',
        Occupation: 'Retail Worker',
    };
    const data2 = {
        'Date of Evaluation': formatDate(appointmentDate),
        'Referred by': 'Dr. Kate R.',
        Examiners: 'Dr. Marta J.',
    };
    const tempData = [
        {
            stepNumber: 1,
            name: 'Connell and Associates Adult Evaluation',
            identifier: 'RCONNELL_ADULT',
            status: 'Not started',
        },
        {
            stepNumber: 2,
            name: 'Connell and Associates Adult Diagnosis Form',
            identifier: 'RCONNELL_ADULT_DX',
            status: 'Not started',
        },
        {
            stepNumber: 3,
            name: 'Personality Assessment Inventory',
            identifier: 'RCONNELL_PAI',
            status: 'Not started',
        },
        {
            stepNumber: 4,
            name: 'Cydoc AI Report Synthesis',
            identifier: 'CYDOC_AI_REPORT',
            status: 'Not started',
        },
    ];

    const sourcesData = tempData.map((form: any) => {
        return {
            reporter: form.identifier,
            title: form.name,
            status: form.status,
        };
    });

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

    function handleReporterChange(reporter: string) {
        switch (reporter) {
            case 'CYDOC_AI_REPORT':
                return '/images/reporter-staff.svg';
                break;
            case 'RCONNELL_ADULT':
                return '/images/reporter-clinician.svg';
                break;
            case 'RCONNELL_ADULT_DX':
                return '/images/reporter-staff.svg';
                break;
            case 'RCONNELL_PAI':
                return '/images/reporter-patient.svg';
                break;
            default:
                return '/images/reporter-staff.svg';
        }
    }

    const handleSourceFormClick = (item: any) => {
        const updatedAppointment = {
            ...selectedAppointment,
            selectedForm: item,
        };
        localStorage.setItem(
            'selectedAppointment',
            JSON.stringify(updatedAppointment)
        );
    };

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
                        {Object.keys(data1).map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    className={style.genNoteBody__Item1}
                                >
                                    <Typography variant='h3'>
                                        {item ? `${item}:` : ''}
                                    </Typography>
                                    <Typography component={'p'}>
                                        {data1[item]}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box>
                        {Object.keys(data2).map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    className={style.genNoteBody__Item2}
                                >
                                    <Typography variant='h3'>
                                        {item ? `${item}:` : ''}
                                    </Typography>
                                    <Typography component={'p'}>
                                        {data2[item]}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
                {hpiText !== undefined && !hpiText.includes('No history') && (
                    <Box className={style.genNoteDetail} id='copy-notes'>
                        <ParseAndRenderHpiNote
                            hpiText={hpiText}
                            isParagraphFormat={true}
                        />
                    </Box>
                )}
                <Box className={style.genNoteSource}>
                    <Typography variant='h1'>Source Data (Forms)</Typography>
                    {Object.keys(sourcesData).map((item, index) => {
                        let statusStyle = {};
                        let dotStyle = {};
                        let textStyle = {};
                        switch (sourcesData[item].status) {
                            case 'Not started':
                                statusStyle = { backgroundColor: '#F5F5F5' };
                                dotStyle = { backgroundColor: '#7F8485' };
                                textStyle = { color: '#00000099' };
                                break;
                            case 'Signed':
                                statusStyle = { backgroundColor: '#EAF3F5' };
                                dotStyle = { backgroundColor: '#057A9B' };
                                textStyle = { color: '#057A9B' };
                                break;
                            case 'In progress':
                                statusStyle = { backgroundColor: '#EFA7001A' };
                                dotStyle = { backgroundColor: '#EFA700' };
                                textStyle = { color: '#EFA700' };
                                break;
                            default:
                                statusStyle = { backgroundColor: '#F5F5F5' };
                                dotStyle = { backgroundColor: '#7F8485' };
                                textStyle = { color: '#00000099' };
                        }

                        return (
                            <a
                                key={index}
                                target='_blank'
                                rel='noreferrer'
                                href={link}
                            >
                                <Box
                                    className={style.genNoteSource__Item}
                                    onClick={() =>
                                        handleSourceFormClick(sourcesData[item])
                                    }
                                >
                                    <Box
                                        className={
                                            style.genNoteSource__ItemIcon
                                        }
                                    >
                                        <img
                                            src={handleReporterChange(
                                                sourcesData[item].reporter
                                            )}
                                            alt={`${sourcesData[item].reporter}`}
                                        />
                                        <Typography variant='h3'>
                                            {sourcesData[item].title}
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
                                            {sourcesData[item].status}
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
