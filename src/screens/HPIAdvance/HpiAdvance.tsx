'use client';

import { Appointment } from '@cydoc-ai/types';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import { Institution as InstitutionClass } from 'classes/institution.class';
import CommonLayout from '@components/CommonLayout/CommonLayout';
import Notification, {
    NotificationTypeEnum,
} from '@components/tools/Notification/Notification';
import useQuery from '@hooks/useQuery';
import useSelectedChiefComplaints from '@hooks/useSelectedChiefComplaints';
import { getInstitution } from 'modules/institution-api';
import { log } from 'modules/logging';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { setChiefComplaint } from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import { setLoadingStatus } from '@redux/actions/loadingStatusActions';
import { updateAdditionalSurveyDetails } from '@redux/actions/additionalSurveyActions';
import { initialSurveyAddDateOrPlace } from '@redux/actions/userViewActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import style from './HpiAdvance.module.scss';
import NewNotePage from './NotePageAdvance/NotePageAdvance';
import { selectHpiHeaders } from '@redux/reducers/hpiHeadersReducer';
import useSignInRequired from '@hooks/useSignInRequired';
import axios from 'axios';
import { graphClientURL } from '@constants/api';
import { getAppointmentDetail } from '@modules/appointment-api';
import useAuth from '@hooks/useAuth';
import { getFilledForm } from '@modules/filled-form-api';

export interface OnNextClickParams {
    allSelectedChiefComplaints?: string[];
    listTextChiefComplaints?: string[];
}

interface ScreenForPatientType {
    title: string;
    component: React.JSX.Element | null;
}

