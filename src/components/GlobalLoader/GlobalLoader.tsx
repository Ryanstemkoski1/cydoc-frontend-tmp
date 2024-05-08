'use client';
import React from 'react';
import style from './GlobalLoader.module.scss';
import useUser from '@hooks/useUser';
import useAuth from '@hooks/useAuth';
import { selectLoadingStatus } from '@redux/reducers/loadingStatusReducer';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
    const loadingStatus = useSelector(selectLoadingStatus);
    const { authLoading } = useAuth();
    const { loading: userLoading } = useUser();

    return (
        (authLoading || loadingStatus || userLoading) && (
            <div
                className={`${style.globalLoader} flex align-center justify-center`}
            >
                <span></span>
            </div>
        )
    );
};
export default GlobalLoader;
