'use client';

import style from './NavBlock.module.scss';
import { useSelector } from 'react-redux';
import { selectDoctorViewState } from '@redux/selectors/userViewSelectors';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import {
    accountMenuItems,
    clinicalWorkflowItems,
    practiceAdminMenuItems,
} from '@constants/drawerMenuItems';
import NoteNameMenuItem from '../NoteNameMenuItem';

const NavBlock = () => {
    const doctorView = useSelector(selectDoctorViewState);
    const pathname = usePathname();
    const isEditNotePage = pathname?.includes('editnote');

    const menuItems = [
        ...clinicalWorkflowItems,
        ...practiceAdminMenuItems,
        ...accountMenuItems,
    ];

    const currentRoute = menuItems.find((item) => item.href.includes(pathname));

    return (
        <Box className={style.wrapper}>
            {doctorView && isEditNotePage && (
                <div className={style.header__note}>
                    <NoteNameMenuItem />
                </div>
            )}
            <Typography className={style.typo}>
                {pathname === '/' ? 'Home' : currentRoute?.label}
            </Typography>
        </Box>
    );
};

export default NavBlock;
