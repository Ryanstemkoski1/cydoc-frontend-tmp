'use client';
import useSignInRequired from '@hooks/useSignInRequired';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processSurveyGraph } from '@redux/actions/userViewActions';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import initialQuestions from '../../EditNote/content/patientview/constants/initialQuestions';
import HPIContent from '../HpiContentAdvance/HpiContentAdvance';
import { NotificationTypeEnum } from '@components/tools/Notification/Notification';

interface OwnProps {
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
}

const NotePageAdvance = ({ notification }: OwnProps) => {
    useSignInRequired(); // this route is private, sign in required
    const dispatch = useDispatch();

    const userSurveyState = useSelector(selectInitialPatientSurvey);

    useEffect(() => {
        if (
            !Object.keys(userSurveyState?.graph).length &&
            !Object.keys(userSurveyState?.nodes).length &&
            !Object.keys(userSurveyState?.order).length
        ) {
            dispatch(processSurveyGraph(initialQuestions));
        }
    }, [dispatch, userSurveyState]);

    return (
        <div>
            <HPIContent notification={notification} />
        </div>
    );
};

export default NotePageAdvance;
