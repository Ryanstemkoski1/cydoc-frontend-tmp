import { getFullName } from 'components/Input/DropdownForClinicians';
import Loader from 'components/tools/Loader/Loader';
import { localhostClient } from 'constants/api';
import { User } from 'pages/BrowseNotes/BrowseNotes';
import React, { useEffect, useRef, useState } from 'react';
import { formatHPIText } from 'utils/getHPIText';
import style from './Modal.module.scss';

export interface ModalProps {
    showModal: boolean;
    setShowModal: any;
    selectedAppointment: User | null;
}

interface HPIAppointmentDetails {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    last_4_ssn: string;
    appointment_date: Date;
    hpi_text: string;
    clinician_id: number;
}

const Modal = ({
    showModal,
    setShowModal,
    selectedAppointment,
}: ModalProps) => {
    const modalRef = useRef<any>();
    const [hpiAppointMentDetails, setHpiAppointmentDetails] =
        useState<HPIAppointmentDetails | null>(null);

    useEffect(() => {
        if (!selectedAppointment?.id) return;
        let stale = false;

        async function fetchHPIAppointmentsDetails() {
            const response = await localhostClient.get(
                `/appointment/${selectedAppointment?.id}`
            );
            if (!stale) setHpiAppointmentDetails(response.data.data[0]);
        }

        fetchHPIAppointmentsDetails();

        return () => {
            stale = true;
        };
    }, [selectedAppointment]);

    const handleClickOutsideModal = (event: any) => {
        if (!modalRef.current?.contains(event.target)) {
            setShowModal(false);
        }
    };

    const copyNote = () => {
        const note = document.getElementById('copy-notes');
        if (note) {
            navigator.clipboard.writeText(
                (note as HTMLHeadingElement)?.innerText || ''
            );
        }
    };

    return (
        <div
            onClick={handleClickOutsideModal}
            className={`${style.modal} flex-wrap align-center justify-center ${
                !showModal ? style.modalClose : ''
            }`}
        >
            <div className={style.modal__inner} ref={modalRef}>
                <div className={style.modal__header}>
                    <h3>
                        {selectedAppointment &&
                            getFullName(
                                selectedAppointment.first_name,
                                selectedAppointment.last_name
                            )}
                    </h3>
                </div>
                <div className={style.modal__innerContent}>
                    <div className='flex align-center justify-between'>
                        <h4>History of Present Illness/Subjective</h4>
                        <button
                            className='button pill secondary'
                            onClick={copyNote}
                        >
                            Copy HPI
                        </button>
                    </div>
                    <p id='copy-notes'>
                        {hpiAppointMentDetails ? (
                            formatHPIText(hpiAppointMentDetails.hpi_text)
                        ) : (
                            <Loader />
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
