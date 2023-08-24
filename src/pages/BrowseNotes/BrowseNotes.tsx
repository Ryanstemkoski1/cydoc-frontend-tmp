import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import { getFullName } from 'components/Input/DropdownForClinicians';
import Input from 'components/Input/Input';
import Modal from 'components/Modal/Modal';
import { stagingClient } from 'constants/api';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import { CurrentNoteState } from 'redux/reducers';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RefreshIcon from '../../assets/images/refresh.png';
import RightArrow from '../../assets/images/right-arrow.svg';
import style from './BrowseNotes.module.scss';

const usersList: User[] = [];
const unreportedUsersList: User[] = [];

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

function formatDatev2(date: Date): string {
    return (
        (date.getMonth() + 1).toString() +
        '/' +
        date.getDate().toString() +
        '/' +
        date.getFullYear().toString()
    );
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    clinician_id: number | null;
}

export interface Clinician {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    institution_id: number;
}

async function fetchHPIAppointments(
    date: Date,
    clinician_id: number | null,
    stateUpdaterFunc: (users: User[]) => void,
    onSuccess?: () => void,
    onError?: (error: any) => void
) {
    try {
        let url = `/appointments?appointment_date=${formatDatev2(date)}`;

        if (clinician_id !== null) {
            url += `&clinician_id=${clinician_id}`;
        }

        const response = await stagingClient.get(url);

        const fetchDetails = response.data.data as User[];

        stateUpdaterFunc(
            fetchDetails.map(
                ({
                    first_name,
                    last_name,
                    date_of_birth,
                    id,
                    clinician_id,
                }) => ({
                    id,
                    first_name,
                    date_of_birth: new Date(date_of_birth),
                    last_name,
                    clinician_id,
                })
            )
        );

        onSuccess?.();
    } catch (_error: any) {
        onError?.(_error);
    }
}

function useClinicianDetails(): Clinician {
    const user = useCookies(['user'])[0].user;
    return {
        id: Number(
            localStorage.getItem(HPIPatientQueryParams.CLINICIAN_ID) as string
        ),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        institution_id: Number(
            localStorage.getItem(HPIPatientQueryParams.INSTITUTION_ID) as string
        ),
    };
}

const BrowseNotes = () => {
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState(usersList);
    const [unreportedUsers, setUnreportedUsers] = useState(unreportedUsersList);
    const clinician = useClinicianDetails();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<User | null>(
        null
    );
    const loadingStatus = useSelector(
        (state: CurrentNoteState) => state.loadingStatus
    );

    const openModal = (user: User) => {
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
        dispatch(setLoadingStatus(true));
        try {
            fetchHPIAppointments(date, clinician.id, (users: User[]) => {
                const unreportedUsers = users.filter(
                    (user) => user.clinician_id === null
                );
                const reportedUsers = users.filter(
                    (user) => user.clinician_id !== null
                );
                setUsers(reportedUsers);
                setUnreportedUsers(unreportedUsers);
                dispatch(setLoadingStatus(false));
            });
        } catch (_error: any) {
            dispatch(setLoadingStatus(false));
        }
    }, [date]);

    function renderUsers(users: User[]) {
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
                                                    {user.last_name +
                                                        ', ' +
                                                        user.first_name}
                                                </span>
                                            </td>
                                            <td>
                                                {formatDatev2(
                                                    user.date_of_birth
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
                                {/* <DropdownForClinicians
                                    items={[clinician]}
                                    onChange={() => {
                                        return;
                                    }}
                                    value={getFullName(
                                        clinician.first_name,
                                        clinician.last_name
                                    )}
                                    placeholder='Clinician'
                                /> */}

                                <Input
                                    value={getFullName(
                                        clinician.first_name,
                                        clinician.last_name
                                    )}
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
                        <button
                            onClick={async () => {
                                dispatch(setLoadingStatus(true));
                                fetchHPIAppointments(
                                    date,
                                    clinician.id,
                                    (users: User[]) => {
                                        const unreportedUsers = users.filter(
                                            (user) => user.clinician_id === null
                                        );
                                        const reportedUsers = users.filter(
                                            (user) => user.clinician_id !== null
                                        );
                                        setUsers(reportedUsers);
                                        setUnreportedUsers(unreportedUsers);
                                        dispatch(setLoadingStatus(false));
                                    }
                                );
                            }}
                        >
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
