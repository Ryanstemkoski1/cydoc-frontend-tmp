import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container } from 'semantic-ui-react';
import './ManagerDashboard.css';
import { DbUser } from '@cydoc-ai/types';
import { getInstitutionMembers } from 'modules/institution-api';
import useUser from 'hooks/useUser';
import { log } from 'modules/logging';
import MaterialTable, {
    materialTableHeight,
} from 'components/Molecules/MaterialTable';
import { Delete, Edit } from '@mui/icons-material';
import { Column, Options } from '@material-table/core';
import InviteClinicianModal from './InviteClinicianModal';
import { removeUser } from 'modules/user-api';

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
                ({ members, errorMessage }) => {
                    if (errorMessage?.length) {
                        log(`[getInstitutionMembers] errror: ${errorMessage}`, {
                            members,
                            errorMessage,
                        });
                        alert(
                            `Error fetching institution members, try refreshing or logging out`
                        );
                    } else if (members) {
                        setMembers(members);
                    } else {
                        log(`Invalid getInstitutionMembers result`, {
                            members,
                            errorMessage,
                        });
                    }
                }
            ),
        [user?.institutionId]
    );

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers, user?.institutionId, isInviteUserOpen]);

    // TODO: review these state items:
    const [userToRemove, setUserToRemove] = useState('');

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
                                removeUser(rowData.id);
                                // removeBadge(rowData.id);
                            } else {
                                rowData.map((user) => removeUser(user.id));
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

const TABLE_OPTIONS: Options<DbUser> = {
    actionsColumnIndex: -1,
    maxBodyHeight: `${materialTableHeight + 3}vh`,
    minBodyHeight: `${materialTableHeight + 3}vh`,
};
