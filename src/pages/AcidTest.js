import AcidTestInputBox from "./AcidTestInputBox";
import React from 'react';
import Logo from '../assets/cydoc-logo.svg';
import { useHistory } from "react-router";
import { Menu } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { useState } from "react";
import runAnalysis from "./AcidBase/acidBaseCalculator";


const AcidTest = () => {
  const [pH, setPH] = useState(0);
  const [HC, setHC] = useState(0);
  const [PC, setPC] = useState(0);
  const [nA, setNA] = useState(0);
  const [Cl, setCl] = useState(0);
  const [Albumin, setAlbumin] = useState(0);
  const [text, setText] = useState('');

  const handleClick = () => {
    setText(runAnalysis(pH, HC, PC, nA, Cl, Albumin));
  }

  const onPhChange = ( number ) => {
    setPH(number);
  }
  const onHCChange = ( number ) => {
    setHC(number);
  }
  const onPCChange = ( number ) => {
    setPC(number);
  }
  const onNaChange = ( number ) => {
    setNA(number);
  }
  const onClChange = ( number ) => {
    setCl(number);
  }
  const onAlbuminChange = ( number ) => {
    setAlbumin(number);
  }
  const history = useHistory();
  const navigateToHome = () => {
    const path = '/dashboard';
    history.push(path);
}
  return(
  <>
  <Menu className='nav-menu'>
    <Menu.Item className='logo-menu' onClick={navigateToHome}>
      <Image
          src={Logo}
          className='logo-circle'
      />
    </Menu.Item>
  </Menu>
  <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        width: '42%',
        height: '94%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        float: 'left',
      }}>
        <div className="ui container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <h4 className="ui header" style={{
            color: "rgba(7,126,157,255)",
            position: "relative",
            bottom: '100px',
            marginLeft: '20px'
          }}>Laboratory Data</h4>
          <h6 classname="ui header small" style={{
            color: 'rgba(130,130,130,255',
            position: 'relative',
            bottom: '130px',
            marginLeft: '20px',
            size: '30px'
          }}>
            Please fill in the required fields below
          </h6>
          <div className="ui container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '-150px'
          }}>
          <AcidTestInputBox callback={onPhChange} label1='pH' label2='' subscript='Normal Range 7.38-7.44'/>
          <AcidTestInputBox callback={onHCChange} label1='HC03+' label2='mEq/L' subscript='Normal Range 23-28 mEq/L'/>
          <AcidTestInputBox callback={onPCChange} label1='pC02' label2='mmHg' subscript='Normal Range 38-42 mmHg'/>
          <AcidTestInputBox callback={onNaChange} label1='Na' label2='mEq/L' subscript='Normal Range 126-145 mEq/L'/>
          <AcidTestInputBox callback={onClChange} label1='Cl' label2='mEq/L' subscript='Normal Range 98-106 mEq/L'/>
          <AcidTestInputBox callback={onAlbuminChange} label1='Albumin' label2='mEq/L' subscript='Normal Range 3.5 - 5.5 meq/L'/>
          </div>
          <button className="ui button" 
          onClick={handleClick}
          style={{
            color: 'white',
            backgroundColor: 'rgba(7,126,157,255)',
            marginTop: '40px',
          }}>Calculate Results</button>
        </div>
      </div>
      <div style={{
        width: '42%',
        height: '94%',
        backgroundColor: '#fff',
        float: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <h4 className="ui header" style={{
            color: "rgba(7,126,157,255)",
            position: "relative",
            bottom: '315px'
          }}>Interpretation</h4>
          {text != '' && <h4>{text}</h4>}
      </div>
    </div>
  </>
  );
}

export default AcidTest;