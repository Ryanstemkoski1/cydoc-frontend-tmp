'use client';

import React from 'react';
import style from './GeneratedNoteContent.module.scss';
import { AppointmentUser } from '@screens/BrowseNotes/BrowseNotes';
import { ParseAndRenderHpiNote } from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';

interface GeneratedNoteContentProps {
    selectedAppointment: AppointmentUser;
}
const GeneratedNoteContent = (
    selectedAppointment: GeneratedNoteContentProps
) => {
    const { firstName, middleName, lastName, hpiText } =
        selectedAppointment.selectedAppointment;

    const data = {
        Name: 'Sara K.',
        'Date of Evaluation': 'June 15, 2024',
        Age: '30 Years-old',
        'Referred by': 'Dr. Kate R.',
        DOB: 'June 10, 1994',
        Examiners: 'Dr. Marta J.',
        Education: 'High School Diploma',
        '': '',
        Occupation: 'Retail Worker',
    };
    const sourcesData = [
        {
            reporter: 'clinician',
            title: 'Clinician survey',
            Status: 'Not started',
        },
        {
            reporter: 'staff',
            title: 'Evaluation results',
            Status: 'Finished',
        },
        {
            reporter: 'patient',
            title: 'Patient survey',
            Status: 'In progress',
        },
    ];

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
        }
    };

    function handleReporterChange(reporter: string) {
        switch (reporter) {
            case 'cydoc':
                return '/images/reporter-staff.svg';
                break;
            case 'clinician':
                return '/images/reporter-clinician.svg';
                break;
            case 'staff':
                return '/images/reporter-staff.svg';
                break;
            case 'patient':
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
                    {Object.keys(data).map((item, index) => {
                        return (
                            <Box
                                key={index}
                                className={style.genNoteBody__Item}
                            >
                                <Typography variant='h3'>
                                    {item ? `${item}:` : ''}
                                </Typography>
                                <Typography component={'p'}>
                                    {data[item]}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
                <Box className={style.genNoteDetail} id='copy-notes'>
                    <ParseAndRenderHpiNote
                        hpiText={hpiText}
                        isParagraphFormat={true}
                    />
                </Box>
                <Box className={style.genNoteSource}>
                    <Typography variant='h1'>Source Data (Forms)</Typography>
                    {Object.keys(sourcesData).map((item, index) => {
                        let statusStyle = {};
                        let dotStyle = {};
                        let textStyle = {};
                        switch (sourcesData[item].Status) {
                            case 'Not started':
                                statusStyle = { backgroundColor: '#F5F5F5' };
                                dotStyle = { backgroundColor: '#7F8485' };
                                textStyle = { color: '#00000099' };
                                break;
                            case 'Finished':
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
                            <Box
                                key={index}
                                className={style.genNoteSource__Item}
                            >
                                <Box className={style.genNoteSource__ItemIcon}>
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
                                    className={style.genNoteSource__ItemStatus}
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
                                        {sourcesData[item].Status}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};
export default GeneratedNoteContent;
