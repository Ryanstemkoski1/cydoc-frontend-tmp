import style from './AppointmentTemplates.module.scss';
import React from 'react';
import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Modal,
    Popover,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';

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
    const [createNewOpen, setCreateNewOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = React.useState('');
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

    const handleCreateNewOpen = () => {
        setCreateNewOpen(true);
    };

    const handleCreateNewClose = () => {
        setCreateNewOpen(false);
    };

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
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

    const CreateNewModal = () => (
        <Modal
            open={createNewOpen}
            onClose={handleCreateNewClose}
            aria-labelledby='createNew-modal-title'
            aria-describedby='createNew-modal-description'
        >
            <Box className={style.createNewModalWrapper}>
                <Box className={style.createNewModalWrapper__header}>
                    <Typography component='p'>
                        Create an appointment template
                    </Typography>
                    <IconButton>
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>
                <Box className={style.createNewModalWrapper__body}>
                    <Box
                        className={style.createNewModalWrapper__body__titleBox}
                    >
                        <Typography component='label' htmlFor='new-temp-title'>
                            Template title
                        </Typography>
                        <TextField
                            id='new-temp-title'
                            label='Enter'
                            variant='outlined'
                        />
                    </Box>
                    <Box
                        className={
                            style.createNewModalWrapper__body__stepsWrapper
                        }
                    >
                        <Box
                            className={
                                style.createNewModalWrapper__body__stepWrapper
                            }
                        >
                            <Box
                                className={
                                    style.createNewModalWrapper__body__stepWrapper__stepBox
                                }
                            >
                                <IconButton>
                                    <DragIndicatorRoundedIcon />
                                </IconButton>
                                <Box>
                                    <Typography
                                        component='label'
                                        htmlFor='demo-simple-select-label'
                                    >
                                        Who completes the task?
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        sx={{
                                            bgcolor: 'white',
                                        }}
                                    >
                                        <InputLabel id='demo-simple-select-label'>
                                            Select
                                        </InputLabel>
                                        <Select
                                            labelId='demo-simple-select-label'
                                            id='demo-simple-select'
                                            value={selectedValue}
                                            label='Select'
                                            onChange={handleSelectChange}
                                            IconComponent={
                                                KeyboardArrowDownRoundedIcon
                                            }
                                        >
                                            <MenuItem value={10}>
                                                Option 1
                                            </MenuItem>
                                            <MenuItem value={20}>
                                                Option 2
                                            </MenuItem>
                                            <MenuItem value={30}>
                                                Option 3
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <IconButton>
                                <DeleteRoundedIcon />
                            </IconButton>
                        </Box>
                        <Box
                            className={
                                style.createNewModalWrapper__body__addNewStep
                            }
                        >
                            <span>+</span>
                            <Typography component='p'>Add step</Typography>
                        </Box>
                    </Box>
                    <Box className={style.createNewModalWrapper__btn}>
                        <Button
                            variant='contained'
                            className={style.createNewModalWrapper__btn__create}
                        >
                            <span>Create template</span>
                        </Button>
                        <Button
                            variant='contained'
                            className={style.createNewModalWrapper__btn__save}
                        >
                            <span>Save</span>
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
            <Box className={style.newTemp} onClick={handleCreateNewOpen}>
                <Box className={style.newBtn}>
                    <span>+</span>
                </Box>
                <Typography component='p'>Create a new template</Typography>
            </Box>
            <ViewMoreModal />
            <CreateNewModal />
        </Box>
    );
};

export default AppointmentTemplatePage;
