import React, { useState } from 'react';
import './Calculations.css';

const Calculations = ({
    PrimaryDisorder = '',
    SecondaryDisorder = '',
    AnionGap = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => setIsOpen(!isOpen);

    return (
        <div className='calculations' style={{ color: 'rgba(7,126,157,255)' }}>
            <h5 style={{ fontWeight: 'bold' }}>
                {'Calculations  '}
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
                    <h5 className='acidBaseTest' style={{ fontWeight: 'bold' }}>
                        Primary Disorder
                    </h5>
                    <span className='acidBaseTest' style={{ fontSize: '12px' }}>
                        {PrimaryDisorder}
                    </span>
                    <h5 className='acidBaseTest' style={{ fontWeight: 'bold' }}>
                        Secondary Disorder
                    </h5>
                    <span className='acidBaseTest' style={{ fontSize: '12px' }}>
                        {SecondaryDisorder}
                    </span>
                    <h5 className='acidBaseTest' style={{ fontWeight: 'bold' }}>
                        Anion Gap
                    </h5>
                    <span className='acidBaseTest' style={{ fontSize: '12px' }}>
                        {AnionGap}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Calculations;
