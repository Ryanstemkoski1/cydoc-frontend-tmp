import React, { useState } from 'react';
import './DifferentialDiagnoses.css';

const DifferentialDiagnoses = ({ text = '', description = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => setIsOpen(!isOpen);

    return (
        <div
            className='differentialDiagnoses'
            style={{ color: 'rgba(7,126,157,255)' }}
        >
            <h5 style={{ fontWeight: 'bold' }}>
                {'Differential Diagnoses:  '}
                <span
                    className={`triangle ${isOpen ? 'rotate' : ''}`}
                    onClick={handleClick}
                >
                    <svg viewBox='0 0 20 20' fill='rgba(7,126,157,255)'>
                        <path d='M10,0 L20,20 L0,20 Z' />
                    </svg>
                </span>
            </h5>
            {isOpen && (
                <div>
                    <span style={{ fontSize: '12px' }}>{description}</span>
                    <span style={{ fontSize: '12px' }}>{text}</span>
                </div>
            )}
        </div>
    );
};

export default DifferentialDiagnoses;
