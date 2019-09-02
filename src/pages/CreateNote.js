import React, { Fragment } from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import NavMenu from "../components/NavMenu";

const CreateNote = () => (
    <Fragment>
        <div style={{backgroundColor: "white", position: "sticky", top: "0px"}}>
                <NavMenu />
                <MenuTabs />
        </div>
        <NotePage />
    </Fragment>
);
export default CreateNote;