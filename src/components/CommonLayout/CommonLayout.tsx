import React from 'react';
import style from './CommonLayout.module.scss';
interface CommonLayoutProps {
    title: string;
    children: any;
}
const CommonLayout = ({ title = '', children }: CommonLayoutProps) => {
    return (
        <div className='centering'>
            <div className={style.commonLayout}>
                {title && (
                    <div className={style.commonLayout__header}>{title}</div>
                )}
                {children && (
                    <div className={style.commonLayout__content}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};
export default CommonLayout;
