import React, { useState } from 'react';



const AcidTestInputBox = ({ callback, label1, label2, subscript }) => {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
    callback(e.target.value);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      <div style={{ display: "flex", alignItems: "center", marginTop: '15px' }}>
        <span style={{ color: "rgba(7,126,157,255)", fontSize: "14px", minWidth: '58px', textAlign: 'right'}}>
        {label1}&nbsp;
        </span>
        <div style={{ flexGrow: 1 }} />
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={handleChange}
          style={{
            width: "140px",
            height: "30px",
            padding: "0px 10px",
            borderRadius: "5px",
          }}
        />
        <div style={{ flexGrow: 1 }} />
        <span style={{ color: "rgba(7,126,157,255)", fontSize: "14px", minWidth: '50px' }}>
        &nbsp;{label2}
        </span>
      </div>
      <div style={{ verticalAlign: 'top', fontSize: "10px", color: "rgba(130,130,130,255)", paddingTop: "5px", paddingLeft: '55px'}}>
        {subscript}
      </div>
    </div>
  );
};



export default AcidTestInputBox;