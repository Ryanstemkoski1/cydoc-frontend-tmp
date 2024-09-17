'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useUser from '@hooks/useUser';
import style from './DrawerMenu.module.scss';
import { Divider, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AccountManagement from '@components/AccountManagement/AccountManagement';
import useAuth from '@hooks/useAuth';
import { selectProductDefinitions } from '@redux/selectors/productDefinitionSelector';
import {
    clinicalWorkflowItems,
    MenuItem,
    MenuTitles,
    practiceAdminMenuItems,
} from '@constants/drawerMenuItems';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

export default function DrawerMenu() {
    const definitions = useSelector(selectProductDefinitions);
    const router = useRouter();
    const { signOut } = useAuth();
    const { user, isManager } = useUser();
    const [open, setOpen] = React.useState(true);

    const customPracticeAdminMenuItems = useMemo(
        () =>
            definitions?.showAppointmentTemplates
                ? practiceAdminMenuItems
                : practiceAdminMenuItems.filter(
                      (item) => item.label !== 'Appointment Templates'
                  ),
        [definitions]
    );

    const customClinicalWorkflowItems = useMemo(
        () =>
            definitions?.showClinicQRCodeAndLink
                ? clinicalWorkflowItems
                : clinicalWorkflowItems.filter(
                      (item) => item.label !== 'Clinic QR Code & Link'
                  ),
        [definitions]
    );

    const drawerWidth = open ? '300px' : '64px';

    const onClickLink = (href: string) => {
        if (href) {
            if (href === 'logout') {
                signOut();
                return;
            }

            router.push(href);
        }
    };

    const MenuItemList = ({
        menuTitle,
        menuItems,
    }: {
        menuTitle: string;
        menuItems: MenuItem[];
    }) => {
        return !open ? (
            <List className={style.miniMenu}>
                {menuItems.map((item, index) => (
                    <ListItem key={item.label + index} disablePadding>
                        <ListItemButton onClick={() => onClickLink(item.href)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        ) : (
            <Box className={style.menuItemWrapper}>
                <Typography className={style.menuItemWrapper__title}>
                    {menuTitle}
                </Typography>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.label + index} disablePadding>
                            <ListItemButton
                                onClick={() => onClickLink(item.href)}
                            >
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    return (
        <Box className={`${style.drawerBoxContainer}`}>
            <Drawer
                variant='permanent'
                open={open}
                sx={{
                    width: drawerWidth,
                    borderRight: '1px solid #D7E5E9',
                    '& .MuiDrawer-paper': {
                        position: 'relative',
                        zIndex: '20',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '24px 0 32px',
                        width: drawerWidth,
                    },
                }}
            >
                <Box>
                    <DrawerHeader sx={{ p: 0, justifyContent: 'flex-start' }}>
                        {!open ? (
                            <Box className={style.miniHeader}>
                                <Image
                                    height={32}
                                    width={32}
                                    alt='Cydoc'
                                    src='/images/cydoc-logo.svg'
                                    onClick={() => router.push('/')}
                                />
                                <IconButton
                                    className={style.headerWrapper__iconButton}
                                    onClick={() => setOpen(true)}
                                >
                                    <KeyboardDoubleArrowRightRoundedIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Box className={style.headerWrapper}>
                                <Box
                                    className={style.headerWrapper__logoBox}
                                    onClick={() => router.push('/')}
                                >
                                    <Image
                                        height={54}
                                        width={54}
                                        src='/images/cydoc-logo.svg'
                                        alt='Cydoc'
                                    />
                                    <Typography
                                        className={
                                            style.headerWrapper__logoBox__title
                                        }
                                    >
                                        Cydoc
                                    </Typography>
                                </Box>
                                <IconButton
                                    className={style.headerWrapper__iconButton}
                                    onClick={() => setOpen((prev) => !prev)}
                                >
                                    <KeyboardDoubleArrowLeftRoundedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </DrawerHeader>

                    <Box
                        className={open ? style.drawerBox : style.miniDrawerBox}
                    >
                        <MenuItemList
                            menuTitle={MenuTitles.CLINICAL_WORKFLOW}
                            menuItems={customClinicalWorkflowItems}
                        />
                        {!open && <Divider className={style.drawerDivider} />}
                        {isManager && (
                            <MenuItemList
                                menuTitle={MenuTitles.PRACTICE_ADMINISTRATION}
                                menuItems={customPracticeAdminMenuItems}
                            />
                        )}
                    </Box>
                </Box>

                {user && (
                    <AccountManagement
                        drawerOpen={open}
                        onClickLink={onClickLink}
                    />
                )}
            </Drawer>
        </Box>
    );
}
