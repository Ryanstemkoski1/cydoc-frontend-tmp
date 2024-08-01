import style from './AppointmentTemplates.module.scss';
import React, { useEffect, useState } from 'react';
import { Icon } from '@components/Icon';
import {
    Box,
    Button,
    IconButton,
    Modal,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import {
    AppointmentTemplateType,
    AppointmentValueType,
    TaskType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import AppointmentTempStep from './AppointmentTemplateStep';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface CreateNewModalProps {
    open: boolean;
    handleClose: () => void;
    editAppointmentTempIndex: number | undefined;
    appointmentTempData: AppointmentTemplateType[];
    setAppointmentTempData: (data: AppointmentTemplateType[]) => void;
}

const CreateNewModal = ({
    open,
    handleClose,
    appointmentTempData,
    setAppointmentTempData,
    editAppointmentTempIndex,
}: CreateNewModalProps) => {
    const [stepCount, setStepCount] = useState<number>(1);
    const [title, setTitle] = useState<string | null>('');
    const [selectedApptValue, setSelectedApptValue] = React.useState<
        AppointmentValueType[]
    >([{ whoCompletes: null, form: null }]);

    useEffect(() => {
        if (editAppointmentTempIndex !== undefined) {
            const editTempData =
                appointmentTempData[editAppointmentTempIndex - 1];
            setTitle(editTempData.header);
            setSelectedApptValue(editTempData.body);
            setStepCount(editTempData.body.length);
        }
    }, [appointmentTempData, editAppointmentTempIndex]);

    const stepTaskType = (idx: number) => {
        if (
            !selectedApptValue.length ||
            selectedApptValue[idx].whoCompletes === null
        ) {
            return '';
        }

        return selectedApptValue[idx].whoCompletes === WhoCompletes.Cydoc_ai
            ? TaskType.Synthesize_All_forms_into_Report
            : TaskType.Smart_Form;
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleRemoveSteps = (idx: number) => {
        if (stepCount === 1 || !selectedApptValue?.length) {
            return;
        }
        const apptValuesTemp = [...selectedApptValue];
        apptValuesTemp.splice(idx, 1);

        setStepCount(stepCount - 1);
        setSelectedApptValue(apptValuesTemp);
    };

    const handleAppointmentValues = (
        event: SelectChangeEvent<string | null>,
        index: number,
        type: 'whoCompletes' | 'form'
    ) => {
        setSelectedApptValue((prevState) => {
            const newState: AppointmentValueType[] = [...prevState];
            newState[index] = {
                ...newState[index],
                [type]: event.target.value,
            };
            return newState;
        });
    };

    const handleApptTemplateCreate = () => {
        if (editAppointmentTempIndex !== undefined) {
            return;
        }

        const newAppointmentTempData = [
            ...appointmentTempData,
            {
                header: title || 'Undefined Title',
                body: selectedApptValue,
            },
        ];

        setAppointmentTempData(newAppointmentTempData);

        setTitle('');
        setStepCount(1);
        setSelectedApptValue([{ whoCompletes: null, form: null }]);
        handleClose();
    };

    const handleApptTemplateEdit = () => {
        if (editAppointmentTempIndex === undefined) {
            return;
        }

        const newAppointmentTempData = [...appointmentTempData];
        newAppointmentTempData[editAppointmentTempIndex - 1] = {
            header: title || 'Undefined Title',
            body: selectedApptValue,
        };

        setAppointmentTempData(newAppointmentTempData);

        setTitle('');
        setStepCount(1);
        setSelectedApptValue([{ whoCompletes: null, form: null }]);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='createNew-modal-title'
            aria-describedby='createNew-modal-description'
        >
            <Box className={style.createNewModalWrapper}>
                <Box className={style.createNewModalWrapper__header}>
                    <Typography component='p'>
                        Create an appointment template
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>
                <Box className={style.createNewModalWrapper__body}>
                    <Box
                        className={style.createNewModalWrapper__body__titleBox}
                    >
                        <Typography component='label' htmlFor='new-temp-title'>
                            Template title
                        </Typography>
                        <TextField
                            id='new-temp-title'
                            variant='outlined'
                            placeholder='Enter'
                            value={title}
                            onChange={handleTitleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#0000003B',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#047A9B',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#047A9B',
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box
                        className={
                            style.createNewModalWrapper__body__stepsWrapper
                        }
                    >
                        {Array.from({ length: stepCount }).map((_, idx) => (
                            <AppointmentTempStep
                                key={idx}
                                idx={idx}
                                stepCount={stepCount}
                                stepTaskType={stepTaskType}
                                selectedApptValue={selectedApptValue}
                                handleApptValues={handleAppointmentValues}
                                handleRemoveSteps={handleRemoveSteps}
                            />
                        ))}
                        <Box
                            className={
                                style.createNewModalWrapper__body__addNewStep
                            }
                            onClick={() => setStepCount(stepCount + 1)}
                        >
                            <Icon type='plusIcon' />
                            <Typography component='p'>Add step</Typography>
                        </Box>
                    </Box>
                    <Box className={style.createNewModalWrapper__btn}>
                        <Button
                            variant='contained'
                            className={style.createNewModalWrapper__btn__create}
                            onClick={handleApptTemplateCreate}
                        >
                            <span>Create template</span>
                        </Button>
                        <Button
                            variant='contained'
                            className={style.createNewModalWrapper__btn__save}
                            onClick={handleApptTemplateEdit}
                        >
                            <span>Save</span>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateNewModal;
