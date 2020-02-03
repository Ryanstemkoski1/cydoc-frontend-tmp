import React, {Component, Fragment} from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "./NotePage";
import NavMenu from "../components/NavMenu";

//Component that manages the active state of the create note editor
//and defines the layout of the editor
class EditNote extends Component {
    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.state = {
            activeItem: 'HPI'
        }
    }

    onTabChange(name){
        this.setState({ activeItem: name })
    }

    render() {
                return (
                    <Fragment>
                        <div style={{position: "relative", top: "140px"}}>
                            <NotePage activeItem={this.state.activeItem}/>
                        </div>
                        {/*absolute positioning so that the menu is not sticky*/}
                        <div style={{position: "absolute", top: "0", right: "0", left: "0", boxShadow: "0 3px 4px -6px gray"}}>
                            <NavMenu attached="top"/>
                            <MenuTabs
                                activeItem={this.state.activeItem}
                                onTabChange={this.onTabChange}
                                attached
                            />
                        </div>
                    </Fragment>
                );
        }
}

export default EditNote;