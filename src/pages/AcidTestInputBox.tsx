import React, { useState } from 'react';

interface Props {
  label: string;
}

const AcidTestInputBox: React.FC<Props> = () => {
  const [value, setValue] = useState('');

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '-10px'}}>
        <span style={{color: 'blue', fontSize: '14px', paddingBottom: '24px', paddingLeft: '15px'}}>Na &nbsp; </span>
        <div style={{display: 'inline-block'}}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: '120px'}}
            />
            <div style={{ fontSize: '12px', color: 'grey', paddingLeft: '2px', paddingBottom: '12px', textAlign: 'start'}}>
              bro
            </div>
        </div>
        <span style={{ color: 'blue', fontSize: '14px', paddingBottom: '24px' }}>&nbsp; Cl</span>
      </div>
    </div>
  );
};

export default AcidTestInputBox;