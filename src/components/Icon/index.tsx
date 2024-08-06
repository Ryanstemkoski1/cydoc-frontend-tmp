import { SVGProps } from 'react';
import EditPencil from './icons/editPencil.svg';
import TrashCan from './icons/trashCan.svg';
import PlusIcon from './icons/add.svg';
import AwardStar from './icons/awardStar.svg';
import Encrypted from './icons/encrypted.svg';
import IDCard from './icons/idCard.svg';
import LogOut from './icons/logout.svg';

const iconRegistry = {
    editPencil: EditPencil,
    trashCan: TrashCan,
    plusIcon: PlusIcon,
    awardStar: AwardStar,
    encrypted: Encrypted,
    idCard: IDCard,
    logout: LogOut,
};

export type IconType = keyof typeof iconRegistry;

interface IconProps extends SVGProps<SVGSVGElement> {
    type: IconType;
}

export const Icon = ({ type, ...props }: IconProps) => {
    const SvgIcon = iconRegistry[type];
    return <SvgIcon {...props} />;
};
