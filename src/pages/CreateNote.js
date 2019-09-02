import React, { Fragment } from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import Menu from "../components/Menu";

const CreateNote = () => (
    <Fragment>
        <div style={{backgroundColor: "white"}}>
        <Menu />
        <MenuTabs />
        </div>
        <NotePage />
    </Fragment>
);
export default CreateNote;