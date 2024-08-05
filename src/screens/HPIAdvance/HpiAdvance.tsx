'use client';

import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import useQuery from '@hooks/useQuery';
import useSignInRequired from '@hooks/useSignInRequired';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import style from './HpiAdvance.module.scss';
import CommonLayout from '@components/CommonLayout/CommonLayout';
import Notification, {
    NotificationTypeEnum,
} from '@components/tools/Notification/Notification';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectHpiHeaders } from '@redux/reducers/hpiHeadersReducer';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import CCSelection from '../HPI/ChiefComplaintSelection/CCSelection';
import NewNotePage from '../HPI/NotesPage/NotePage';

import {
    Institution as InstitutionClass,
    InstitutionType,
} from 'classes/institution.class';

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
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
    const [screenForPatient, setScreenForPatient] =
        useState<ScreenForPatientType>({
            title: '',
            component: null,
        });
    const [institution, setInstitution] = useState<InstitutionClass>();
    const userSurveyState = useSelector(selectInitialPatientSurvey);
    const additionalSurvey = useSelector(selectAdditionalSurvey);
    const hpiHeaders = useSelector(selectHpiHeaders);
    const activeItem = useSelector(selectActiveItem);

    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>();

    const institutionDefaultCC = useMemo((): string[] => {
        if (!institutionConfig) return [];
        return institutionConfig.diseaseForm.map((item) => item.diseaseName);
    }, [institutionConfig]);

    const institutionId = query?.get(HPIPatientQueryParams.INSTITUTION_ID);

    useEffect(() => {
        dispatch(updateActiveItem('CCSelection'));
        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, [dispatch]);

    useEffect(() => {
        if (activeItem == 'CCSelection') {
            setScreenForPatient({
                component: (
                    <CCSelection
                        continue={onNextClick}
                        notification={{
                            setNotificationMessage,
                            setNotificationType,
                        }}
                        defaultInstitutionChiefComplaints={institutionDefaultCC}
                        onPreviousClick={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                ),
                title: `Please select the top 3 conditions or symptoms you'd like to discuss`,
            });
        } else {
            setScreenForPatient({
                component: (
                    <NewNotePage
                        onNextClick={onNextClick}
                        onPreviousClick={onPreviousClick}
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
        }
    }, [activeItem, institutionDefaultCC, hpiHeaders?.parentNodes]);

    const onPreviousClick = useCallback(() => {}, [activeItem, dispatch]);

    const onNextClick = useCallback(
        (args?: OnNextClickParams) => {
            const allSelectedChiefComplaints =
                args?.allSelectedChiefComplaints || [];
            const listTextChiefComplaints = args?.listTextChiefComplaints || [];

            const node7Response = userSurveyState.nodes['7'].response ?? {};
        },
        [userSurveyState.nodes, activeItem, dispatch, institutionDefaultCC]
    );

    return (
        <div className={style.editNote}>
            <div className='centering'>
                <CommonLayout title={screenForPatient.title}>
                    {screenForPatient.component}
                </CommonLayout>
            </div>
        </div>
    );
};

export default HpiAdvance;
