import style from './AppointmentTemplates.module.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@components/Icon';
import {
    Box,
    Button,
    CircularProgress,
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
import useUser from '@hooks/useUser';
import {
    deleteInstitutionAppointmentTemplate,
    getInstitutionAppointmentTemplates,
} from '@modules/institution-api';
import { toast } from 'react-toastify';
import ToastOptions from '@constants/ToastOptions';
import useAuth from '@hooks/useAuth';
import { ApiResponse, AppointmentTemplate } from '@cydoc-ai/types';
import { hpiHeaders as knowledgegraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';

const AppointmentTemplatePage = () => {
    const { windowWidth } = useDimensions();
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<AppointmentTemplate[]>([]);
    const [allDiseaseForms, setAllDiseaseForms] = useState<DiseaseForm[]>([]);
    const [viewMoreOpen, setViewMoreOpen] = useState<number>(0);
    const [openedPopover, setOpenedPopover] = useState<number>(0);
    const [createNewOpen, setCreateNewOpen] = useState<boolean>(false);
    const [editApptTempIndex, setEditApptTempIndex] = useState<number>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const { user } = useUser();
    const { cognitoUser } = useAuth();

    const [popupPosition, setPopupPosition] = React.useState({
        top: 0,
        left: 0,
    });

    const gridColumns = useMemo(
        () => Math.floor(windowWidth / 400),
        [windowWidth]
    );

    const popupId = openedPopover > 0 ? 'edit-apptTemp-popover' : undefined;

    const loadAllDiseaseForms = useCallback(async () => {
        try {
            const response = await knowledgegraphAPI;
            const diseaseForms = Object.entries(response.data.parentNodes).map(
                ([key, value]) =>
                    ({
                        id: '',
                        diseaseKey: Object.keys(value as object)?.[0],
                        diseaseName: key,
                        isDeleted: false,
                    }) as DiseaseForm
            );

            setAllDiseaseForms(diseaseForms);
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
        }
    }, []);

    const loadTemplates = useCallback(async () => {
        if (!user || !cognitoUser) return;
        try {
            const templates = await getInstitutionAppointmentTemplates(
                user.institutionId,
                cognitoUser
            );
            setTemplates(templates);
        } catch (error: unknown) {
            toast.error('Something went wrong.', ToastOptions.error);
            setTemplates([]);
        }
    }, [user, cognitoUser]);

    const getFormInfo = (formCategory: string) => {
        return allDiseaseForms.find((form) => form.diseaseKey === formCategory);
    };

    const onMount = useCallback(async () => {
        if (!user || !cognitoUser) return;
        setLoading(true);
        await Promise.all([loadTemplates(), loadAllDiseaseForms()]);
        setLoading(false);
    }, [user, cognitoUser, loadTemplates, loadAllDiseaseForms]);

    useEffect(() => {
        onMount();
    }, [onMount]);

    const handleViewMoreOpen = (index: number) => {
        setViewMoreOpen(index);
    };

    const handleViewMoreClose = () => {
        setViewMoreOpen(0);
    };

    const handleCreateNewOpen = () => {
        setCreateNewOpen(true);
    };

    const handleCreateNewClose = async () => {
        loadTemplates();
        setCreateNewOpen(false);
        setEditApptTempIndex(undefined);
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

    const handleApptTemplateDelete = async () => {
        const deleteResponse = await deleteInstitutionAppointmentTemplate(
            user!.institutionId,
            templates[openedPopover - 1].id,
            cognitoUser!
        );
        if ((deleteResponse as ApiResponse).errorMessage) {
            toast.error(
                'Template is in use, cannot be deleted.',
                ToastOptions.error
            );
        }
        await loadTemplates();
        setOpenedPopover(0);
        handlePopupClose();
    };

    const handleApptTemplateDeleteOnViewMore = async () => {
        const deleteResponse = await deleteInstitutionAppointmentTemplate(
            user!.institutionId,
            templates[viewMoreOpen - 1].id,
            cognitoUser!
        );
        if ((deleteResponse as ApiResponse).errorMessage) {
            toast.error(
                'Template is in use, cannot be deleted.',
                ToastOptions.error
            );
        }
        await loadTemplates();
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
                        {templates[viewMoreOpen - 1]?.templateTitle}
                    </Typography>
                    <IconButton onClick={handleViewMoreClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>
                <Box className={style.viewMoreModalWrapper__body}>
                    {(templates[viewMoreOpen - 1]?.steps || []).map(
                        (item, idx) => (
                            <Box
                                key={idx}
                                className={
                                    style.viewMoreModalWrapper__body__item
                                }
                            >
                                <Typography
                                    component='p'
                                    className={
                                        style.viewMoreModalWrapper__body__item__title
                                    }
                                >
                                    {item.completedBy}
                                </Typography>
                                <Typography
                                    component='p'
                                    className={
                                        style.viewMoreModalWrapper__body__item__detail
                                    }
                                >
                                    {item.formCategory || item.taskType}
                                </Typography>
                            </Box>
                        )
                    )}
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            className={style.apptTempWrapper}
            sx={{
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            }}
        >
            {templates.map((temp, index) => (
                <Box key={index} className={style.apptTempCard}>
                    <Box className={style.apptTempCard__header}>
                        <Typography component='p'>
                            {temp.templateTitle}
                        </Typography>
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
                        {(temp.steps || []).slice(0, 3).map((item, idx) => {
                            const formInfo = getFormInfo(item.formCategory);
                            return (
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
                                        {item.completedBy}
                                    </Typography>
                                    <Typography
                                        component='p'
                                        className={
                                            style.apptTempCard__body__item__detail
                                        }
                                    >
                                        {formInfo?.diseaseName || item.taskType}
                                    </Typography>
                                </Box>
                            );
                        })}
                        {temp.steps && temp.steps.length > 3 && (
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
                appointmentTempData={templates}
                setAppointmentTempData={setTemplates}
                editAppointmentTempIndex={editApptTempIndex}
            />
        </Box>
    );
};

export default AppointmentTemplatePage;
