import { ApiResponse } from '@cydoc-ai/types';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import InfoTooltip from 'components/InfoTooltip/InfoTooltip';
import MultiSelectDropdown from 'components/Input/MultiSelectDropdown';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { MAX_LIMIT_TO_ADD_DEFAULT_FORMS } from 'constants/FormPreferencesConstant';
import ToastOptions from 'constants/ToastOptions';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import {
    InstitutionConfigResponse,
    getInstitutionConfig,
    updateInstitutionConfig,
} from 'modules/institution-api';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
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

    /* states */
    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>(defaultInstitutionConfig);
    const [allDiseaseForms, setAllDiseaseForms] = useState<DiseaseForm[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
                    } as DiseaseForm)
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

            toast.success('Updated Successfully', ToastOptions.success);
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
            showChiefComplaints == false
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
    ]);

    return (
        <div className={style.formPreferences}>
            <CommonLayout title='Please select your questionnaire preferences'>
                {(errorMessage || notificationMessage) && (
                    <Notification
                        message={errorMessage || notificationMessage}
                        type={NotificationTypeEnum.ERROR}
                    />
                )}
                {loadingData ? (
                    <div className='ui active centered inline loader' />
                ) : (
                    <>
                        <div className={style.formPreferences__item}>
                            <label htmlFor='showDefaultForm'>
                                Show default forms
                                <InfoTooltip mobilePositionY={'bottom'}>
                                    <p>
                                        When &ldquo;Show default forms&rdquo; is
                                        &ldquo;Yes,&rdquo; then every patient in
                                        your practice will be shown form(s) that
                                        you specify. For example, if Cydoc has
                                        created a custom form for your practice,
                                        you may choose &ldquo;Yes&rdquo; here in
                                        order to specify that you want all your
                                        patients to be shown your
                                        practice&apos;s custom form.
                                    </p>
                                </InfoTooltip>
                            </label>
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
                                <label>
                                    Default form names:
                                    <InfoTooltip>
                                        <p>
                                            Select the default forms you would
                                            like to show to every patient. The
                                            default forms will be shown to
                                            patients in the order that they are
                                            selected.
                                        </p>
                                    </InfoTooltip>
                                </label>
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
                            </div>
                        )}

                        <div className={style.formPreferences__item}>
                            <label htmlFor='showChiefComplaints'>
                                Enable HPI/Subjective section generation
                                <InfoTooltip mobilePositionX={-80}>
                                    <p>
                                        When &ldquo;Enable HPI/Subjective
                                        section generation&rdquo; is
                                        &ldquo;Yes&rdquo;, then Cydoc will
                                        automatically interview each patient
                                        using medical reasoning to generate an
                                        HPI/Subjective section based on that
                                        patient&apos;s unique chief complaints.
                                    </p>
                                </InfoTooltip>
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
                                (showDefaultForm &&
                                    !nonDeletedDiseaseForm.length) ||
                                loading
                            }
                        >
                            Update Preferences
                            {loading && <ButtonLoader />}
                        </button>
                    </>
                )}
            </CommonLayout>
        </div>
    );
};

export default FormPreferencesPage;
