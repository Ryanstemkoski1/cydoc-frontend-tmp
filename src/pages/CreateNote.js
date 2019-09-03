import React, {Component, Fragment} from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import NavMenu from "../components/NavMenu";

class CreateNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Medical History'
        }
    }

    onTabChange = (name) => this.setState({ activeItem: name });

    render() {
                return (
                    <Fragment>
                            <div style={{backgroundColor: "white", position: "sticky", top: "0px"}}>
                                    <NavMenu/>
                                    <MenuTabs
                                        activeItem={this.state.activeItem}
                                        onTabChange={this.onTabChange}
                                    />
                            </div>
                            <NotePage activeItem={this.state.activeItem}/>
                    </Fragment>
                );
        }
}

export default CreateNote;