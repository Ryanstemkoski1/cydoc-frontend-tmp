import style from './AppointmentTemplates.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@components/Icon';
import {
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import {
    AppointmentValueType,
    TaskType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import AppointmentTempStep from './AppointmentTemplateStep';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import { toast } from 'react-toastify';
import ToastOptions from '@constants/ToastOptions';
import { AppointmentTemplate } from '@cydoc-ai/types';
import {
    ApiResponse,
    AppointmentTemplatePostBody,
} from '@cydoc-ai/types/dist/api';
import {
    postInstitutionAppointmentTemplate,
    updateInstitutionAppointmentTemplate,
} from '@modules/institution-api';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';

interface CreateNewModalProps {
    open: boolean;
    handleClose: () => void;
    editAppointmentTempIndex: number | undefined;
    appointmentTempData: AppointmentTemplate[];
    setAppointmentTempData: (data: AppointmentTemplate[]) => void;
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
    const [allDiseaseForms, setAllDiseaseForms] = useState<DiseaseForm[]>([]);
    const { cognitoUser } = useAuth();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);

    const mode = editAppointmentTempIndex === undefined ? 'create' : 'edit';

    const loadAllDiseaseForms = useCallback(async () => {
        try {
            const response = await knowledgeGraphAPI;
            const diseaseForms = Object.entries(response.data.parentNodes).map(
                ([key, value]) =>
                    ({
                        id: '',
                        diseaseKey: Object.keys(value as object)?.[0],
                        diseaseName: key,
                        isDeleted: false,
                    }) as DiseaseForm
            );

            setAllDiseaseForms(diseaseForms);
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
        }
    }, []);

    useEffect(() => {
        loadAllDiseaseForms();
    }, [loadAllDiseaseForms]);

    useEffect(() => {
        if (editAppointmentTempIndex !== undefined) {
            const editTempData =
                appointmentTempData[editAppointmentTempIndex - 1];
            setTitle(editTempData?.templateTitle);
            setSelectedApptValue(
                (editTempData?.steps || []).map((item) => {
                    const form = allDiseaseForms.find(
                        (form) =>
                            form.diseaseKey === item.formCategory ||
                            form.diseaseName === item.formCategory
                    );
                    return {
                        whoCompletes: item.completedBy,
                        form: form?.diseaseName || form?.diseaseKey || null,
                    };
                })
            );
            setStepCount(editTempData?.steps?.length || 0);
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
        index: number,
        newValue: string,
        type: 'whoCompletes' | 'form'
    ) => {
        setSelectedApptValue((prevState) => {
            const newState: AppointmentValueType[] = [...prevState];
            newState[index] = {
                ...newState[index],
                [type]: newValue,
            };
            return newState;
        });
    };

    const createPayload = () => {
        const newTemplateBody: AppointmentTemplatePostBody = {
            templateTitle: title || 'Undefined Title',
            steps: selectedApptValue.map((item, index) => {
                const form = allDiseaseForms.find(
                    (form) =>
                        form.diseaseName === item.form ||
                        form.diseaseKey === item.form
                );
                const completedBy = item.whoCompletes || WhoCompletes.Clinician; // default
                return {
                    completedBy: completedBy,
                    formCategory: form?.diseaseKey || '',
                    stepOrder: index + 1,
                    required: false, // Default is false?
                    taskType:
                        completedBy === WhoCompletes.Cydoc_ai
                            ? TaskType.Synthesize_All_forms_into_Report
                            : TaskType.Smart_Form,
                };
            }),
        };
        return newTemplateBody;
    };

    const handleApptTemplateCreate = async () => {
        if (editAppointmentTempIndex !== undefined || !cognitoUser || !user) {
            return;
        }
        setLoading(true);
        const payload = createPayload();
        try {
            const respone = await postInstitutionAppointmentTemplate(
                payload,
                user.institutionId,
                cognitoUser
            );
            if ((respone as ApiResponse).errorMessage) {
                toast.error(
                    (respone as ApiResponse).errorMessage,
                    ToastOptions.error
                );
            }
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
        }

        setTitle('');
        setStepCount(1);
        setSelectedApptValue([{ whoCompletes: null, form: null }]);
        setLoading(false);
        handleClose();
    };

    const handleApptTemplateEdit = async () => {
        if (editAppointmentTempIndex === undefined || !user || !cognitoUser) {
            return;
        }

        setLoading(true);
        const payload = createPayload();
        const editingTemplate =
            appointmentTempData[editAppointmentTempIndex - 1];
        try {
            const respone = await updateInstitutionAppointmentTemplate(
                payload,
                user.institutionId,
                editingTemplate.id,
                cognitoUser
            );
            if ((respone as ApiResponse).errorMessage) {
                toast.error(
                    (respone as ApiResponse).errorMessage,
                    ToastOptions.error
                );
            }
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
        }

        setTitle('');
        setStepCount(1);
        setSelectedApptValue([{ whoCompletes: null, form: null }]);
        setLoading(false);
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
                        {mode === 'create' ? 'Create New' : 'Edit'} Template
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
                                allDiseaseForms={allDiseaseForms}
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
                            onClick={handleApptTemplateCreate}
                            disabled={loading || mode === 'edit'}
                            sx={{
                                color: 'white',
                                bgcolor: '#047A9B',

                                '&:hover': {
                                    bgcolor: '#047A9B',
                                },
                            }}
                        >
                            <span>Create template</span>
                        </Button>
                        <Button
                            variant='contained'
                            onClick={handleApptTemplateEdit}
                            disabled={loading || mode === 'create'}
                            sx={{
                                color: 'white',
                                bgcolor: '#047A9B',

                                '&:hover': {
                                    bgcolor: '#047A9B',
                                },
                            }}
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
