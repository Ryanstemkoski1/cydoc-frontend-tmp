import Dropdown from 'components/Input/Dropdown';
import Modal from 'components/Modal/Modal';
import React, { useEffect, useState } from 'react';
import LeftArrow from '../../assets/images/left-arrow.svg';
import RightArrow from '../../assets/images/right-arrow.svg';
import style from './BrowseNotes.module.scss';

const selectOptions: string[] = ['Harsh Patel', 'Baker, Ronald', 'Smith, Jane'];
const usersList: string[] = ['Harsh Patel', 'Baker, Ronald', 'Smith, Jane'];
const unreportedUsersList: string[] = [
    'Harsh Patel',
    'Baker, Ronald',
    'Smith, Jane',
];

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
        ' ' +
        date.getFullYear()
    );
}

const BrowseNotes = () => {
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState(usersList);
    const [unreportedUsers, setUnreportedUsers] = useState(unreportedUsersList);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    const openModal = (user: string) => {
        setUsername(user);
        setShowModal(true);
    };

    const goBack = () => {
        setDate(new Date(date.getTime() - 86400000));
    };

    const goForward = () => {
        setDate(new Date(date.getTime() + 86400000));
    };

    useEffect(() => {
        if (date.getTime() > new Date().getTime()) {
            setUsers([]);
            setUnreportedUsers([]);
        } else {
            setUsers(usersList);
            setUnreportedUsers(usersList);
        }
    }, [date]);

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
                            <h4>Clinical</h4>
                            <div className={style.notesBlock__dropdown}>
                                <Dropdown
                                    items={selectOptions}
                                    onChange={() => {
                                        return;
                                    }}
                                    placeholder='Clinical'
                                />
                            </div>
                        </div>
                        <div
                            className={`${style.notesBlock__tableWrapper} scrollbar`}
                        >
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
                                                                        user
                                                                    );
                                                                }}
                                                            >
                                                                {user}
                                                            </span>
                                                        </td>
                                                        <td>5/22/1974</td>
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
                            Clinical: Unreported
                        </h4>
                        <div
                            className={`${style.notesBlock__tableWrapper} scrollbar`}
                        >
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
                                                                            user
                                                                        )
                                                                    }
                                                                >
                                                                    {user}
                                                                </span>
                                                            </td>
                                                            <td>5/22/1974</td>
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
                showModal={showModal}
                setShowModal={setShowModal}
                username={username}
            />
        </div>
    );
};

export default BrowseNotes;
