import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Form, Modal } from 'semantic-ui-react';
import NavMenu from 'components/navigation/NavMenu';
import './ManagerDashboard.css';
import { DbUser } from 'types/users';
import { getInstitutionMembers } from 'modules/institution-api';
import { useUser } from 'hooks/useUser';
import { log } from 'modules/logging';
import MaterialTable, {
    materialTableHeight,
} from 'components/Molecules/MaterialTable';
import { Delete, Edit } from '@mui/icons-material';
import { Column, Options } from '@material-table/core';
import InviteClinicianModal from './InviteClinicianModal';

// manager dashboard view to view/add/remove doctor accounts
const ManagerDashboard = () => {
    const [members, setMembers] = useState<DbUser[] | null>(null);
    const [editingUser, setEditingUser] = useState<DbUser | null>(null);
    const { user } = useUser();
    const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);

    const fetchMembers = useCallback(
        () =>
            user?.institutionId &&
            getInstitutionMembers(user?.institutionId).then(
                (newMembersOrError) => {
                    if (
                        typeof newMembersOrError !== 'string' &&
                        !!(newMembersOrError as [])?.length
                    ) {
                        const newMembers = newMembersOrError as DbUser[];
                        setMembers(newMembers);
                    } else {
                        log(`Invalid getInstitutionMembers result`, {
                            newMembersOrError,
                        });
                        alert(
                            `Error fetching institution members, try refreshing or logging out`
                        );
                    }
                }
            ),
        [user?.institutionId]
    );

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers, user?.institutionId]);

    // TODO: review these state items:
    const [userToRemove, setUserToRemove] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [duplicateUsername, setDuplicateUsername] = useState(false);

    const actions = useMemo(
        () => [
            (/* _rowData: UserRow */) => ({
                icon: Edit,
                tooltip: 'Edit User Info',
                onClick: (event: any, rowData: DbUser | DbUser[]) => {
                    if ('id' in rowData) {
                        setEditingUser(rowData);
                    } else {
                        setEditingUser(rowData[0]);
                    }
                },
            }),

            // (/* rowData: UserRow */) => ({
            //     icon: GroupAdd,
            //     tooltip: 'Edit User Groups',
            //     onClick: (event: any, rowData: UserRow | UserRow[]) => {
            //         if ('id' in rowData) {
            //             setEditingUserGroups([rowData.id]);
            //         } else {
            //             setEditingUserGroups(rowData.map((row) => row.id));
            //         }
            //         setShowGroupsModal(true);
            //     },
            // }),
            (/* rowData: UserRow */) => {
                return {
                    icon: () => <Delete />,
                    tooltip: 'Remove User',
                    onClick: (event: any, rowData: DbUser | DbUser[]) => {
                        const confirmMessage = `Are you sure you want to delete ${
                            'id' in rowData
                                ? 'this user'
                                : 'these ' + rowData.length + ' users'
                        }?`;
                        const result = window.confirm(confirmMessage);
                        if (result) {
                            if ('id' in rowData) {
                                alert(`removing: ${JSON.stringify(rowData)}`);
                                // removeBadge(rowData.id);
                            } else {
                                rowData.map((user) =>
                                    alert(`removing: ${JSON.stringify(user)}`)
                                );
                            }
                        }
                    },
                };
            },
        ],
        []
    );

    // const switchFullUserInfoView = (username, view) => {
    //     const show = view === 'show';
    //     const extraInfo = document.querySelectorAll(`.${username}`);
    //     extraInfo.forEach((item) => {
    //         item.style.display = show ? 'block' : 'none';
    //     });
    //     const viewMoreButton = document.querySelector(`.${username}-view-more`);
    //     const viewLessButton = document.querySelector(`.${username}-view-less`);
    //     const removeButton = document.querySelector(`.${username}-remove`);
    //     viewMoreButton.style.display = show ? 'none' : 'inline-block';
    //     viewLessButton.style.display = show ? 'inline-block' : 'none';
    //     removeButton.style.display = show ? 'inline-block' : 'none';
    // };

    const removeDoctor = () => {
        const deleteUsername = userToRemove[0];
        const deleteUUID = userToRemove[1];
        setUserToRemove('');
        // managerDeleteUser(deleteUsername, deleteUUID);
    };

    return (
        <>
            <NavMenu />
            <Container className='manager-dashboard-container'>
                <MaterialTable
                    actions={actions}
                    columns={COLUMNS}
                    data={members || []}
                    localization={{
                        toolbar: {
                            nRowsSelected: (number) =>
                                `${number} clinician${
                                    number === 1 ? '' : 's'
                                } selected`,
                        },
                    }}
                    loading={!members}
                    options={TABLE_OPTIONS}
                    onRowClick={(e, rowData) => {
                        // eslint-disable-next-line no-console
                        console.log(`row selected:`, rowData);
                    }}
                    tableId='BrandBadges'
                    title={
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <h3>Institution Members</h3>
                            <Button
                                icon='plus'
                                content='Invite a doctor'
                                size='small'
                                style={{ marginLeft: '1rem' }}
                                onClick={() => setIsInviteUserOpen(true)}
                            />
                        </div>
                    }
                />
            </Container>
            <InviteClinicianModal
                isOpen={isInviteUserOpen}
                onClose={() => setIsInviteUserOpen(false)}
            />
        </>
    );
};

export default ManagerDashboard;

const COLUMNS: Column<DbUser>[] = [
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'Email', field: 'email' },
    { title: 'Role', field: 'role' },

    { field: 'id', filtering: false, hidden: true, title: 'ID' },
    { title: 'Phone', field: 'phone' },
];

const TABLE_OPTIONS: Options<UserRow> = {
    actionsColumnIndex: -1,
    maxBodyHeight: `${materialTableHeight + 3}vh`,
    minBodyHeight: `${materialTableHeight + 3}vh`,
};
