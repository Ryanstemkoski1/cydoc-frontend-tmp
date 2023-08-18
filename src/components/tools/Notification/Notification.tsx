import React from 'react';
import AlertIconSuccess from '../../../assets/images/check-circle.svg';
import AlertIcon from '../../../assets/images/alert.svg';
import style from './Notification.module.scss';
interface NotificationProps {
    message: string;
    type?: NotificationType;
}

export type NotificationType = 'error' | 'success';

export enum NotificationTypeEnum {
    ERROR = 'error',
    SUCCESS = 'success',
}

const Notification = ({ message = '', type = 'error' }: NotificationProps) => {
    return (
        <div
            className={`${style.notification} flex ${
                type == 'success' ? style.isSuccess : ''
            }`}
        >
            <img
                src={type == 'error' ? AlertIcon : AlertIconSuccess}
                alt='Info'
            />
            <p>{message}</p>
        </div>
    );
};
export default Notification;
