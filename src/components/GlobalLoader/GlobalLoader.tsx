import React from 'react';
import style from './GlobalLoader.module.scss';

const GlobalLoader = () => {
    return (
        <div
            className={`${style.globalLoader} flex align-center justify-center`}
        >
            <span></span>
        </div>
    );
};
export default GlobalLoader;
