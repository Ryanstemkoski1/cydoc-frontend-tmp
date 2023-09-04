import Input from 'components/Input/Input';
import Modal from 'components/Modal/Modal';
import { stagingClient } from 'constants/api';
import useUser from 'hooks/useUser';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import { CurrentNoteState } from 'redux/reducers';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RefreshIcon from '../../assets/images/refresh.png';
import RightArrow from '../../assets/images/right-arrow.svg';
import style from './BrowseNotes.module.scss';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

function formatDate(date: Date): string {
    return (
        weekDays[date.getDay()] +
        ', ' +
        months[date.getMonth()] +
        ' ' +
        date.getDate() +
        ', ' +
        date.getFullYear()
    );
}

function formatDateOfBirth(date: string | Date): string {
    const inDateFormat = new Date(date);
    return (
        (inDateFormat.getMonth() + 1).toString() +
        '/' +
        inDateFormat.getDate().toString() +
        '/' +
        inDateFormat.getFullYear().toString()
    );
}

export interface AppointmentUser {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    clinicianId: number | null;
}

async function fetchHPIAppointments(
    date: Date,
    clinicianId: string,
    stateUpdaterFunc: (users: AppointmentUser[]) => void,
    onError?: (error: any) => void
) {
    try {
        let url = `/appointments?appointment_date=${formatDateOfBirth(date)}`;

        if (clinicianId !== null) {
            url += `&clinician_id=${clinicianId}`;
        }
        const response = await stagingClient.get(url);
        const fetchDetails = response.data.data as AppointmentUser[];
        stateUpdaterFunc(fetchDetails);
    } catch (_error: any) {
        onError?.(_error);
    }
}

const BrowseNotes = () => {
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState<AppointmentUser[]>([]);
    const [unreportedUsers, setUnreportedUsers] = useState<AppointmentUser[]>(
        []
    );
    const { user } = useUser();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<AppointmentUser | null>(null);
    const loadingStatus = useSelector(
        (state: CurrentNoteState) => state.loadingStatus
    );

    const openModal = (user: AppointmentUser) => {
        setSelectedAppointment(user);
        setShowModal(true);
    };

    const goBack = () => {
        setDate(new Date(date.getTime() - 86400000));
    };

    const goForward = () => {
        setDate(new Date(date.getTime() + 86400000));
    };

    useEffect(() => {
        loadPatientHistory();
    }, [user, date]);

    const loadPatientHistory = () => {
        dispatch(setLoadingStatus(true));
        if (!user) {
            dispatch(setLoadingStatus(false));
            return;
        }
        try {
            fetchHPIAppointments(date, user.id, (users: AppointmentUser[]) => {
                const unreportedUsers: AppointmentUser[] = users.filter(
                    (currentUser) => currentUser.clinicianId !== Number(user.id)
                );
                const reportedUsers: AppointmentUser[] = users.filter(
                    (currentUser) => currentUser.clinicianId === Number(user.id)
                );
                setUsers(reportedUsers);
                setUnreportedUsers(unreportedUsers);
                dispatch(setLoadingStatus(false));
            });
        } catch (_error: any) {
            dispatch(setLoadingStatus(false));
        }
    };

    function renderUsers(users: AppointmentUser[]) {
        return (
            <div className={`${style.notesBlock__tableWrapper}`}>
                <table>
                    <tbody>
                        {!loadingStatus && users.length == 0 ? (
                            <tr>
                                <td colSpan={2} className={style.nodata}>
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            <>
                                {users.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <span
                                                    onClick={() =>
                                                        openModal(user)
                                                    }
                                                >
                                                    {user.lastName +
                                                        ', ' +
                                                        user.firstName}
                                                </span>
                                            </td>
                                            <td>
                                                {formatDateOfBirth(
                                                    user.dateOfBirth
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={style.notesBlock}>
            <h1>Generated Notes</h1>
            <div className={style.notesBlock__notesWrap}>
                <div
                    className={` ${style.notesBlock__header} flex align-center justify-between`}
                >
                    <a
                        className='flex align-center justify-center'
                        onClick={goBack}
                    >
                        <img src={LeftArrow} alt='Left arrow' />
                    </a>
                    <span>{formatDate(date)}</span>
                    <a
                        className='flex align-center justify-center'
                        onClick={goForward}
                    >
                        <img src={RightArrow} alt='Right arrow' />
                    </a>
                </div>

                <div className={` ${style.notesBlock__content} flex-wrap `}>
                    <div className={style.notesBlock__contentInner}>
                        <div className='flex align-center justify-between'>
                            <h4>Clinician</h4>
                            <div className={style.notesBlock__dropdown}>
                                <Input
                                    value={
                                        user
                                            ? user!.lastName +
                                              ', ' +
                                              user!.firstName
                                            : ''
                                    }
                                    disabled
                                />
                            </div>
                        </div>

                        {renderUsers(users)}
                    </div>
                    <div className={style.notesBlock__contentInner}>
                        <h4 className={`${style.clinical} flex align-center`}>
                            {' '}
                            Clinician: Unreported
                        </h4>
                        {renderUsers(unreportedUsers)}
                    </div>
                    <div
                        className={`${style.notesBlock__reload} flex justify-end`}
                    >
                        <button onClick={loadPatientHistory}>
                            <picture>
                                <img src={RefreshIcon} alt='Refresh' />
                            </picture>
                            Check for new questionnaires
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                key={selectedAppointment?.id}
                showModal={showModal}
                setShowModal={setShowModal}
                selectedAppointment={selectedAppointment}
            />
        </div>
    );
};

export default BrowseNotes;
