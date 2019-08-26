import React, { Fragment } from 'react';
import Menu from './Menu';
import MenuTabs from "./MenuTabs";
import NotePage from "./NotePage";
const App = () => (
    <Fragment>
        <Menu />
        <MenuTabs />
        <NotePage />
        {/*<Container>*/}
        {/*    <Login />*/}
        {/*</Container>*/}
    </Fragment>
);
export default App;
