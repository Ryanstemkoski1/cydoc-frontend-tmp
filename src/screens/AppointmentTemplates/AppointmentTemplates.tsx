import style from './AppointmentTemplates.module.scss';
import { useState } from 'react';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

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

    const handleViewMoreOpen = (index: number) => {
        setViewMoreOpen(index);
    };

    const handleViewMoreClose = () => {
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

    return (
        <Box className={style.apptTempWrapper}>
            {tempData.map((temp, index) => (
                <Box key={index} className={style.apptTempCard}>
                    <Box className={style.apptTempCard__header}>
                        <Typography component='p'>{temp.header}</Typography>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
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
