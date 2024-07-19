'use client';

import style from './NavBlock.module.scss';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import {
    accountMenuItems,
    clinicalWorkflowItems,
    practiceAdminMenuItems,
} from '@constants/drawerMenuItems';

const NavBlock = () => {
    const pathname = usePathname();

    const menuItems = [
        ...clinicalWorkflowItems,
        ...practiceAdminMenuItems,
        ...accountMenuItems,
    ];

    const currentRoute = menuItems.find((item) => item.href.includes(pathname));

    return (
        <Box className={style.wrapper}>
            <Typography className={style.typo}>
                {pathname === '/' ? 'Home' : currentRoute?.label}
            </Typography>
        </Box>
    );
};

export default NavBlock;
