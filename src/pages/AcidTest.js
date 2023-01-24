import AcidTestInputBox from "./AcidTestInputBox";
import React from 'react';
import Logo from '../assets/cydoc-logo.svg';
import { useHistory } from "react-router";
import { Menu } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

const AcidTest = () => {
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
          <AcidTestInputBox label=''/>
          <AcidTestInputBox label=''/>
          <AcidTestInputBox label=''/>
          <AcidTestInputBox label=''/>
          <AcidTestInputBox label=''/>
          <AcidTestInputBox label=''/>
        </div>
      </div>
      <div style={{
        width: '42%',
        height: '94%',
        backgroundColor: '#fff',
        float: 'right'
      }}>
        Right Content
      </div>
    </div>
  </>
  );
}

export default AcidTest;