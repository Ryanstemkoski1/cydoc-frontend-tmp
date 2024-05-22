'use client';
import { ProductType, ViewType } from '@constants/enums/route.enums';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from './ViewProduct.module.scss';

export default function ViewProduct() {
    const [product, setProduct] = useState(ProductType.EHR);
    const [view, setView] = useState(ViewType.DOCTOR);

    const router = useRouter();

    const navigateTo = () => {
        const path = `/${product}/${view}`;
        router.push(path);
    };

    return (
        <>
            <div className={` ${style.viewForm} flex-wrap justify-center`}>
                <div className={style.viewForm__inner}>
                    <div className={style.viewForm__content}>
                        <h2>Which view would you like to see?</h2>
                        <p>Choose One Option</p>
                        <div
                            className={` ${style.viewForm__tabs} flex-wrap align-center`}
                        >
                            <a
                                className={`${style.patient} ${
                                    view === ViewType.PATIENT
                                        ? style.active
                                        : ''
                                } flex align-center`}
                                onClick={() => {
                                    setView(ViewType.PATIENT);
                                }}
                            >
                                <span className='flex align-center justify-center'>
                                    <img
                                        alt='patient'
                                        src={'/images/patient.svg'}
                                    />
                                </span>
                                Patient View
                            </a>

                            <a
                                className={` ${style.doctor} ${
                                    view === ViewType.DOCTOR ? style.active : ''
                                } flex align-center`}
                                onClick={() => {
                                    setView(ViewType.DOCTOR);
                                }}
                            >
                                <span className='flex align-center justify-center'>
                                    <img
                                        alt='doctor'
                                        src={'/images/doctor.svg'}
                                    />
                                </span>
                                Doctor View
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2>Which product would you like to see?</h2>
                        <p>Choose One Option</p>
                        <div
                            className={` ${style.viewForm__tabs} flex-wrap align-center`}
                        >
                            <a
                                className={`${style.medical} ${
                                    product === ProductType.EHR
                                        ? style.active
                                        : ''
                                } flex align-center`}
                                onClick={() => {
                                    setProduct(ProductType.EHR);
                                }}
                            >
                                <span className='flex align-center justify-center'>
                                    <img
                                        alt='medical app'
                                        src={'/images/medical-app.svg'}
                                    />
                                </span>
                                EHR
                            </a>
                            <a
                                className={` ${style.record} ${
                                    product === ProductType.HPI
                                        ? style.active
                                        : ''
                                } flex align-center`}
                                onClick={() => {
                                    setProduct(ProductType.HPI);
                                }}
                            >
                                <span className='flex align-center justify-center'>
                                    <img
                                        alt='medical record'
                                        src={'/images/medical-record.svg'}
                                    />
                                </span>
                                HPI
                            </a>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button className='button' onClick={navigateTo}>
                            View Now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
