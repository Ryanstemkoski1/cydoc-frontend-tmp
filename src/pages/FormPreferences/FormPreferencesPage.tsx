import { ApiResponse } from '@cydoc-ai/types';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import MultiSelectDropdown from 'components/Input/MultiSelectDropdown';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { MAX_LIMIT_TO_ADD_DEFAULT_FORMS } from 'constants/FormPreferencesConstant';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import {
    InstitutionConfigResponse,
    getInstitutionConfig,
    updateInstitutionConfig,
} from 'modules/institution-api';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import style from './FormPreferencesPage.module.scss';

const defaultInstitutionConfig: InstitutionConfig = {
    diseaseForm: [],
    id: -1,
    institutionId: '-1',
    showDefaultForm: false,
    showChiefComplaints: false,
};

const FormPreferencesPage = () => {
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const dispatch = useDispatch();

    /* states */
    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>(defaultInstitutionConfig);
    const [allDiseaseForms, setAllDiseaseForms] = useState<DiseaseForm[]>([]);
    const [loading, setLoading] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
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
        dispatch(setLoadingStatus(true));

        const response = await knowledgeGraphAPI;
        const diseaseForms = Object.entries(response.data.parentNodes).map(
            ([key, value]) =>
                ({
                    id: '',
                    diseaseKey: Object.keys(value as object)?.[0],
                    diseaseName: key,
                    isDeleted: false,
                } as DiseaseForm)
        );

        setAllDiseaseForms(diseaseForms);
        dispatch(setLoadingStatus(false));
    }, [dispatch]);

    const loadInstitutionConfig = useCallback(
        async (institutionId: string) => {
            dispatch(setLoadingStatus(true));
            try {
                const response = await getInstitutionConfig(institutionId);

                if ((response as ApiResponse).errorMessage) {
                    return;
                }
                const newInstitutionConfig = (
                    response as InstitutionConfigResponse
                ).config;
                setInstitutionConfig(newInstitutionConfig);
            } finally {
                dispatch(setLoadingStatus(false));
            }
        },
        [dispatch]
    );

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

            response = await updateInstitutionConfig(
                updatedInstitutionConfig,
                cognitoUser
            );

            if ((response as ApiResponse).errorMessage) {
                throw new Error();
            }

            setInstitutionConfig(
                (response as InstitutionConfigResponse).config
            );

            toast.success('Updated Successfully', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
            });
        } catch (error: unknown) {
            toast.error('Failed', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                pauseOnHover: false,
            });
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
            setNotificationType(NotificationTypeEnum.ERROR);
            window.scrollTo(0, 0);
            return;
        }

        updateInstitutionConfigState('diseaseForm', newDiseaseForm);
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
        if (!user) return;
        loadInstitutionConfig(user.institutionId);
    }, [loadInstitutionConfig, user]);

    useEffect(() => {
        loadAllDiseaseForms();
    }, [loadAllDiseaseForms]);

    return (
        <div className={style.formPreferences}>
            <CommonLayout title='Please select your questionnaire preferences'>
                {notificationMessage && (
                    <Notification
                        message={notificationMessage}
                        type={notificationType}
                    />
                )}

                <div className={style.formPreferences__item}>
                    <label htmlFor='showDefaultForm'>Show default forms</label>
                    <YesAndNo
                        yesButtonActive={showDefaultForm}
                        noButtonActive={!showDefaultForm}
                        handleYesButtonClick={() =>
                            updateInstitutionConfigState(
                                'showDefaultForm',
                                true
                            )
                        }
                        handleNoButtonClick={() =>
                            updateInstitutionConfigState(
                                'showDefaultForm',
                                false
                            )
                        }
                    />
                </div>

                {showDefaultForm && (
                    <div className={style.formPreferences__item}>
                        <label>Default form names:</label>
                        <MultiSelectDropdown
                            dropdownItems={dropdownItems.map(
                                (item) => item.diseaseName
                            )}
                            selectedDropdownItems={nonDeletedDiseaseForm.map(
                                (item) => item.diseaseName
                            )}
                            onRemove={handleOnRemove}
                            onSelected={handleOnSelected}
                        />
                    </div>
                )}

                <div className={style.formPreferences__item}>
                    <label htmlFor='showChiefComplaints'>
                        Let patients choose chief complaints
                    </label>
                    <YesAndNo
                        yesButtonActive={showChiefComplaints}
                        noButtonActive={!showChiefComplaints}
                        handleYesButtonClick={() =>
                            updateInstitutionConfigState(
                                'showChiefComplaints',
                                true
                            )
                        }
                        handleNoButtonClick={() =>
                            updateInstitutionConfigState(
                                'showChiefComplaints',
                                false
                            )
                        }
                    />
                </div>
                <button
                    type='submit'
                    className='button'
                    onClick={handleSubmit}
                    disabled={
                        (!showChiefComplaints && !showDefaultForm) ||
                        (showDefaultForm && !nonDeletedDiseaseForm.length) ||
                        loading
                    }
                >
                    Update Preferences
                    {loading && <ButtonLoader />}
                </button>
            </CommonLayout>
        </div>
    );
};

export default FormPreferencesPage;
