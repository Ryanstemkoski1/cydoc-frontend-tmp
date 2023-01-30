import React, { useState } from 'react';
import './Calculations.css';

const Calculations = ( { PrimaryDisorder = '', SecondaryDisorder = '', AnionGap= '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div style={{ color: 'rgba(7,126,157,255)' }}>
      <h4 style={{ fontWeight: 'bold' }}>
        {'Calculations  '}
        <span
          className={`triangle ${isOpen ? 'rotate' : ''}`}
          onClick={handleClick}
        >
          <svg viewBox="0 0 20 20" fill="rgba(7,126,157,255)">
            <path d="M10,0 L20,20 L0,20 Z" />
          </svg>
        </span>
      </h4>
      {isOpen && 
      <div>
        <br></br>
        <h5 style={{ fontWeight: 'bold'}}>
        Primary Disorder
        </h5>
        <br></br>
        <span>
            {PrimaryDisorder}
        </span>
        <br></br>
        <h5 style={{ fontWeight: 'bold'}}>
        Secondary Disorder
        </h5>
        <br></br>
        <span>
            {SecondaryDisorder}
        </span>
        <h5 style={{ fontWeight: 'bold'}}>
        Anion Gap
        </h5>
        {AnionGap}
    </div>}
    </div>
  );
}

export default Calculations;