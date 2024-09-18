'use client';

import style from './NavBlock.module.scss';
import { useSelector } from 'react-redux';
import { selectDoctorViewState } from '@redux/selectors/userViewSelectors';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import {
    accountMenuItems,
    clinicalWorkflowItems,
    pageRoutes,
    practiceAdminMenuItems,
} from '@constants/drawerMenuItems';
import NoteNameMenuItem from '../NoteNameMenuItem';
import LightTooltip from '@components/LightTooltip/LightTooltip';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { useEffect, useState } from 'react';

const NavBlock = () => {
    const additionalSurvey = useSelector(selectAdditionalSurvey);
    const doctorView = useSelector(selectDoctorViewState);
    const pathname = usePathname();

    const [navTitle, setNavTitle] = useState('');

    const isEditNotePage = pathname?.includes('editnote');
    const isGeneratedNotePage = pathname?.includes('hpi/doctor');
    const isAppointmentTemplatePage = pathname?.includes(
        'appointment-templates'
    );

    const menuItems = [
        ...clinicalWorkflowItems,
        ...practiceAdminMenuItems,
        ...accountMenuItems,
        ...pageRoutes,
    ];

    const currentRoute = menuItems.find((item) => item.href.includes(pathname));

    useEffect(() => {
        if (pathname === '/') {
            setNavTitle('Home');
        } else if (pathname === '/hpi/form-advance') {
            const {
                legalFirstName,
                legalMiddleName,
                legalLastName,
                dateOfBirth,
            } = additionalSurvey;

            if (!legalFirstName || !legalLastName || !dateOfBirth) {
                return;
            }

            const legalName = legalMiddleName
                ? `${legalFirstName} ${legalMiddleName} ${legalLastName}`
                : `${legalFirstName} ${legalLastName}`;

            setNavTitle(
                `Form for ${legalName}     DOB: ${formatDate(dateOfBirth)}`
            );
        } else {
            setNavTitle(currentRoute?.label || ''); // Provide a default value of an empty string
        }
    }, [pathname, additionalSurvey]);

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString();
    }

    return (
        <Box className={style.navBlockWrapper}>
            {doctorView && isEditNotePage && (
                <div className={style.header__note}>
                    <NoteNameMenuItem />
                </div>
            )}
            {isGeneratedNotePage && (
                <Box className={style.navBlockWrapper__logoBox}>
                    <Image
                        height={36}
                        width={36}
                        src='/images/cydoc-logo.svg'
                        alt='Cydoc'
                    />
                    <Typography component={'p'}>Cydoc</Typography>
                </Box>
            )}
            <Typography className={style.typo}>{navTitle}</Typography>
            {isAppointmentTemplatePage && (
                <LightTooltip
                    title={
                        "Each appointment type can be configured to automatically assign clinicians, staff, patients, or Cydoc Al particular tasks. For example, a clinician can be assigned a Mental Status Exam Form within an appointment template for a 'Depression follow Up visit'"
                    }
                />
            )}
        </Box>
    );
};

export default NavBlock;
