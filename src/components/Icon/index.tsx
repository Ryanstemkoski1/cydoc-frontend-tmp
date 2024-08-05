import { SVGProps } from 'react';
import EditPencil from './icons/editPencil.svg';
import TrashCan from './icons/trashCan.svg';
import PlusIcon from './icons/add.svg';

const iconRegistry = {
    editPencil: EditPencil,
    trashCan: TrashCan,
    plusIcon: PlusIcon,
};

export type IconType = keyof typeof iconRegistry;

interface IconProps extends SVGProps<SVGSVGElement> {
    type: IconType;
}

export const Icon = ({ type, ...props }: IconProps) => {
    const SvgIcon = iconRegistry[type];
    return <SvgIcon {...props} />;
};
