'use client';

import { Icon } from '@components/Icon';
import ToastOptions from '@constants/ToastOptions';
import { Institution } from '@cydoc-ai/types';
import useAuth from '@hooks/useAuth';
import useSignInRequired from '@hooks/useSignInRequired';
import useUser from '@hooks/useUser';
import {
    getInstitution,
    uploadInstitutionLogo,
} from '@modules/institution-api';
import { Box, Button, CircularProgress } from '@mui/material';
import { margin } from '@mui/system';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function DrawerMenu() {
    useSignInRequired();

    const [loading, setLoading] = useState(false);
    const [institution, setInstitution] = useState<Institution | null>(null);
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const [logoUrl, setLogoUrl] = useState('');
    const [selecetedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const CYDOC_LOGO = '/images/cydoc-logo.svg';

    const fetchInstitution = async () => {
        setLoading(true);
        const institution = await getInstitution(user!.institutionId);
        setInstitution(institution);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchInstitution();
        }
    }, [user]);

    useEffect(() => {
        if (institution && institution.logo) {
            setLogoUrl(institution.logo);
        } else {
            setLogoUrl(CYDOC_LOGO);
        }
    }, [institution]);

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
        if (selecetedFile) {
            setUploading(true);
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
                        'Your logo has been updated.',
                        ToastOptions.success
                    );
                    setSelectedFile(null);
                    setLogoUrl(response['logo_url']);
                    location.reload();
                }
            } catch (error) {
                toast.error('Upload failed.', ToastOptions.error);
            } finally {
                setUploading(false);
            }
        }
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
                }}
            >
                <div
                    style={{
                        height: '200px',
                        width: '200px',
                        position: 'relative',
                    }}
                >
                    <img src={logoUrl} width={200} height={200} alt='logo' />
                    <input
                        accept='image/*'
                        style={{
                            display: 'none',
                            position: 'absolute',
                            bottom: 0,
                            right: -20,
                        }}
                        id='raised-button-file'
                        multiple
                        type='file'
                    />
                    <label htmlFor='raised-button-file'>
                        <Button
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: -20,
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
                {selecetedFile && (
                    <Button
                        onClick={() => {
                            onSave();
                        }}
                        variant='contained'
                        sx={margin({
                            marginTop: '10px',
                        })}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading' : 'Upload'}
                    </Button>
                )}
            </Box>
        )
    );
}
