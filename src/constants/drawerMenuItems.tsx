import { Icon } from '@components/Icon';
import { ProductType, ViewType } from '@constants/enums/route.enums';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';

export interface MenuItem {
    label: string;
    href: string;
    icon: JSX.Element;
    onClick?: () => void;
}

export enum MenuTitles {
    CLINICAL_WORKFLOW = 'Clinical Workflow',
    PRACTICE_ADMINISTRATION = 'Practice Administration',
    MY_ACCOUNT = 'My Account',
}

export const clinicalWorkflowItems: MenuItem[] = [
    {
        href: `/${ProductType.HPI}/${ViewType.DOCTOR}`,
        label: 'Generated Notes',
        icon: <DescriptionRoundedIcon />,
    },
    {
        href: '/qrcode',
        label: 'Clinic QR Code & Link',
        icon: <QrCode2RoundedIcon />,
    },
];

export const practiceAdminMenuItems: MenuItem[] = [
    {
        href: '/form-preferences',
        label: 'Form Templates',
        icon: <ArticleRoundedIcon />,
    },
    {
        href: '/appointment-templates',
        label: 'Appointment Templates',
        icon: <CollectionsBookmarkRoundedIcon />,
    },
    {
        href: '/form-preferences',
        label: 'Product Settings',
        icon: <SettingsRoundedIcon />,
    },
    {
        href: '/manager-dashboard',
        label: 'Manage Users',
        icon: <Icon type='userGroup' />,
    },
    {
        href: '/subscription',
        label: 'Subscription',
        icon: <Icon type='awardStar' />,
    },
];

export const accountMenuItems: MenuItem[] = [
    {
        href: '/editprofile',
        label: 'Edit Name or Phone',
        icon: <Icon type='idCard' />,
    },
    {
        href: '/profilesecurity',
        label: 'Change Password',
        icon: <Icon type='encrypted' />,
    },
    {
        href: 'logout',
        label: 'Log Out',
        icon: <Icon type='logout' />,
    },
];
