import React from 'react';
import style from './InfoTooltip.module.scss';
import InfoIcon from '../../assets/images/info-green.svg';
export interface InfoTooltipProps {
    children: React.JSX.Element[] | React.JSX.Element;
    mobilePositionX?: number;
    mobilePositionY?: 'top' | 'bottom';
}

const InfoTooltip = ({
    children,
    mobilePositionX = 0,
    mobilePositionY = 'top',
}: InfoTooltipProps) => {
    return (
        <div className={style.infoTooltip}>
            <div className={style.infoTooltip__holder}>
                <img src={InfoIcon} alt='Info Icon' />
            </div>
            {children && (
                <div
                    className={`${style.infoTooltip__content} ${
                        mobilePositionY === 'bottom' ? style.isBottom : ''
                    }`}
                    style={{ marginLeft: `${mobilePositionX}px` }}
                >
                    <div
                        className={style.isArrow}
                        style={{ marginRight: `${mobilePositionX}px` }}
                    >
                        Arrow
                    </div>
                    {children}
                </div>
            )}
        </div>
    );
};
export default InfoTooltip;
