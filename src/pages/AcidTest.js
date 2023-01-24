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
  <div className="ui container">
  <AcidTestInputBox label=''/>
  <AcidTestInputBox label=''/>
  </div>
  </>
  );
}

export default AcidTest;