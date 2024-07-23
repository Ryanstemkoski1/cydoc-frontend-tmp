import style from './AppointmentTemplates.module.scss';
import Link from 'next/link';
import { Box, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

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
                            <Box className={style.apptTempCard__body__viewMore}>
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
        </Box>
    );
};

export default AppointmentTemplatePage;
