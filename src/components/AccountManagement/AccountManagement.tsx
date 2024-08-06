import React from 'react';
import style from './AccountManagement.module.scss';

import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useUser from '@hooks/useUser';
import { getAvatarLetters } from './AccountManagement.helper';
import { accountMenuItems } from '@constants/drawerMenuItems';

const AccountManagement = ({
    drawerOpen,
    onClickLink,
}: {
    drawerOpen: boolean;
    onClickLink: (href: string) => void;
}) => {
    const { user } = useUser();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [popupPosition, setPopupPosition] = React.useState({
        top: 0,
        left: 0,
    });

    const handlePopupClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const elementRect = event.currentTarget.getBoundingClientRect();

        const popupPosTemp = { top: 0, left: 0 };
        popupPosTemp.top = elementRect.top - elementRect.height - 140;
        popupPosTemp.left = elementRect.left + elementRect.width - 20;

        setPopupPosition(popupPosTemp);
        setAnchorEl(event.currentTarget);
    };

    const handlePopupClose = () => {
        setAnchorEl(null);
    };

    const popupOpen = Boolean(anchorEl);
    const popupId = popupOpen ? 'simple-popover' : undefined;

    const avatarLetters = getAvatarLetters({
        firstName: user?.firstName,
        lastName: user?.lastName,
    });

    const PopoverBox = () => (
        <Popover
            id={popupId}
            open={popupOpen}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorReference='anchorPosition'
            anchorPosition={popupPosition}
            className={style.popoverWrapper}
        >
            <List className={style.menuWrapper}>
                {accountMenuItems.map((item, index) => (
                    <ListItem key={item.label + index} disablePadding>
                        <ListItemButton onClick={() => onClickLink(item.href)}>
                            <ListItemIcon sx={{ minWidth: '32px' }}>
                                {item.icon && React.createElement(item.icon)}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Popover>
    );

    return !drawerOpen ? (
        <Box className={style.miniWrapper}>
            <Avatar
                className={style.miniAvatar}
                sx={{ mx: 1.5 }}
                component='button'
                aria-describedby={popupId}
                onClick={handlePopupClick}
            >
                {avatarLetters}
            </Avatar>
            <PopoverBox />
        </Box>
    ) : (
        <Box className={`flex align-center justify-between ${style.wrapper}`}>
            <Box className='flex align-center' sx={{ gap: 1 }}>
                <Avatar className={style.avatar}>{avatarLetters}</Avatar>
                <Box
                    className={`flex flex-col justify-center ${style.userName}`}
                >
                    <Typography className={style.userName__name}>
                        {user?.firstName} {user?.lastName.charAt(0)}.
                    </Typography>
                    <Typography className={style.userName__role}>
                        {user?.institutionName}
                    </Typography>
                </Box>
            </Box>
            <IconButton aria-describedby={popupId} onClick={handlePopupClick}>
                <MoreVertIcon />
            </IconButton>
            <PopoverBox />
        </Box>
    );
};

export default AccountManagement;
