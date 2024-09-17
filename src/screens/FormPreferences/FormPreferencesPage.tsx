'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import style from './FormPreferencesPage.module.scss';

import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { ApiResponse } from '@cydoc-ai/types';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import Notification, {
    NotificationTypeEnum,
} from '@components/tools/Notification/Notification';

import {
    Box,
    Button,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Switch,
    Typography,
} from '@mui/material';

import {
    InstitutionConfigResponse,
    getInstitutionConfig,
    updateInstitutionConfig,
} from 'modules/institution-api';

import {
    CustomRadioLabelProps,
    CustomSwitchProps,
    DefaultFormSwitchLabels,
    DefaultFormType,
    MAX_LIMIT_TO_ADD_DEFAULT_FORMS,
    ProductRadioLabels,
    ProductType,
} from '@constants/FormPreferencesConstant';

import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import InfoIcon from '@mui/icons-material/Info';
import ToastOptions from '@constants/ToastOptions';
import ButtonLoader from '@components/ButtonLoader/ButtonLoader';
import MultiSelectDropdown from '@components/Input/MultiSelectDropdown';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import useManagerRequired from '@hooks/useManagerRequired';
import { setProductDefinitionAction } from '@redux/actions/productDefinitionAction';

const defaultInstitutionConfig: InstitutionConfig = {
    diseaseForm: [],
    id: '-1',
    name: '',
    product: ProductType.SMART_PATIENT_INTAKE_FORM,
    institutionId: '-1',
    showDefaultForm: false,
    showChiefComplaints: false,
};

const CustomRadioLabel = ({
    labelProps,
}: {
    labelProps: CustomRadioLabelProps;
}) => (
    <Box className={style.productWrapper__labelContent}>
        <Typography className={style.productWrapper__labelContent__title}>
            {labelProps.title}
        </Typography>
        <Typography className={style.productWrapper__labelContent__detail}>
            {labelProps.detail}
        </Typography>
    </Box>
);

const CustomSwitchLabel = ({
    labelProps,
}: {
    labelProps: CustomSwitchProps;
}) => {
    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip
            {...props}
            classes={{ popper: className }}
            className={style.tooltip}
            arrow
        />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            padding: '8px',
            color: 'rgba(0, 0, 0, .87)',
            boxShadow: '0 0 4px 0px rgba(0, 0, 0, 0.2)',
            backgroundColor: theme.palette.common.white,
            fontSize: 10,
            fontFamily: 'Nunito',
            fontWeight: '500',
            lineHeight: '14px',
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: 'white',
            '&::before': {
                boxShadow: '0 0 4px 0px rgba(0, 0, 0, 0.2)',
            },
        },
    }));

    return (
        <Box className={style.productWrapper__switchLabel}>
            <Typography className={style.productWrapper__switchLabel__title}>
                {labelProps.label}
            </Typography>
            <LightTooltip title={labelProps.tooltipTitle} placement='top'>
                <InfoIcon />
            </LightTooltip>
        </Box>
    );
};

