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
    icon: JSX.Element | null;
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
        href: '/templates/edit',
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
    {
        href: '/logo-settings',
        label: 'Logo Settings',
        icon: <Icon type='uploadLogo' />,
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

export const pageRoutes: MenuItem[] = [
    {
        href: '/forgot-password',
        label: 'Forgot Password',
        icon: null,
    },
    {
        href: '/privacypolicy',
        label: 'Privacy Policy',
        icon: null,
    },
    {
        href: '/termsandconditions',
        label: 'Terms and Conditions',
        icon: null,
    },
    {
        href: '/view/product',
        label: 'Product View',
        icon: null,
    },
    {
        href: '/templates/new',
        label: 'New History of Present Illness Template',
        icon: null,
    },
    {
        href: '/templates/old',
        label: 'Existing History of Present Illness Template',
        icon: null,
    },
    {
        href: '/templates/edit',
        label: 'History of Present Illness Template',
        icon: null,
    },
];