const HpiAdvance = () => {
    useSignInRequired(); // this route is private, sign in required

    const dispatch = useDispatch();
    const query = useQuery();
    const router = useRouter();
    const { cognitoUser } = useAuth();

    const institutionId =
        query?.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';
    const appointmentId = query?.get('appointment_id') ?? '';

    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
    const [loading, setLoading] = useState(true);
    const [screenForPatient, setScreenForPatient] =
        useState<ScreenForPatientType>({
            title: '',
            component: null,
        });
    const [institution, setInstitution] = useState<InstitutionClass>();

    const userSurveyState = useSelector(selectInitialPatientSurvey);
    const hpiHeaders = useSelector(selectHpiHeaders);
    const activeItem = useSelector(selectActiveItem);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment>();

    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>();

    const institutionDefaultCC = useMemo((): string[] => {
        if (!institutionConfig) return [];
        return institutionConfig.diseaseForm.map((item) => item.diseaseName);
    }, [institutionConfig]);

    const selectedChiefComplaints = useSelectedChiefComplaints();

    const [appointmentDate, setAppointmentDate] = useState('');
    const [hpiKey, setHpiKey] = useState('');
    const [hpiName, setHpiName] = useState('');

    useEffect(() => {
        const fetchAppointment = async () => {
            const selectedAppointment = await getAppointmentDetail(
                institutionId,
                appointmentId,
                cognitoUser
            );
            if (selectedAppointment && selectedAppointment.patient) {
                setSelectedAppointment(selectedAppointment);
                const appointmentDate = selectedAppointment.appointmentDate;
                const legalFirstName = selectedAppointment.patient.firstName;
                const legalLastName = selectedAppointment.patient.lastName;
                const legalMiddleName = selectedAppointment.patient.middleName;
                const dateOfBirth = selectedAppointment.patient.dob;
                setHpiKey(query.get('form_category')!);
                setHpiName(query.get('form_name')!);
                setAppointmentDate(appointmentDate);
                dispatch(
                    updateAdditionalSurveyDetails(
                        legalFirstName,
                        legalLastName,
                        legalMiddleName ? legalMiddleName : '',
                        '',
                        dateOfBirth,
                        0
                    )
                );
            }
        };
        fetchAppointment();
    }, [query, router, dispatch]);

    const getData = async (chiefComplaint: string) => {
        if (!chiefComplaint) {
            return;
        }
        setLoading(true);
        const response = await axios.get(
            graphClientURL + '/graph/category/' + chiefComplaint + '/4'
        );
        dispatch(processKnowledgeGraph(response.data));
        const filledForm = await getFilledForm(
            selectedAppointment?.id || query.get('appointment_id')!,
            query.get('template_step_id')!,
            query.get('form_category')!
        );
        if (filledForm) {
            dispatch(
                processKnowledgeGraph(filledForm.data.filled_form.formContent)
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!hpiKey || !hpiHeaders?.parentNodes) return;

        if (!(hpiKey in hpiHeaders?.parentNodes)) {
            console.error(
                `Chief Complaint named '${hpiKey}' is not present in the Knowledge Graph API response, SYSTEM MIGHT FAIL DUE TO THIS`
            );
        }

        getData(hpiKey);
        dispatch(setChiefComplaint(hpiName));
    }, [hpiKey, hpiName]);

    useEffect(() => {
        setScreenForPatient({
            component: (
                <NewNotePage
                    notification={{
                        setNotificationMessage,
                        setNotificationType,
                    }}
                />
            ),
            title:
                activeItem in hpiHeaders.parentNodes
                    ? hpiHeaders.parentNodes[activeItem].patientView
                    : activeItem,
        });
    }, [activeItem, institutionDefaultCC, hpiHeaders?.parentNodes]);

    useEffect(() => {
        if (!institutionId) {
            router.replace('/');
            return;
        }

        const fetchInstitution = async () => {
            dispatch(setLoadingStatus(true));
            try {
                const validatedInstitution =
                    await getInstitution(institutionId);
                if (!validatedInstitution) {
                    log(`HPI error fetching institution`);
                    router.replace('/');
                } else {
                    const { id, name } = validatedInstitution;
                    setInstitution(new InstitutionClass({ id, name }));
                }
                // const validatedInstitution = (await getInstitution(
                //     institutionId
                // )) as { detail: Institution };
                // const getInstitutionConfigResponse =
                //     await getInstitutionConfig(institutionId);

                // if (!(validatedInstitution as ApiResponse).errorMessage) {
                //     const { id, name } = validatedInstitution.detail;
                //     setInstitution(new InstitutionClass({ id, name }));
                // } else {
                //     log(`HPI error fetching institution`);
                //     router.replace('/');
                // }

                // if (
                //     !(getInstitutionConfigResponse as ApiResponse).errorMessage
                // ) {
                //     const result = (
                //         getInstitutionConfigResponse as InstitutionConfigResponse
                //     ).config;

                //     const validationDiseaseFormResult =
                //         await validateDiseaseForm(result);

                //     if (!validationDiseaseFormResult) {
                //         throw new Error('DiseaseForm validation failed');
                //     }
                //     setInstitutionConfig(result);
                // } else {
                //     log(`HPI error fetching institution preferences`);
                //     router.replace('/');
                // }
            } catch (e) {
                log(`HPI error fetching institution`);
                router.replace('/');
            } finally {
                dispatch(setLoadingStatus(false));
            }
        };
        fetchInstitution();
    }, [router, institutionId, query, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeItem, dispatch]);

    useEffect(() => {
        if (
            userSurveyState &&
            userSurveyState.nodes &&
            userSurveyState.nodes['8']
        ) {
            dispatch(initialSurveyAddDateOrPlace('8', appointmentDate));
        }
    }, [selectedChiefComplaints]);

    useEffect(() => {
        if (notificationMessage) {
            window.scrollTo(0, 0);
            const timeoutId = setTimeout(() => {
                setNotificationMessage('');
            }, 3000);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [notificationMessage]);

    // handle loading institution config
    // useEffect(() => {
    //     if (!institutionConfig) return;

    //     const { diseaseForm, showChiefComplaints, showDefaultForm } =
    //         institutionConfig;

    //     const diseaseFormKeys = diseaseForm.map((form) => form.diseaseKey);

    //     loadChiefComplaintsData(diseaseFormKeys).then((values) => {
    //         values.forEach((data) => dispatch(processKnowledgeGraph(data)));
    //     });

    //     if (showChiefComplaints || !showDefaultForm) return;

    //     // FIXME: this logic is not idempotent and it should be!
    //     // here we're ensuring the default form is set locally in redux
    //     // however, when this useEffect gets called twice, it will end up removing the default form
    //     // this function: setChiefComplaint is the same for adding and removing items, causing bugs when called more than once...
    //     // remove existing "default forms" chief complaints before updating with new ones
    //     selectedChiefComplaints.forEach((item) => {
    //         dispatch(setChiefComplaint(item));
    //     });

    //     institutionDefaultCC.forEach((item) => {
    //         dispatch(setChiefComplaint(item));
    //     });

    //     // this effect changes selectedChiefComplaints, so don't add it to dependencies
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [
    //     dispatch,
    //     institutionConfig,
    //     institutionDefaultCC,
    //     // selectedChiefComplaints <-- do not add this here, causes infinite loop
    // ]);

    useEffect(() => {
        if (
            !Object.keys(hpiHeaders.parentNodes).length &&
            !Object.keys(hpiHeaders.bodySystems).length
        ) {
            const data = knowledgeGraphAPI;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }
    }, [dispatch, hpiHeaders]);

    useEffect(() => {
        dispatch(updateActiveItem(hpiName));

        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, [dispatch, hpiName]);

    const showMainNotificationMessage = useMemo(() => {
        if (!notificationMessage) return false;
        return false;
    }, [activeItem, notificationMessage]);

    return (
        <div className={style.editNote}>
            <div className='centering'>
                {!loading && (
                    <CommonLayout title={screenForPatient.title}>
                        {showMainNotificationMessage && (
                            <Notification
                                message={notificationMessage}
                                type={notificationType}
                            />
                        )}
                        {screenForPatient.component}
                    </CommonLayout>
                )}
            </div>
        </div>
    );
};

export default HpiAdvance;
