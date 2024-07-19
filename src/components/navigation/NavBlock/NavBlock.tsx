'use client';

import style from './NavBlock.module.scss';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

type RouteItem = {
    path: string;
    label: string;
};

const Routes: RouteItem[] = [
    {
        path: '/',
        label: 'Home',
    },
    {
        path: '/hpi/doctor',
        label: 'Generated Notes',
    },
    {
        path: '/qrcode',
        label: 'Clinic QR Code & Link',
    },
    {
        path: '/form-preferences',
        label: 'Product Settings',
    },
    {
        path: '/appointment-templates',
        label: 'Appointment Templates',
    },
    {
        path: '/manager-dashboard',
        label: 'Manage Users',
    },
    {
        path: '/subscription',
        label: 'Subscription',
    },
    {
        path: '/editprofile',
        label: 'Edit Name or Phone',
    },
    {
        path: '/profilesecurity',
        label: 'Change Password',
    },
];

const NavBlock = () => {
    const pathname = usePathname();

    const currentRoute = Routes.find((route) => route.path.includes(pathname));

    return (
        <Box className={style.wrapper}>
            <Typography className={style.typo}>
                {currentRoute?.label ?? 'Home'}
            </Typography>
        </Box>
    );
};

export default NavBlock;
