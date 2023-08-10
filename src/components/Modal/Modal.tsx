import HPINote from 'pages/EditNote/content/generatenote/notesections/HPINote';
import React, { useRef } from 'react';
import style from './Modal.module.scss';

export interface ModalProps {
    showModal: boolean;
    setShowModal: any;
    username: string;
}

const Modal = ({ showModal, setShowModal, username }: ModalProps) => {
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
                    <h3>{username}</h3>
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
                        <HPINote />
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Modal;
