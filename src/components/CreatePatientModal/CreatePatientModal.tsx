import { MouseEvent, default as React, useEffect, useRef } from 'react';
import style from './CreatePatientModal.module.scss';
import Input from '@components/Input/Input';
import { Button } from '@mui/material';
import Dropdown from '@components/Input/Dropdown';

export interface CreatePatientModalProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}

const CreatePatientModal = ({
    showModal,
    setShowModal,
}: CreatePatientModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [patientDetails, setPatientDetails] = React.useState({
        legalFirstName: '',
        legalLastName: '',
        legalMiddleName: '',
        dateOfBirth: '',
    });
    const dropdownItems = ['type 1', 'type 2', 'type 3'];

    const handleClickOutsideModal = (event: MouseEvent<HTMLDivElement>) => {
        if (!modalRef.current?.contains(event.target as HTMLDivElement)) {
            setShowModal(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatientDetails({
            ...patientDetails,
            [name]: value,
        });
    };

    const handleTodayClick = () => {

    }

    const onSelected = () => {

    }

    return (
        <div
            onClick={handleClickOutsideModal}
            className={`${style.modal} flex-wrap align-center justify-center ${!showModal ? style.modalClose : ''
                }`}
        >
            <div className={style.modal__inner} ref={modalRef}>
                <div className={style.modal__header}>
                    <h3>
                        Create patient
                    </h3>
                </div>
                <div className={style.modal__innerContent}>
                    <form className={`${style.modal__innerContent__form} flex-wrap`}>
                        <h4>Patient Info</h4>
                        <Input
                            label='Legal First Name'
                            required={true}
                            aria-label='First-Name'
                            name='legalFirstName'
                            placeholder='Legal First Name'
                            onChange={handleChange}
                        />
                        <Input
                            aria-label='middle-Name'
                            label='Legal Middle Name'
                            name='legalMiddleName'
                            placeholder='Legal Middle Name'
                            onChange={handleChange}
                        />
                        <Input
                            required={true}
                            aria-label='last-Name'
                            label='Legal Last Name'
                            name='legalLastName'
                            placeholder='Legal Last Name'
                            onChange={handleChange}
                        />
                        <Input
                            required={true}
                            type='date'
                            label='Date of Birth'
                            name='dateOfBirth'
                            placeholder='mm/dd/yyyy'
                            max={new Date().toJSON().slice(0, 10)}
                            onChange={handleChange}
                        />
                        <h4>Appointment info</h4>
                        <div className={style.modal__innerContent__form__date}>
                            <Input
                                type='date'
                                label='Appointment date'
                                name='dateOfAppointment'
                                placeholder='mm/dd/yyyy'
                                max={new Date().toJSON().slice(0, 10)}
                                onChange={handleChange}
                            />
                            <Button
                                className={style.modal__innerContent__form__date__today}
                                onClick={handleTodayClick}
                            >
                                Today
                            </Button>
                        </div>
                        <p>Appointment type</p>
                        <Dropdown
                            items={dropdownItems}
                            onChange={onSelected}
                            placeholder='Select'
                            canEnterNewValue={false}
                            resetValueAfterClick={true}
                        />
                        <Button
                            className={style.modal__innerContent__form__submit}
                        >Create patient</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePatientModal;
