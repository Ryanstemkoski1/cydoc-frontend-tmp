import style from './AppointmentTemplates.module.scss';
import React from 'react';
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
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import {
    TaskType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import { Icon } from '@components/Icon';
import SelectPlaceholder from '@components/SelectPlaceholder/SelectPlaceholder';

const ApptTempData = [
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
    const [tempData, setTempData] = useState(ApptTempData);
    const [viewMoreOpen, setViewMoreOpen] = useState<number>(0);
    const [openedPopover, setOpenedPopover] = useState<number>(0);
    const [stepCount, setStepCount] = useState<number>(1);
    const [createNewOpen, setCreateNewOpen] = useState<boolean>(false);
    const [selectedWhoCompletesValue, setSelectedWhoCompletesValue] =
        React.useState<(string | null)[]>(['']);
    const [selectedTaskTypeValue, setSelectedTaskTypeValue] = React.useState<
        (string | null)[]
    >(['']);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const [popupPosition, setPopupPosition] = React.useState({
        top: 0,
        left: 0,
    });

    // const popupOpen = Boolean(anchorEl);
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

    const handleWhoCompletesValue = (
        event: SelectChangeEvent<string | null>,
        index: number
    ) => {
        if (event.target.value === WhoCompletes.Cydoc_ai) {
            setSelectedTaskTypeValue((prevValues) => {
                const updatedValues = [...prevValues];
                updatedValues[index] =
                    TaskType.Synthesize_All_forms_into_Report;
                return updatedValues;
            });
        }

        setSelectedWhoCompletesValue((prevState) => {
            const newState = [...prevState];
            newState[index] = event.target.value;
            return newState;
        });
    };

    const handleTaskTypeValue = (
        event: SelectChangeEvent<string | null>,
        idx: number
    ) => {
        const newValue = event.target.value;
        setSelectedTaskTypeValue((prevValues) => {
            const updatedValues = [...prevValues];
            updatedValues[idx] = newValue;
            return updatedValues;
        });
    };

    const handleRemoveSteps = (idx: number) => {
        if (stepCount === 1) {
            return;
        }
        const whoCompletesTemp = [...selectedWhoCompletesValue];
        const taskTypeTemp = [...selectedTaskTypeValue];
        whoCompletesTemp.splice(idx, 1);
        taskTypeTemp.splice(idx, 1);

        setStepCount(stepCount - 1);
        setSelectedWhoCompletesValue(whoCompletesTemp);
        setSelectedTaskTypeValue(taskTypeTemp);
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

    const AppointmentTempStep = ({ idx }: { idx: number }) => (
        <Box className={style.createNewModalWrapper__body__stepWrapper}>
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
                        htmlFor={`demo-simple-select-label-${idx}`}
                    >
                        Who completes the task?
                    </Typography>
                    <SelectPlaceholder
                        idx={idx}
                        placeholder='Select'
                        items={Object.values(WhoCompletes)}
                        handleChange={handleWhoCompletesValue}
                        value={selectedWhoCompletesValue[idx] || ''}
                    />
                    {selectedWhoCompletesValue[idx] && (
                        <>
                            <Typography
                                component='label'
                                htmlFor={`task-type-select-label-${idx}`}
                            >
                                <span>Task type:</span>
                                <span
                                    style={{
                                        marginLeft: '10px',
                                        fontWeight: '400',
                                    }}
                                >
                                    {selectedTaskTypeValue[idx] ||
                                        TaskType.Smart_Form}
                                </span>
                            </Typography>
                            {selectedWhoCompletesValue[idx] !==
                                WhoCompletes.Cydoc_ai && (
                                <SelectPlaceholder
                                    idx={idx}
                                    placeholder='Select specific form'
                                    items={Object.values(TaskType)}
                                    handleChange={handleTaskTypeValue}
                                    value={selectedTaskTypeValue[idx] || ''}
                                />
                            )}
                        </>
                    )}
                </Box>
            </Box>
            {stepCount > 1 && (
                <IconButton onClick={() => handleRemoveSteps(idx)}>
                    <Icon type='trashCan' />
                </IconButton>
            )}
        </Box>
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
                    <IconButton onClick={handleCreateNewClose}>
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
                            variant='outlined'
                            placeholder='Enter'
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#0000003B',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#047A9B',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#047A9B',
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box
                        className={
                            style.createNewModalWrapper__body__stepsWrapper
                        }
                    >
                        {Array.from({ length: stepCount }).map((_, idx) => (
                            <AppointmentTempStep key={idx} idx={idx} />
                        ))}
                        <Box
                            className={
                                style.createNewModalWrapper__body__addNewStep
                            }
                            onClick={() => setStepCount(stepCount + 1)}
                        >
                            <Icon type='plusIcon' />
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
                    <ListItemButton>
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
        <Box className={style.apptTempWrapper}>
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
                    <Icon type='plusIcon' />
                </Box>
                <Typography component='p'>Create a new template</Typography>
            </Box>
            <ViewMoreModal />
            <CreateNewModal />
        </Box>
    );
};

export default AppointmentTemplatePage;
