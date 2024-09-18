'use client';

import { Icon } from '@components/Icon';
import CustomTextField from '@components/Input/CustomTextField';
import ToastOptions from '@constants/ToastOptions';
import { Institution } from '@cydoc-ai/types';
import useAuth from '@hooks/useAuth';
import useSignInRequired from '@hooks/useSignInRequired';
import useUser from '@hooks/useUser';
import {
    getInstitution,
    updateInstitutionInfo,
    uploadInstitutionLogo,
} from '@modules/institution-api';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function DrawerMenu() {
    useSignInRequired();

    const [loading, setLoading] = useState(false);
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [newPracticeName, setNewPracticeName] = useState('');
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const [logoUrl, setLogoUrl] = useState('');
    const [selecetedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const CYDOC_LOGO = '/images/cydoc-logo.svg';

    const fetchInstitution = async (isInitial: boolean) => {
        setLoading(isInitial);
        const institution = await getInstitution(user!.institutionId);
        setInstitution(institution);
        setNewPracticeName(institution.name);
        setLogoUrl(institution.logo || CYDOC_LOGO);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchInstitution(true);
        }
    }, [user]);

    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const onSave = async () => {
        if (!cognitoUser || !institution) return;
        setSubmitting(true);

        try {
            if (newPracticeName !== institution.name) {
                await updateInstitutionInfo(
                    institution.id,
                    { name: newPracticeName },
                    cognitoUser
                );

                fetchInstitution(false);

                toast.success(
                    'Clinic name updated successfully.',
                    ToastOptions.success
                );
            }
        } catch (error) {
            toast.error('Update Clinic name failed.', ToastOptions.error);
        }

        if (selecetedFile) {
            const formData = new FormData();
            formData.append(`logo`, selecetedFile, selecetedFile.name);
            try {
                const response = await uploadInstitutionLogo(
                    institution!.id,
                    formData,
                    cognitoUser
                );

                if (!response || response.status !== 'success') {
                    toast.error('Upload failed.', ToastOptions.error);
                } else {
                    toast.success(
                        'Your logo has been updated. Reload the page to see the changes.',
                        ToastOptions.success
                    );
                    setSelectedFile(null);
                    setLogoUrl(response['logo_url']);
                }
            } catch (error) {
                toast.error('Upload failed.', ToastOptions.error);
            }
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    height: '100%',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        institution && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Card sx={{ width: { xs: '90%', md: 500 } }}>
                    <CardContent>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '50%',
                                marginTop: '2rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                padding: '1rem',
                            }}
                        >
                            <div style={{ width: '100%' }}>
                                <CustomTextField
                                    label='Practice Name'
                                    required={true}
                                    aria-label='Practice Name'
                                    name='Practice Name'
                                    placeholder='Practice Name'
                                    value={newPracticeName}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setNewPracticeName(e.target.value);
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    position: 'relative',
                                    width: '150px',
                                    height: '150px',
                                    marginTop: '2rem',
                                }}
                            >
                                <img
                                    src={logoUrl}
                                    width={'100%'}
                                    height={'100%'}
                                    alt='logo'
                                    style={{
                                        objectFit: 'contain',
                                        borderRadius: '50%',
                                        border: '1px solid #ccc',
                                    }}
                                />
                                <input
                                    accept='image/*'
                                    style={{
                                        display: 'none',
                                    }}
                                    id='raised-button-file'
                                    multiple
                                    type='file'
                                />
                                <label htmlFor='raised-button-file'>
                                    <Button
                                        sx={{
                                            position: 'absolute',
                                            bottom: -10,
                                            right: -30,
                                        }}
                                        component='label'
                                    >
                                        <Icon type='editPencil' />
                                        <input
                                            type='file'
                                            hidden
                                            id='file'
                                            onChange={(event) => {
                                                onFileSelected(event);
                                            }}
                                        ></input>
                                    </Button>
                                </label>
                            </div>

                            <Button
                                onClick={() => {
                                    onSave();
                                }}
                                variant='contained'
                                sx={{
                                    marginTop: '2rem',
                                    alignSelf: 'flex-end',
                                    borderRadius: '5rem',
                                    background: '#007A9A',
                                    padding: '0.5rem 2rem',
                                    cursor: 'pointer',
                                }}
                                disabled={submitting}
                            >
                                {submitting ? 'Saving' : 'Save'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Box>
        )
    );
}