const FormPreferencesPage = () => {
    useManagerRequired(); // this route is private, manager required
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const dispatch = useDispatch();

    /* states */
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [allDiseaseForms, setAllDiseaseForms] = useState<DiseaseForm[]>([]);
    const [productType, setProductType] = useState<string>(
        ProductType.SMART_PATIENT_INTAKE_FORM
    );
    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>(defaultInstitutionConfig);

    const dropdownItems = useMemo(() => {
        if (!institutionConfig || !allDiseaseForms) return [];
        const diseaseForm = institutionConfig.diseaseForm.filter(
            (item) => !item.isDeleted
        );
        return allDiseaseForms.filter(
            (item) =>
                diseaseForm.find(
                    ({ diseaseKey, diseaseName }) =>
                        diseaseName === item.diseaseName &&
                        diseaseKey === item.diseaseKey
                ) === undefined
        );
    }, [institutionConfig, allDiseaseForms]);

    const { diseaseForm, showChiefComplaints, showDefaultForm } =
        institutionConfig;

    const nonDeletedDiseaseForm = useMemo(
        () => institutionConfig.diseaseForm.filter((item) => !item.isDeleted),
        [institutionConfig]
    );

    /* functions */
    const updateInstitutionConfigState = useCallback(
        (key: string, value: boolean | number | string | DiseaseForm[]) => {
            setInstitutionConfig({ ...institutionConfig, [key]: value });
        },
        [institutionConfig]
    );

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

    const loadInstitutionConfig = useCallback(async (institutionId: string) => {
        const response = await getInstitutionConfig(institutionId);

        if ((response as ApiResponse).errorMessage) {
            toast.error('Something went wrong.', ToastOptions.error);
            return;
        }
        const newInstitutionConfig = (response as InstitutionConfigResponse)
            .config;
        setInstitutionConfig(newInstitutionConfig);
        // depends on the product type, we will set the product definition file on action
        if (newInstitutionConfig.product) {
            localStorage.setItem('productType', newInstitutionConfig.product);
            dispatch(setProductDefinitionAction(newInstitutionConfig.product));
        }
    }, []);

    const onMount = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingData(true);
            await Promise.all([
                loadInstitutionConfig(user.institutionId),
                loadAllDiseaseForms(),
            ]);
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
        } finally {
            setLoadingData(false);
        }
    }, [loadAllDiseaseForms, loadInstitutionConfig, user]);

    const handleSubmit = async () => {
        if (!user) return null;
        try {
            setLoading(true);

            const { showDefaultForm, diseaseForm, institutionId } =
                institutionConfig;
            let newDiseaseForm = diseaseForm;
            let response: InstitutionConfigResponse | ApiResponse = {};

            if (!showDefaultForm && diseaseForm.length) {
                newDiseaseForm = JSON.parse(JSON.stringify(diseaseForm));
                newDiseaseForm.forEach((form) => (form.isDeleted = true));
            }

            response = await getInstitutionConfig(institutionId);
            if ((response as ApiResponse).errorMessage) {
                throw new Error();
            }

            const institutionConfigOnServer = (
                response as InstitutionConfigResponse
            ).config;

            for (const form of institutionConfigOnServer.diseaseForm) {
                if (newDiseaseForm.find((item) => item.id === form.id)) {
                    continue;
                }
                form.isDeleted = true;
                newDiseaseForm.push(form);
            }

            const updatedInstitutionConfig = {
                ...institutionConfig,
                diseaseForm: newDiseaseForm,
            };

            const updateResponse = await updateInstitutionConfig(
                updatedInstitutionConfig,
                productType,
                cognitoUser
            );

            if (
                (updateResponse as ApiResponse).errorMessage ||
                (updateResponse as { status: string }).status !== 'success'
            ) {
                throw new Error();
            }
            toast.success('Updated Successfully', ToastOptions.success);
            await loadInstitutionConfig(user.institutionId);
        } catch (error: unknown) {
            toast.error('Failed', ToastOptions.error);
        } finally {
            setLoading(false);
        }
    };

    const handleOnRemove = (name: string) => {
        const newDiseaseForm: DiseaseForm[] = [];
        diseaseForm.forEach((item) => {
            if (item.diseaseName !== name) {
                newDiseaseForm.push(item);
                return;
            }
            if (!item.id) return;
            item.isDeleted = true;
            newDiseaseForm.push(item);
        });
        updateInstitutionConfigState('diseaseForm', newDiseaseForm);
    };

    const handleOnSelected = (name: string) => {
        const selectedDiseaseForm = allDiseaseForms.find(
            (item) => item.diseaseName === name
        ) as DiseaseForm;

        const newDiseaseForm = [...diseaseForm, selectedDiseaseForm];

        if (
            newDiseaseForm.filter((item) => !item.isDeleted).length >
            MAX_LIMIT_TO_ADD_DEFAULT_FORMS
        ) {
            setNotificationMessage(
                `Can't add more than ${MAX_LIMIT_TO_ADD_DEFAULT_FORMS} default forms`
            );
            window.scrollTo(0, 0);
            return;
        }

        updateInstitutionConfigState('diseaseForm', newDiseaseForm);
    };

    const handleProductTypeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProductType(e.target.value);
    };

    const handleDefaultFormChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        switch (e.target.value) {
            case DefaultFormType.SHOW_DEFAULT_FORMS:
                updateInstitutionConfigState(
                    'showDefaultForm',
                    !showDefaultForm
                );
                break;
            case DefaultFormType.ENABLE_HPI_SUBJECTIVE_SECTION_GENERATION:
                updateInstitutionConfigState(
                    'showChiefComplaints',
                    !showChiefComplaints
                );
                break;
            default:
                return;
        }
    };

    /* effects */
    useEffect(() => {
        if (!notificationMessage) return;

        const timeoutId = setTimeout(() => {
            setNotificationMessage('');
        }, 3000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [notificationMessage]);

    useEffect(() => {
        onMount();
    }, [onMount]);

    useEffect(() => {
        if (
            loadingData === false &&
            showDefaultForm == false &&
            showChiefComplaints == false &&
            productType === ProductType.SMART_PATIENT_INTAKE_FORM
        ) {
            setErrorMessage(`You must select "Yes" for at least one option`);
        } else {
            setErrorMessage('');
        }
    }, [
        showDefaultForm,
        showChiefComplaints,
        setNotificationMessage,
        loadingData,
        productType,
    ]);

    useEffect(() => {
        const productName = localStorage.getItem('productType');

        if (productName) {
            setProductType(productName);
        }
    }, []);

    const disableWhenSmartPatientIntakeForm =
        (!showChiefComplaints && !showDefaultForm) ||
        (showDefaultForm && !nonDeletedDiseaseForm.length);

    const disableWhenAdvancedReportGeneration =
        disableWhenSmartPatientIntakeForm &&
        productType === ProductType.SMART_PATIENT_INTAKE_FORM;

    const submitStyle = {
        padding: '8px 22px',
        backgroundColor: '#047A9B',
        color: 'white',
        fontSize: '16px',
        fontFamily: 'Nunito',
        fontWeight: '500',
        lineHeight: '26px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: '10px',
        textTransform: 'none',

        '&:hover': {
            backgroundColor: '#0684a8',
        },

        '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
        },
    };

    return (
        <Box className={style.formPreferences}>
            <Box className={style.formPreferences__head}>
                <Typography component={'p'}>Select a product</Typography>
            </Box>
            {(errorMessage || notificationMessage) && (
                <Notification
                    message={errorMessage || notificationMessage}
                    type={NotificationTypeEnum.ERROR}
                />
            )}
            <Box className={style.formPreferences__content}>
                <RadioGroup
                    value={productType}
                    onChange={handleProductTypeChange}
                    sx={{ gap: 2 }}
                >
                    <Box className={style.productWrapper}>
                        <FormControlLabel
                            value={ProductType.SMART_PATIENT_INTAKE_FORM}
                            control={<Radio />}
                            label={
                                <CustomRadioLabel
                                    labelProps={
                                        ProductRadioLabels[
                                            ProductType
                                                .SMART_PATIENT_INTAKE_FORM
                                        ]
                                    }
                                />
                            }
                        />

                        {productType ===
                            ProductType.SMART_PATIENT_INTAKE_FORM && (
                            <FormGroup
                                className={style.productWrapper__switch}
                                onChange={handleDefaultFormChange}
                                sx={{ gap: 2 }}
                            >
                                <FormControlLabel
                                    value={DefaultFormType.SHOW_DEFAULT_FORMS}
                                    control={
                                        <Switch checked={showDefaultForm} />
                                    }
                                    label={
                                        <CustomSwitchLabel
                                            labelProps={
                                                DefaultFormSwitchLabels[
                                                    DefaultFormType
                                                        .SHOW_DEFAULT_FORMS
                                                ]
                                            }
                                        />
                                    }
                                />

                                {showDefaultForm && (
                                    <Box
                                        className={style.formPreferences__item}
                                    >
                                        <Typography
                                            className={
                                                style.formPreferences__item__label
                                            }
                                        >
                                            Default form names:
                                        </Typography>

                                        <MultiSelectDropdown
                                            dropdownItems={dropdownItems
                                                .map((item) => item.diseaseName)
                                                .sort()}
                                            selectedDropdownItems={nonDeletedDiseaseForm.map(
                                                (item) => item.diseaseName
                                            )}
                                            onRemove={handleOnRemove}
                                            onSelected={handleOnSelected}
                                        />

                                        <Typography
                                            className={
                                                style.formPreferences__item__info
                                            }
                                        >
                                            Select the default forms you would
                                            like to show to every patient. The
                                            default forms will be shown to
                                            patients in the order that they are
                                            selected.
                                        </Typography>
                                    </Box>
                                )}

                                <FormControlLabel
                                    value={
                                        DefaultFormType.ENABLE_HPI_SUBJECTIVE_SECTION_GENERATION
                                    }
                                    control={
                                        <Switch checked={showChiefComplaints} />
                                    }
                                    label={
                                        <CustomSwitchLabel
                                            labelProps={
                                                DefaultFormSwitchLabels[
                                                    DefaultFormType
                                                        .ENABLE_HPI_SUBJECTIVE_SECTION_GENERATION
                                                ]
                                            }
                                        />
                                    }
                                />
                            </FormGroup>
                        )}
                    </Box>

                    <Box className={style.productWrapper}>
                        <FormControlLabel
                            value={ProductType.ADVANCED_REPORT_GENERATION}
                            control={<Radio />}
                            label={
                                <CustomRadioLabel
                                    labelProps={
                                        ProductRadioLabels[
                                            ProductType
                                                .ADVANCED_REPORT_GENERATION
                                        ]
                                    }
                                />
                            }
                        />
                    </Box>
                </RadioGroup>

                <Button
                    sx={submitStyle}
                    type='submit'
                    className={style.formPreferences__submit}
                    onClick={handleSubmit}
                    disabled={
                        (disableWhenSmartPatientIntakeForm &&
                            disableWhenAdvancedReportGeneration) ||
                        loading
                    }
                >
                    Update settings
                    {loading && <ButtonLoader />}
                </Button>
            </Box>
        </Box>
    );
};

export default FormPreferencesPage;
