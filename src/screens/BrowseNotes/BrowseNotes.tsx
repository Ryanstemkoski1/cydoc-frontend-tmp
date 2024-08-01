'use client';

import Modal from '@components/Modal/Modal';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import { getAppointment } from 'modules/appointment-api';
import React, { use, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingStatus } from '@redux/actions/loadingStatusActions';
import { selectLoadingStatus } from '@redux/reducers/loadingStatusReducer';
import style from './BrowseNotes.module.scss';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import useSignInRequired from '@hooks/useSignInRequired';
import MobileDatePicker from '@components/Input/MobileDatePicker';
import Input from '@components/Input/Input';
import GeneratedNoteContent from '@components/GeneratedNoteContent/GeneratedNoteContent';
import CreatePatientModal from '@components/CreatePatientModal/CreatePatientModal';
import AddIcon from '@mui/icons-material/Add';
import { selectProductDefinitions } from '@redux/selectors/productDefinitionSelector';
import { selectPatientState } from '@redux/selectors/patientSelector';
import CustomTextField from '@components/Input/CustomTextField';

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
        weekDays[date.getUTCDay()] +
        ', ' +
        months[date.getUTCMonth()] +
        ' ' +
        date.getUTCDate() +
        ', ' +
        date.getUTCFullYear()
    );
}

function formatDateOfBirth(date: string | Date): string {
    const inDateFormat = new Date(date);
    return (
        (inDateFormat.getUTCMonth() + 1).toString() +
        '/' +
        inDateFormat.getUTCDate().toString() +
        '/' +
        inDateFormat.getUTCFullYear().toString()
    );
}

export interface AppointmentUser {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    dob: Date;
    clinicianId: string | null;
    appointmentDate: Date;
    clinicianLastName: string | null;
    hpiText: string;
    ssnLastFourDigit: string | null;
    institutionId: string | null;
}

