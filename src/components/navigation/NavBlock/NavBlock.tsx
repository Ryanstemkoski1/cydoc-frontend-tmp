'use client';

import style from './NavBlock.module.scss';
import { useSelector } from 'react-redux';
import { selectDoctorViewState } from '@redux/selectors/userViewSelectors';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import {
    accountMenuItems,
    clinicalWorkflowItems,
    pageRoutes,
    practiceAdminMenuItems,
} from '@constants/drawerMenuItems';
import NoteNameMenuItem from '../NoteNameMenuItem';
import LightTooltip from '@components/LightTooltip/LightTooltip';

const NavBlock = () => {
    const doctorView = useSelector(selectDoctorViewState);
    const pathname = usePathname();
    const isEditNotePage = pathname?.includes('editnote');
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

    return (
        <Box className={style.navBlockWrapper}>
            {doctorView && isEditNotePage && (
                <div className={style.header__note}>
                    <NoteNameMenuItem />
                </div>
            )}
            <Typography className={style.typo}>
                {pathname === '/' ? 'Home' : currentRoute?.label}
            </Typography>
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
