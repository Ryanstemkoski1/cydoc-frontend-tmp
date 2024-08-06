import { ProductType, ViewType } from '@constants/enums/route.enums';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SecurityIcon from '@mui/icons-material/Security';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';

export interface MenuItem {
    label: string;
    href: string;
    icon: React.ElementType | null;
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
        icon: DescriptionRoundedIcon,
    },
    {
        href: '/qrcode',
        label: 'Clinic QR Code & Link',
        icon: QrCode2RoundedIcon,
    },
];

export const practiceAdminMenuItems: MenuItem[] = [
    {
        href: '/form-preferences',
        label: 'Form Templates',
        icon: ArticleRoundedIcon,
    },
    {
        href: '/appointment-templates',
        label: 'Appointment Templates',
        icon: CollectionsBookmarkRoundedIcon,
    },
    {
        href: '/form-preferences',
        label: 'Product Settings',
        icon: SettingsRoundedIcon,
    },
    {
        href: '/manager-dashboard',
        label: 'Manage Users',
        icon: PeopleAltRoundedIcon,
    },
    {
        href: '/subscription',
        label: 'Subscription',
        icon: SecurityIcon,
    },
];

export const accountMenuItems: MenuItem[] = [
    {
        href: '/editprofile',
        label: 'Edit Name or Phone',
        icon: ContactEmergencyRoundedIcon,
    },
    {
        href: '/profilesecurity',
        label: 'Change Password',
        icon: GppMaybeRoundedIcon,
    },
    {
        href: 'logout',
        label: 'Log Out',
        icon: LoginRoundedIcon,
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
