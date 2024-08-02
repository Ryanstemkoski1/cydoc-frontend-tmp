import style from './AppointmentTemplates.module.scss';
import React, { useMemo, useState } from 'react';
import { Icon } from '@components/Icon';
import {
    AppointmentTemplateType,
    FormType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
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
import CreateNewModal from './CreateNewModal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import useDimensions from '@hooks/useDimensions';

const ApptTempData: AppointmentTemplateType[] = [
    {
        header: 'Annual visit',
        body: [
            {
                whoCompletes: WhoCompletes.Clinician,
                form: FormType.Diabetes,
            },
            {
                whoCompletes: WhoCompletes.Staff,
                form: FormType.Evaluation,
            },
            {
                whoCompletes: WhoCompletes.Patient,
                form: FormType.Symptoms_Today,
            },
            {
                whoCompletes: WhoCompletes.Patient,
                form: FormType.After_Visit_Survey,
            },
        ],
    },
    {
        header: 'Diabetes',
        body: [
            {
                whoCompletes: WhoCompletes.Patient,
                form: FormType.Form,
            },
            {
                whoCompletes: WhoCompletes.Clinician,
                form: FormType.Glucose_Management,
            },
            {
                whoCompletes: WhoCompletes.Patient,
                form: FormType.After_Visit_Survey,
            },
        ],
    },
];

const AppointmentTemplatePage = () => {
    const { windowWidth } = useDimensions();
    const [tempData, setTempData] = useState(ApptTempData);
    const [viewMoreOpen, setViewMoreOpen] = useState<number>(0);
    const [openedPopover, setOpenedPopover] = useState<number>(0);
    const [createNewOpen, setCreateNewOpen] = useState<boolean>(false);
    const [editApptTempIndex, setEditApptTempIndex] = useState<number>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [popupPosition, setPopupPosition] = React.useState({
        top: 0,
        left: 0,
    });

    const gridColumns = useMemo(
        () => Math.floor(windowWidth / 400),
        [windowWidth]
    );

    const popupId = openedPopover > 0 ? 'edit-apptTemp-popover' : undefined;

    const handleViewMoreOpen = (index: number) => {
        setViewMoreOpen(index);
    };

    const handleViewMoreClose = () => {
        setViewMoreOpen(0);
    };

    const handleCreateNewOpen = () => {
        setCreateNewOpen(true);
    };

    const handleCreateNewClose = () => {
        setCreateNewOpen(false);
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
        setOpenedPopover(0);
    };

    const handleApptTemplateEdit = () => {
        setEditApptTempIndex(openedPopover);
        setOpenedPopover(0);
        handlePopupClose();
        handleCreateNewOpen();
    };

    const handleApptTemplateEditOnViewMore = () => {
        setEditApptTempIndex(viewMoreOpen);
        setViewMoreOpen(0);
        handleViewMoreClose();
        handleCreateNewOpen();
    };

    const handleApptTemplateDelete = () => {
        const tempDataTemp = [...tempData];
        tempDataTemp.splice(openedPopover - 1, 1);
        setTempData(tempDataTemp);
        setOpenedPopover(0);
        handlePopupClose();
    };

    const handleApptTemplateDeleteOnViewMore = () => {
        const tempDataTemp = [...tempData];
        tempDataTemp.splice(viewMoreOpen - 1, 1);
        setTempData(tempDataTemp);
        setViewMoreOpen(0);
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
                    <IconButton onClick={handleViewMoreClose}>
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
                                {item.whoCompletes}
                            </Typography>
                            <Typography
                                component='p'
                                className={
                                    style.viewMoreModalWrapper__body__item__detail
                                }
                            >
                                {item.form}
                            </Typography>
                        </Box>
                    ))}
                    <Box
                        className={
                            style.viewMoreModalWrapper__body__viewMoreModalBtn
                        }
                    >
                        <Button
                            variant='outlined'
                            onClick={handleApptTemplateEditOnViewMore}
                        >
                            <Icon type='editPencil' />
                            <span>Edit</span>
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={handleApptTemplateDeleteOnViewMore}
                        >
                            <Icon type='trashCan' />
                            <span>Delete</span>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );

    const PopoverBox = ({ idx }: { idx: number }) => (
        <Popover
            id={popupId}
            key={idx}
            open={!!openedPopover && openedPopover === idx + 1}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorReference='anchorPosition'
            anchorPosition={popupPosition}
            className={style.apptPopoverWrapper}
        >
            <List className={style.menuWrapper}>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleApptTemplateEdit}>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                            <Icon type='editPencil' />
                        </ListItemIcon>
                        <ListItemText primary={'Edit'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleApptTemplateDelete}>
                        <ListItemIcon sx={{ minWidth: '32px' }}>
                            <Icon type='trashCan' />
                        </ListItemIcon>
                        <ListItemText primary={'Delete'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Popover>
    );

    return (
        <Box
            className={style.apptTempWrapper}
            sx={{
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            }}
        >
            {tempData.map((temp, index) => (
                <Box key={index} className={style.apptTempCard}>
                    <Box className={style.apptTempCard__header}>
                        <Typography component='p'>{temp.header}</Typography>
                        <IconButton
                            id={`${index + 1}`}
                            onClick={handlePopupClick}
                        >
                            <MoreVertIcon
                                sx={
                                    openedPopover === index + 1
                                        ? {
                                              fill: '#047A9B',
                                          }
                                        : {}
                                }
                            />
                        </IconButton>
                        <PopoverBox idx={index} />
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
                                    {item.whoCompletes}
                                </Typography>
                                <Typography
                                    component='p'
                                    className={
                                        style.apptTempCard__body__item__detail
                                    }
                                >
                                    {item.form}
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
            <Box className={style.newTemp} onClick={handleCreateNewOpen}>
                <Box className={style.newBtn}>
                    <Icon type='plusIcon' />
                </Box>
                <Typography component='p'>Create a new template</Typography>
            </Box>
            <ViewMoreModal />
            <CreateNewModal
                open={createNewOpen}
                handleClose={handleCreateNewClose}
                appointmentTempData={tempData}
                setAppointmentTempData={setTempData}
                editAppointmentTempIndex={editApptTempIndex}
            />
        </Box>
    );
};

export default AppointmentTemplatePage;
