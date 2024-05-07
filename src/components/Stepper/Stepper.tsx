import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import style from './Stepper.module.scss';

export default function Stepper({
    tabs,
    onTabChange,
}: {
    tabs: string[];
    onTabChange: (val: string) => void;
}) {
    const activeItem = useSelector(selectActiveItem);
    return (
        <div className={`${style.stepper} scrollbar flex justify-between`}>
            {tabs.map((tab, index) => {
                return (
                    <div className={style.stepper__item} key={index}>
                        <span
                            onClick={() => onTabChange(tab)}
                            className={`${
                                activeItem == tab ? style.active : ''
                            }`}
                        >
                            {index + 1}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
