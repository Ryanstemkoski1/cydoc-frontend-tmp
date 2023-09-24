import Modal from 'components/Modal/Modal';
import useUser from 'hooks/useUser';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import { CurrentNoteState } from 'redux/reducers';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RefreshIcon from '../../assets/images/refresh.png';
import RightArrow from '../../assets/images/right-arrow.svg';
import style from './BrowseNotes.module.scss';
import { getAppointment } from 'modules/appointment-api';
import useAuth from 'hooks/useAuth';

export function formatFullName(firstName = '', middleName = '', lastName = '') {
    return `${lastName}, ${firstName} ${middleName}`;
}

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
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    dob: Date;
    clinicianId: number | null;
    appointmentDate: Date;
    clinicianLastName: string | null;
    hpiText: string;
    ssnLastFourDigit: string | null;
    institutionId: number | null;
}

const BrowseNotes = () => {
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState<AppointmentUser[]>([]);
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<AppointmentUser>();
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

    const loadPatientHistory = useCallback(async () => {
        dispatch(setLoadingStatus(true));
        if (!user) {
            dispatch(setLoadingStatus(false));
            return;
        }
        try {
            const users = await getAppointment(
                formatDateOfBirth(date),
                user?.institutionId,
                cognitoUser
            );
            setUsers(users);
            dispatch(setLoadingStatus(false));
        } catch (err) {
            setUsers([]);
            dispatch(setLoadingStatus(false));
        }
    }, [cognitoUser, date, dispatch, user]);

    useEffect(() => {
        loadPatientHistory();
    }, [loadPatientHistory]);

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
                                                    {formatFullName(
                                                        user?.firstName,
                                                        user?.middleName ?? '',
                                                        user?.lastName
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                {formatDateOfBirth(user.dob)}
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

                <div className={` ${style.notesBlock__content} `}>
                    <div className={style.notesBlock__contentInner}>
                        {renderUsers(users)}
                    </div>
                    <div className={`${style.notesBlock__reload}`}>
                        <button onClick={loadPatientHistory}>
                            <picture>
                                <img src={RefreshIcon} alt='Refresh' />
                            </picture>
                            Check for new questionnaires
                        </button>
                    </div>
                </div>
            </div>
            {selectedAppointment && (
                <Modal
                    key={selectedAppointment.id}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedAppointment={selectedAppointment}
                />
            )}
        </div>
    );
};

export default BrowseNotes;
