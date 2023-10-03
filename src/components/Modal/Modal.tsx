import { AppointmentUser, formatFullName } from 'pages/BrowseNotes/BrowseNotes';
import { ParseAndRenderHpiNote } from 'pages/EditNote/content/generatenote/notesections/HPINote';
import { default as React, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import style from './Modal.module.scss';

export interface ModalProps {
    showModal: boolean;
    setShowModal: any;
    selectedAppointment: AppointmentUser;
}

const Modal = ({
    showModal,
    setShowModal,
    selectedAppointment,
}: ModalProps) => {
    const modalRef = useRef<any>();

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

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('isHidden');
        }
        return () => {
            document.body.classList.remove('isHidden');
        };
    }, [showModal]);

    const { firstName, middleName, lastName, hpiText } = selectedAppointment;

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
                        <button
                            className='button pill secondary'
                            onClick={copyNote}
                        >
                            Copy HPI
                        </button>
                    </div>
                    <div
                        className={`${style.modal__scroll} scrollbar`}
                        id='copy-notes'
                    >
                        <ParseAndRenderHpiNote hpiText={hpiText} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
