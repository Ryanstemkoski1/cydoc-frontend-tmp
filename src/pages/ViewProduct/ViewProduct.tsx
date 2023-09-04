import { ProductType, ViewType } from 'assets/enums/route.enums';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import DoctorIcon from '../../assets/images/doctor.svg';
import MedicalIcon from '../../assets/images/medical-app.svg';
import MedicalRecordIcon from '../../assets/images/medical-record.svg';
import PatientIcon from '../../assets/images/patient.svg';
import style from './ViewProduct.module.scss';

export default function ViewProduct() {
    const [product, setProduct] = useState(ProductType.EHR);
    const [view, setView] = useState(ViewType.DOCTOR);

    const history = useHistory();

    const navigateTo = () => {
        const path = `/${product}/${view}`;
        history.push(path);
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
                                    <img src={PatientIcon} />
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
                                    <img src={DoctorIcon} />
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
                                    <img src={MedicalIcon} />
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
                                    <img src={MedicalRecordIcon} />
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