const BrowseNotes = () => {
    useSignInRequired(); // this route is private, sign in required
    const [date, setDate] = useState(new Date());
    const [dateAdvance, setDateAdvance] = useState('');
    const [users, setUsers] = useState<AppointmentUser[]>([]);
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const dispatch = useDispatch();
    const definitions = useSelector(selectProductDefinitions);
    const patientsData = useSelector(selectPatientState);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalAdvance, setShowModalAdvance] = useState<boolean>(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>();
    const loadingStatus = useSelector(selectLoadingStatus);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [addedPatients, setAddedPatients] = useState<any[]>(
        patientsData.patients
    );

    useEffect(() => {
        const initialDate = new Date().toISOString().slice(0, 10); // yyyy-mm-dd format
        setDateAdvance(initialDate);
    }, []);

    const handleListItemClick = (index: number, user: any) => {
        setSelectedIndex(index);
        setSelectedAppointment(user);
    };

    const openModal = (user: AppointmentUser) => {
        setSelectedAppointment(user);
        setShowModal(true);
    };

    const openModalAdvance = () => {
        setShowModalAdvance(true);
    };

    const goBack = () => {
        setDate(new Date(date.getTime() - 86400000));
    };

    const goForward = () => {
        setDate(new Date(date.getTime() + 86400000));
    };

    const goBackAdvance = () => {
        const currentDate = new Date(dateAdvance);
        currentDate.setDate(currentDate.getDate() - 1);
        setDateAdvance(currentDate.toISOString().slice(0, 10));
        setSelectedIndex(null);
        setSelectedAppointment(undefined);
    };

    const goForwardAdvance = () => {
        const currentDate = new Date(dateAdvance);
        currentDate.setDate(currentDate.getDate() + 1);
        setDateAdvance(currentDate.toISOString().slice(0, 10));
        setSelectedIndex(null);
        setSelectedAppointment(undefined);
    };

    const loadPatientHistory = useCallback(async () => {
        if (!definitions?.showNewPatientGeneration) {
            dispatch(setLoadingStatus(true));
            if (!user) {
                dispatch(setLoadingStatus(false));
                return;
            }
            try {
                const users = await getAppointment(
                    formatDateOfBirth(
                        definitions?.showNewPatientGeneration
                            ? dateAdvance
                            : date
                    ),
                    user?.institutionId,
                    cognitoUser
                );
                setUsers(users);
                dispatch(setLoadingStatus(false));
            } catch (err) {
                setUsers([]);
                dispatch(setLoadingStatus(false));
            }
        }
    }, [cognitoUser, date, dispatch, user]);

    useEffect(() => {
        loadPatientHistory();
    }, [loadPatientHistory]);

    useEffect(() => {
        if (patientsData.patients.length > 0) {
            setAddedPatients(patientsData.patients);
        }
    }, [dateAdvance, dispatch, patientsData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateAdvance(e.target.value);
        setSelectedIndex(null);
        setSelectedAppointment(undefined);
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

    function renderUsersAdvance(addedPatients: any[]) {
        return (
            <Box className={`${style.notesBlockAdvance__tableWrapper}`}>
                <Box
                    className={style.notesBlockAdvance__tableWrapper__addBtn}
                    onClick={openModalAdvance}
                >
                    <AddIcon style={{ color: '#047A9B' }} />
                    <Typography component='p'>Add patient</Typography>
                </Box>
                <List sx={{ padding: '0' }}>
                    {!loadingStatus && addedPatients.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant='body1'
                                        className={style.nodata}
                                    >
                                        No users found
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ) : (
                        addedPatients.map((user, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleListItemClick(index, user)}
                                sx={{
                                    backgroundColor:
                                        selectedIndex === index
                                            ? '#047A9B'
                                            : 'inherit',
                                    border: '1px solid var(--Divider, #D7E5E9)',
                                    borderRadius: '10px',
                                    marginTop: '4px',
                                    padding: '16px 20px',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    className={
                                        style.notesBlockAdvance__tableWrapper__itemWrapper
                                    }
                                >
                                    <Box
                                        className={
                                            style.notesBlockAdvance__tableWrapper__left
                                        }
                                    >
                                        <img
                                            src={
                                                selectedIndex === index
                                                    ? '/images/add-patient-select.svg'
                                                    : '/images/add-patient.svg'
                                            }
                                            alt={`${index} patient image`}
                                        />
                                        <Typography
                                            component='p'
                                            style={{
                                                color:
                                                    selectedIndex === index
                                                        ? 'white'
                                                        : 'black',
                                            }}
                                        >
                                            {user?.patientDetails?.fullName}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        component='p'
                                        style={{
                                            color:
                                                selectedIndex === index
                                                    ? 'white'
                                                    : '#00000099',
                                        }}
                                        className={
                                            style.notesBlockAdvance__tableWrapper__right
                                        }
                                    >
                                        {formatDateOfBirth(
                                            user?.patientDetails?.dateOfBirth
                                        )}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>
        );
    }

    return (
        <>
            {!definitions?.showNewPatientGeneration ? (
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
                                <img
                                    src={'/images/left-arrow.svg'}
                                    alt='Left arrow'
                                />
                            </a>
                            <span>{formatDate(date)}</span>
                            <a
                                className='flex align-center justify-center'
                                onClick={goForward}
                            >
                                <img
                                    src={'/images/right-arrow.svg'}
                                    alt='Right arrow'
                                />
                            </a>
                        </div>

                        <div className={` ${style.notesBlock__content} `}>
                            <div className={style.notesBlock__contentInner}>
                                {renderUsers(users)}
                            </div>
                            <div className={`${style.notesBlock__reload}`}>
                                <button
                                    onClick={loadPatientHistory}
                                    style={{ borderStyle: 'none' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            paddingY: '.5em',
                                        }}
                                    >
                                        <img
                                            alt='Refresh'
                                            height={14}
                                            width={14}
                                            style={{
                                                marginRight: '10px',
                                                marginLeft: '7px',
                                            }}
                                            src={'/images/refresh.png'}
                                        />
                                        Check for new questionnaires
                                    </Box>
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
            ) : (
                <>
                    <Box className={style.notesBlockAdvance}>
                        <Box className={style.notesBlockAdvance__notesWrap}>
                            <Box
                                className={` ${style.notesBlockAdvance__header} flex align-center justify-between`}
                            >
                                <Box
                                    className={
                                        style.notesBlockAdvance__header__dateWrapper
                                    }
                                >
                                    <CustomTextField
                                        id='dateOfBirth'
                                        required={true}
                                        type='date'
                                        name='dateOfBirth'
                                        placeholder='mm/dd/yyyy'
                                        value={dateAdvance}
                                        max={new Date().toJSON().slice(0, 10)}
                                        onChange={handleChange}
                                    />
                                </Box>
                                <a
                                    className='flex align-center justify-center'
                                    onClick={goBackAdvance}
                                >
                                    <img
                                        src={'/images/left-arrow.svg'}
                                        alt='Left arrow'
                                    />
                                </a>
                                <a
                                    className='flex align-center justify-center'
                                    onClick={goForwardAdvance}
                                >
                                    <img
                                        src={'/images/right-arrow.svg'}
                                        alt='Right arrow'
                                    />
                                </a>
                            </Box>

                            <Box
                                className={` ${style.notesBlockAdvance__content} `}
                            >
                                {renderUsersAdvance(addedPatients)}
                            </Box>
                        </Box>
                        {selectedAppointment && (
                            <Box
                                className={
                                    style.notesBlockAdvance__notesDescription
                                }
                            >
                                <GeneratedNoteContent
                                    selectedAppointment={selectedAppointment}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box className={`${style.checkReloadAdvance}`}>
                        <button
                            onClick={loadPatientHistory}
                            style={{
                                borderStyle: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            <Box className={style.checkReloadAdvance__inner}>
                                <img
                                    alt='Refresh'
                                    style={{
                                        marginRight: '10px',
                                        marginLeft: '7px',
                                    }}
                                    src={'/images/refresh.png'}
                                />
                                Check for new notes
                            </Box>
                        </button>
                    </Box>
                    <CreatePatientModal
                        showModal={showModalAdvance}
                        setShowModal={setShowModalAdvance}
                    />
                </>
            )}
        </>
    );
};

export default BrowseNotes;
