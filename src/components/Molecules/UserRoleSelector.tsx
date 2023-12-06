import { DbUser, UserRole } from '@cydoc-ai/types';
import {
    Box,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import { useSubscription } from 'hooks/useSubscription';
import useUser from 'hooks/useUser';
import { managerUpdateUser } from 'modules/user-api';
import React, { useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

export default function UserRoleSelector({
    user,
    isEditing,
    refetchUserData,
}: {
    refetchUserData: () => void;
    isEditing: boolean;
    user: DbUser;
}) {
    const role = user?.role;
    const { user: loggedInUser } = useUser();
    const { cognitoUser } = useAuth();
    const { updateSubscriptionInfo } = useSubscription();
    const institutionId = useMemo(
        () => loggedInUser?.institutionId,
        [loggedInUser?.institutionId]
    );
    const [loading, setLoading] = useState(false);
    const isEditingSelf = user.id === loggedInUser?.id;

    const handleChange = async (event: SelectChangeEvent<UserRole>) => {
        setLoading(true);

        // Prevent admins from demoting themselves and breaking their setup
        if (isEditingSelf) {
            alert('You cannot remove your own manager access');
        } else {
            invariant(institutionId, '[UserRoleSelector] missing institution');

            await managerUpdateUser(
                {
                    ...user,
                    role: event.target.value as UserRole,
                    // @ts-expect-error prevents sending table data to API
                    tableData: undefined,
                },
                institutionId,
                cognitoUser
            );

            // invalidate local user data & refetch
            refetchUserData();
            // re-calculate subscription cost to handle any changes in billable members
            updateSubscriptionInfo();
        }
        setLoading(false);
    };

    if (!isEditing || isEditingSelf) return <p>{role || 'staff'}</p>;

    if (loading) return <CircularProgress />;

    return (
        <Grid item>
            <Box display='flex' alignItems='flex-start' flexDirection='column'>
                <FormControl fullWidth>
                    <InputLabel id='permission-level-select-label'>
                        Edit role:
                    </InputLabel>
                    <Select
                        labelId='permission-level-select-label'
                        id='permission-level-select'
                        value={role}
                        label='Admin Permissions'
                        onChange={handleChange}
                    >
                        <MenuItem value={'staff'}>staff</MenuItem>
                        <MenuItem value={'clinician'}>clinician</MenuItem>
                        <MenuItem value={'manager'}>manager</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Grid>
    );
}
