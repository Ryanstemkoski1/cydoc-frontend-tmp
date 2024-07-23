import style from './AppointmentTemplates.module.scss';
import { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    Popover,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import React from 'react';

const tempData = [
    {
        header: 'Annual visit',
        body: [
            {
                title: 'Clinician',
                detail: 'Diabetes Form',
            },
            {
                title: 'Staff',
                detail: 'Evaluation Form',
            },
            {
                title: 'Patient',
                detail: 'Symptoms Today Form',
            },
            {
                title: 'Patient',
                detail: 'After Visit Survey',
            },
        ],
    },
    {
        header: 'Diabetes',
        body: [
            {
                title: 'Patient',
                detail: 'Form',
            },
            {
                title: 'Clinician',
                detail: 'Glucose Management Form',
            },
            {
                title: 'Patient',
                detail: 'After Visit Survey',
            },
        ],
    },
];

const AppointmentTemplatePage = () => {
    const [viewMoreOpen, setViewMoreOpen] = useState<number>(0);
    const [openedPopover, setOpenedPopover] = useState<number>(0);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [popupPosition, setPopupPosition] = React.useState({
        top: 0,
        left: 0,
    });

    const popupOpen = Boolean(anchorEl);
    const popupId = popupOpen
        ? `edit-apptTemp-popover ${openedPopover}`
        : undefined;

    const handleViewMoreOpen = (index: number) => {
        setViewMoreOpen(index);
    };

    const handleViewMoreClose = () => {
        setViewMoreOpen(0);
    };

    const handlePopupClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const elementRect = event.currentTarget.getBoundingClientRect();

        const popupPosTemp = { top: 0, left: 0 };
        popupPosTemp.top = elementRect.top - elementRect.height + 40;
        popupPosTemp.left = elementRect.left + elementRect.width - 140;

        setPopupPosition(popupPosTemp);
        setOpenedPopover(Number(event.currentTarget.id));

        setAnchorEl(event.currentTarget);
    };

    const handlePopupClose = () => {
        setAnchorEl(null);
    };

    const ViewMoreModal = () => (
        <Modal
            open={!!viewMoreOpen}
            onClose={handleViewMoreClose}
            aria-labelledby='viewMore-modal-title'
            aria-describedby='viewMore-modal-description'
        >
            <Box className={style.viewMoreModalWrapper}>
                <Box className={style.viewMoreModalWrapper__header}>
                    <Typography component='p'>
                        {tempData[viewMoreOpen - 1]?.header}
                    </Typography>
                    <IconButton>
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>
                <Box className={style.viewMoreModalWrapper__body}>
                    {tempData[viewMoreOpen - 1]?.body.map((item, idx) => (
                        <Box
                            key={idx}
                            className={style.viewMoreModalWrapper__body__item}
                        >
                            <Typography
                                component='p'
                                className={
                                    style.viewMoreModalWrapper__body__item__title
                                }
                            >
                                {item.title}
                            </Typography>
                            <Typography
                                component='p'
                                className={
                                    style.viewMoreModalWrapper__body__item__detail
                                }
                            >
                                {item.detail}
                            </Typography>
                        </Box>
                    ))}
                    <Box
                        className={
                            style.viewMoreModalWrapper__body__viewMoreModalBtn
                        }
                    >
                        <Button variant='outlined'>
                            <BorderColorRoundedIcon />
                            <span>Edit</span>
                        </Button>
                        <Button variant='outlined'>
                            <DeleteRoundedIcon />
                            <span>Delete</span>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );

    const PopoverBox = () => (
        <Popover
            id={popupId}
            open={popupOpen}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorReference='anchorPosition'
            anchorPosition={popupPosition}
            className={style.apptPopoverWrapper}
        >
            <List className={style.menuWrapper}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                            <BorderColorRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Edit'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                            <DeleteRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Delete'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Popover>
    );

    return (
        <Box className={style.apptTempWrapper}>
            {tempData.map((temp, index) => (
                <Box key={index} className={style.apptTempCard}>
                    <Box className={style.apptTempCard__header}>
                        <Typography component='p'>{temp.header}</Typography>
                        <IconButton onClick={handlePopupClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <PopoverBox />
                    </Box>
                    <Box className={style.apptTempCard__body}>
                        {temp.body.slice(0, 3).map((item, idx) => (
                            <Box
                                key={idx}
                                className={style.apptTempCard__body__item}
                            >
                                <Typography
                                    component='p'
                                    className={
                                        style.apptTempCard__body__item__title
                                    }
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    component='p'
                                    className={
                                        style.apptTempCard__body__item__detail
                                    }
                                >
                                    {item.detail}
                                </Typography>
                            </Box>
                        ))}
                        {temp.body.length > 3 && (
                            <Box
                                className={style.apptTempCard__body__viewMore}
                                onClick={() => handleViewMoreOpen(index + 1)}
                            >
                                <Link href=''>View all information</Link>
                                <ArrowForwardIosRoundedIcon />
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
            <Box className={style.newTemp}>
                <Box className={style.newBtn}>
                    <span>+</span>
                </Box>
                <Typography component='p'>Create a new template</Typography>
            </Box>
            <ViewMoreModal />
        </Box>
    );
};

export default AppointmentTemplatePage;
