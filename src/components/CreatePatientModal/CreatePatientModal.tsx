import { MouseEvent, default as React, useEffect, useRef } from 'react';
import style from './CreatePatientModal.module.scss';
import Input from '@components/Input/Input';
import { Box, Button, Typography } from '@mui/material';
import Dropdown from '@components/Input/Dropdown';
import CloseIcon from '@mui/icons-material/Close';

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
        dateOfAppointment: '',
        typeOfAppointment: '',
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
        const todayDate = new Date().toISOString().split('T')[0];
        setPatientDetails({
            ...patientDetails,
            dateOfAppointment: todayDate,
        });
    };

    const onSelected = (value: string) => {
        setPatientDetails({
            ...patientDetails,
            typeOfAppointment: value,
        });
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    const onCreatePatient = () => {};

    return (
        <Box
            onClick={handleClickOutsideModal}
            className={`${style.modal} flex-wrap align-center justify-center ${
                !showModal ? style.modalClose : ''
            }`}
        >
            <Box className={style.modal__inner} ref={modalRef}>
                <Box className={style.modal__header}>
                    <Typography variant='h3'>Create patient</Typography>
                    <CloseIcon
                        style={{ cursor: 'pointer' }}
                        onClick={onCloseModal}
                    />
                </Box>
                <Box className={style.modal__innerContent}>
                    <form
                        className={`${style.modal__innerContent__form} flex-wrap`}
                    >
                        <Typography variant='h4'>Patient Info</Typography>
                        <Input
                            style={{ marginBottom: '10px' }}
                            label='Legal First Name'
                            required={true}
                            aria-label='First-Name'
                            name='legalFirstName'
                            placeholder='Legal First Name'
                            onChange={handleChange}
                        />
                        <Input
                            style={{ marginBottom: '10px' }}
                            aria-label='middle-Name'
                            label='Legal Middle Name'
                            name='legalMiddleName'
                            placeholder='Legal Middle Name'
                            onChange={handleChange}
                        />
                        <Input
                            style={{ marginBottom: '10px' }}
                            required={true}
                            aria-label='last-Name'
                            label='Legal Last Name'
                            name='legalLastName'
                            placeholder='Legal Last Name'
                            onChange={handleChange}
                        />
                        <Input
                            style={{ marginBottom: '10px' }}
                            id='dateOfBirth'
                            required={true}
                            type='date'
                            label='Date of Birth'
                            name='dateOfBirth'
                            placeholder='mm/dd/yyyy'
                            max={new Date().toJSON().slice(0, 10)}
                            onChange={handleChange}
                        />
                        <Typography variant='h4'>Appointment info</Typography>
                        <Box
                            sx={{ marginBottom: '10px' }}
                            className={style.modal__innerContent__form__date}
                        >
                            <Input
                                id='dateOfAppointment'
                                type='date'
                                label='Appointment date'
                                name='dateOfAppointment'
                                placeholder='mm/dd/yyyy'
                                max={new Date().toJSON().slice(0, 10)}
                                value={patientDetails.dateOfAppointment}
                                onChange={handleChange}
                            />
                            <Button
                                className={
                                    style.modal__innerContent__form__date__today
                                }
                                onClick={handleTodayClick}
                            >
                                Today
                            </Button>
                        </Box>
                        <Typography component={'p'}>
                            Appointment type
                        </Typography>
                        <Dropdown
                            items={dropdownItems}
                            value={patientDetails.typeOfAppointment}
                            onChange={onSelected}
                            placeholder='Select'
                            canEnterNewValue={false}
                            resetValueAfterClick={true}
                        />
                        <Button
                            sx={{ marginTop: '10px' }}
                            className={style.modal__innerContent__form__submit}
                            onClick={onCreatePatient}
                        >
                            Create patient
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default CreatePatientModal;
