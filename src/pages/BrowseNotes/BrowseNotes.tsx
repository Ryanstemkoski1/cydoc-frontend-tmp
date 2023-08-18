import DropdownForClinicians from 'components/Input/DropdownForClinicians';
import Modal from 'components/Modal/Modal';
import { localhostClient } from 'constants/api';
import React, { useCallback, useEffect, useState } from 'react';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import style from './BrowseNotes.module.scss';

const selectOptions: string[] = ['Harsh Patel', 'Baker, Ronald', 'Smith, Jane'];
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
        date.getFullYear().toString() +
        '-' +
        (date.getMonth() + 1).toString() +
        '-' +
        date.getDate().toString()
    );
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
}

export interface Clinician {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    institution_id: number;
}

const BrowseNotes = () => {
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState(usersList);
    const [unreportedUsers, setUnreportedUsers] = useState(unreportedUsersList);

    const [clinicians, setClinicians] = useState<Clinician[]>([]);
    const [clinician, setClinician] = useState<Clinician>();

    const fetchHPIAppointments = useCallback(
        async (date: Date, clinician_id: number) => {
            const response = await localhostClient.get(
                `/appointments?appointment_date=${formatDatev2(
                    date
                )}&clinician_id=${clinician_id}`
            );

            const fetchDetails = response.data.data as User[];

            setUsers(
                fetchDetails.map(
                    ({ first_name, last_name, date_of_birth, id }) => ({
                        id,
                        first_name,
                        date_of_birth: new Date(date_of_birth),
                        last_name,
                    })
                )
            );
        },
        []
    );

    const fetchClinicians = useCallback(async () => {
        const response = await localhostClient.get('/clinicians');
        setClinicians(response.data.clinicians);
    }, []);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [appointmentId, setAppointmentId] = useState<number>(0);

    const openModal = (appointmentId: number) => {
        setAppointmentId(appointmentId);
        setShowModal(true);
    };

    const goBack = () => {
        setDate(new Date(date.getTime() - 86400000));
    };

    const goForward = () => {
        setDate(new Date(date.getTime() + 86400000));
    };

    useEffect(() => {
        if (!clinician) return;
        setUsers([]);
        fetchHPIAppointments(date, clinician.id);
    }, [date, clinician]);

    useEffect(() => {
        setClinicians([]);
        fetchClinicians();
    }, []);

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
                                <DropdownForClinicians
                                    items={clinicians}
                                    onChange={(id: number) => {
                                        const selectedClinician =
                                            clinicians.find(
                                                (item) => item.id === id
                                            ) as Clinician;
                                        setClinician(selectedClinician);
                                    }}
                                    placeholder='Clinician'
                                />
                            </div>
                        </div>
                        <div className={`${style.notesBlock__tableWrapper}`}>
                            <table>
                                {/* <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Action</th>
                                    </tr>
                                </thead> */}
                                <tbody>
                                    {users.length == 0 ? (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className={style.nodata}
                                            >
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
                                                                onClick={() => {
                                                                    openModal(
                                                                        user.id
                                                                    );
                                                                }}
                                                            >
                                                                {user.first_name +
                                                                    ' ' +
                                                                    user.last_name}
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
                    </div>
                    <div className={style.notesBlock__contentInner}>
                        <h4 className={`${style.clinical} flex align-center`}>
                            {' '}
                            Clinician: Unreported
                        </h4>
                        <div className={`${style.notesBlock__tableWrapper}`}>
                            <table>
                                <tbody>
                                    {unreportedUsers.length == 0 ? (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className={style.nodata}
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {unreportedUsers.map(
                                                (user, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <span
                                                                    onClick={() =>
                                                                        openModal(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    {user.first_name +
                                                                        ' ' +
                                                                        user.last_name}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {formatDatev2(
                                                                    user.date_of_birth
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                key={appointmentId}
                showModal={showModal}
                setShowModal={setShowModal}
                appointmentId={appointmentId}
            />
        </div>
    );
};

export default BrowseNotes;
