import React, { useEffect } from 'react';
import style from './CustomModal.module.scss';

export interface CustomModalProps {
    title?: JSX.Element;
    headerShow?: boolean;
    children: any;
    footerNode?: any;
    maxWidth?: string;
    modalVisible: boolean;
    onClose: () => void;
}

const CustomModal = ({
    title = <></>,
    headerShow = true,
    children,
    footerNode,
    maxWidth = '700px',
    modalVisible = false,
    onClose,
}: CustomModalProps) => {
    useEffect(() => {
        const body = document.body;
        if (modalVisible) body.classList.add('isHidden');
        return () => {
            body.classList.remove('isHidden');
        };
    }, [modalVisible]);
    return (
        <div className={`${style.customModal} ${modalVisible && style.active}`}>
            <div
                className={style.customModal__backdrop}
                onClick={onClose}
            ></div>
            <div
                className={style.customModal__content}
                style={{ maxWidth: maxWidth }}
            >
                {headerShow && (
                    <header
                        className={`${style.customModal__header} flex align-center justify-between`}
                    >
                        {title}
                    </header>
                )}

                <div className={style.customModal__inner}>{children}</div>

                {footerNode && (
                    <footer
                        className={`${style.customModal__footer} flex justify-end`}
                    >
                        {footerNode}
                    </footer>
                )}
            </div>
        </div>
    );
};
export default CustomModal;
