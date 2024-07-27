'use client';

import React from 'react';
import style from './GeneratedNoteContent.module.scss';
import {
    AppointmentUser,
} from '@screens/BrowseNotes/BrowseNotes';
import { ParseAndRenderHpiNote } from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { toast } from 'react-toastify';

interface GeneratedNoteContentProps {
    selectedAppointment: AppointmentUser;
}
const GeneratedNoteContent = (selectedAppointment: GeneratedNoteContentProps) => {
    console.log(selectedAppointment);
    const { firstName, middleName, lastName, hpiText } = selectedAppointment.selectedAppointment;
    const data = {
        'Name': 'Sara K.',
        'Date of Evaluation': 'June 15, 2024',
        'Age': '30 Years-old',
        'Referred by': 'Dr. Kate R.',
        'DOB': 'June 10, 1994',
        'Examiners': 'Dr. Marta J.',
        'Education': 'High School Diploma',
        '': '',
        'Occupation': 'Retail Worker',
    }
    const sourcesData = [
        {
            'icon': '/images/doctor.svg',
            'title': 'Clinician survey',
            'Status': 'Not started',
        },
        {
            'icon': '/images/patient.svg',
            'title': 'Evaluation results',
            'Status': 'Finished',
        },
        {
            'icon': '/images/doctor.svg',
            'title': 'Patient survey',
            'Status': 'In progress',
        }
    ]

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

    return (
        <div>
            <div className={style.genNoteHeader}>
                <h1>{`${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`}</h1>
                <div className={style.genNoteHeader__Button} onClick={copyNote}>
                    Copy Note
                </div>
            </div>
            <div className={style.genNoteContent}>
                <div className={style.genNoteTitle}>
                    <div className={style.genNoteTitle__Icon}>
                        <img src="/images/cydoc-logo.svg" alt="cydoc-logo" />
                        <h1>Cydoc</h1>
                    </div>
                    <p>Psychological Evaluation</p>
                </div>
                <div className={style.genNoteBody}>
                    {Object.keys(data).map((item, index) => {
                        console.log(item);
                        return (
                            <div key={index} className={style.genNoteBody__Item}>
                                <h3>{item ? `${item}:` : ''}</h3>
                                <p>{data[item]}</p>
                            </div>
                        )
                    })}
                </div>
                <div className={style.genNoteDetail} id='copy-notes'>
                    <ParseAndRenderHpiNote
                        hpiText={hpiText}
                        isParagraphFormat={true}
                    />
                </div>
                <div className={style.genNoteSource}>
                    <h1>Source Data (Forms)</h1>
                    {
                        Object.keys(sourcesData).map((item, index) => {
                            let statusStyle = {};
                            let dotStyle = {};
                            let textStyle = {};
                            switch (sourcesData[item].Status) {
                                case "Not started":
                                    statusStyle = { backgroundColor: '#F5F5F5', };
                                    dotStyle = { backgroundColor: '#7F8485' };
                                    textStyle = { color: '#00000099' };
                                    break;
                                case "Finished":
                                    statusStyle = { backgroundColor: '#EAF3F5' };
                                    dotStyle = { backgroundColor: '#057A9B' };
                                    textStyle = { color: '#057A9B' };
                                    break;
                                case "In progress":
                                    statusStyle = { backgroundColor: '#EFA7001A' };
                                    dotStyle = { backgroundColor: '#EFA700' };
                                    textStyle = { color: '#EFA700' };
                                    break;
                                default:
                                    statusStyle = { backgroundColor: '#F5F5F5', };
                                    dotStyle = { backgroundColor: '#7F8485' };
                                    textStyle = { color: '#00000099' };
                            }

                            return (
                                <div key={index} className={style.genNoteSource__Item}>
                                    <div className={style.genNoteSource__ItemIcon}>
                                        <img src={sourcesData[item].icon} alt="icon" />
                                        <h3>{sourcesData[item].title}</h3>
                                    </div>
                                    <div
                                        style={statusStyle}
                                        className={style.genNoteSource__ItemStatus}
                                    >
                                        <div
                                            style={dotStyle}
                                            className={style.genNoteSource__ItemStatus__circle}
                                        />
                                        <p
                                            style={textStyle}
                                        >{sourcesData[item].Status}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};
export default GeneratedNoteContent;
