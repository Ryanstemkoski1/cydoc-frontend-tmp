import style from './LightTooltip.module.scss';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

const LightTooltip = ({ title }: { title: string }) => {
    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip
            {...props}
            classes={{ popper: className }}
            className={style.lightTooltipWrapper}
            arrow
        />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            padding: '8px',
            color: 'rgba(0, 0, 0, .87)',
            boxShadow: '0 0 4px 0px rgba(0, 0, 0, 0.2)',
            backgroundColor: theme.palette.common.white,
            fontSize: 10,
            fontFamily: 'Nunito',
            fontWeight: '500',
            lineHeight: '14px',
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: 'white',
            '&::before': {
                boxShadow: '0 0 4px 0px rgba(0, 0, 0, 0.2)',
            },
        },
    }));

    return (
        <CustomTooltip title={title} placement='top'>
            <InfoIcon />
        </CustomTooltip>
    );
};

export default LightTooltip;
