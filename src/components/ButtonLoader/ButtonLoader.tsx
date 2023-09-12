import React from 'react';
import style from './ButtonLoader.module.scss';
const ButtonLoader = () => {
    return (
        <div className={`${style.buttonLoader} flex align-center`}>
            <span className={style.buttonLoader__dots}></span>
            <span className={style.buttonLoader__dots}></span>
            <span className={style.buttonLoader__dots}></span>
        </div>
    );
};
export default ButtonLoader;
