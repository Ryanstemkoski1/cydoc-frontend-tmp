import { SVGProps } from 'react';
import { ReactComponent as EditPencil } from './icons/editPencil.svg';
import { ReactComponent as TrashCan } from './icons/trashCan.svg';

const iconRegistry = {
    editPencil: EditPencil,
    trashCan: TrashCan,
};

export type IconType = keyof typeof iconRegistry;

interface IconProps extends SVGProps<SVGSVGElement> {
    type: IconType;
}

export const Icon = ({ type, ...props }: IconProps) => {
    const SvgIcon = iconRegistry[type];
    return <SvgIcon {...props} />;
};
