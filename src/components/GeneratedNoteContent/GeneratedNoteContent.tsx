'use client';

import React from 'react';
import style from './GeneratedNoteContent.module.scss';
import {
    AppointmentUser,
} from '@screens/BrowseNotes/BrowseNotes';
import { ParseAndRenderHpiNote } from '@screens/EditNote/content/generatenote/notesections/HPINote';

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
        'Occupation': 'Retail Worker',
    }
    return (
        <div>
            <div className={style.genNoteHeader}>
                <h1>{`${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`}</h1>
                <div className={style.genNoteHeader__Button}>
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
                                <h3>{item}:</h3>
                                <p>{data[item]}</p>
                            </div>
                        )
                    })}
                </div>
                <div className={style.genNoteDetail}>
                    <ParseAndRenderHpiNote
                        hpiText={hpiText}
                        isParagraphFormat={true}
                    />
                </div>
            </div>
        </div>
    );
};
export default GeneratedNoteContent;
