import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import style from './MenuButton.module.scss';

export interface MenuItem {
    label: string;
    to: string;
    icon: string;
    active: boolean;
    onClick?: () => void;
}

interface Props {
    label: string;
    icon?: string;
    to?: string;
    items?: MenuItem[] | null;
}

function MenuButton({ label, icon, to, items }: Props) {
    const history = useHistory();
    const [showMenuItems, setShowMenuItems] = useState(false);

    const menuItemRef = useRef<HTMLDivElement>(null);

    function handleMouseDown(e: any) {
        if (!menuItemRef.current?.contains(e.target)) {
            setShowMenuItems(false);
        }
    }

    useEffect(() => {
        if (showMenuItems)
            document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [showMenuItems]);

    return (
        <div className={style.profile} ref={menuItemRef}>
            <div
                className={`${style.profile__user} flex align-center`}
                onClick={() => {
                    if (to) return history.push(to);
                    setShowMenuItems(!showMenuItems);
                }}
            >
                {icon && <img src={icon} alt={label + ' icon'} />}
                <a
                    className={`flex align-center ${
                        showMenuItems ? style.active : ''
                    }`}
                >
                    <span>{label}</span>
                    {!!items && Boolean(label) && (
                        <img src={'/images/arrow-down.svg'} alt='arrow down' />
                    )}
                </a>
            </div>

            <div
                className={`${style.profile__item} ${
                    showMenuItems ? style.active : ''
                }`}
            >
                {items?.map((item) => {
                    return (
                        <a
                            className={`${
                                item.active ? style.active : ''
                            } flex align-center`}
                            key={item.label}
                            onClick={() => {
                                if (item.onClick) item.onClick();
                                if (item.to) history.push(item.to);
                                setShowMenuItems(false);
                            }}
                        >
                            <img src={item.icon} alt={item.label + ' icon'} />
                            {item.label}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default MenuButton;
