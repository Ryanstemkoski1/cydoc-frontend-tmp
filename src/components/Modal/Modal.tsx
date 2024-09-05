import {
    AppointmentUser,
    formatFullName,
} from '@screens/BrowseNotes/BrowseNotes';
import HpiNote from '@screens/EditNote/content/generatenote/notesections/HPINote';
import { MouseEvent, default as React, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import style from './Modal.module.scss';
import { Switch } from '@mui/material';

export interface ModalProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    selectedAppointment: AppointmentUser;
}

const Modal = ({
    showModal,
    setShowModal,
    selectedAppointment,
}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isParagraphFormat, setIsParagraphFormat] = React.useState(false);

    const handleClickOutsideModal = (event: MouseEvent<HTMLDivElement>) => {
        if (!modalRef.current?.contains(event.target as HTMLDivElement)) {
            setShowModal(false);
        }
    };

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

    const toggleFormat = () => {
        setIsParagraphFormat(!isParagraphFormat);
    };

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('isHidden');
        }
        return () => {
            document.body.classList.remove('isHidden');
        };
    }, [showModal]);

    const { patient, notes } = selectedAppointment;
    const { firstName, middleName, lastName } = patient;
    const hpiText =
        notes[0]?.hpi !== undefined
            ? JSON.parse(notes[0].hpi).hpi_text
            : undefined;

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
                        {formatFullName(firstName, middleName ?? '', lastName)}
                    </h3>
                </div>
                <div className={style.modal__innerContent}>
                    <div className='flex align-center justify-between'>
                        <h4>History of Present Illness/Subjective</h4>
                        <div>
                            <button
                                className='button pill secondary'
                                onClick={copyNote}
                            >
                                Copy Note
                            </button>
                            <label className='flex align-center justify-between'>
                                <Switch
                                    checked={isParagraphFormat}
                                    onChange={toggleFormat}
                                    name='paragraph format'
                                />
                                <span>Paragraph</span>
                            </label>
                        </div>
                    </div>
                    <div
                        className={`${style.modal__scroll} scrollbar`}
                        id='copy-notes'
                    >
                        {hpiText !== undefined &&
                            !hpiText.includes('No history') && (
                                <HpiNote
                                    text={JSON.parse(hpiText)}
                                    isParagraphFormat={isParagraphFormat}
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
