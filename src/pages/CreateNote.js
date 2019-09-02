import React, { Fragment } from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import Menu from "../components/Menu";

const CreateNote = () => (
    <Fragment>
        <Menu />
        <MenuTabs />
        <NotePage />
    </Fragment>
);
export default CreateNote;