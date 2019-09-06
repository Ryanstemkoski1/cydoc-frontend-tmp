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
                        <div style={{position: "relative", top: "100px"}}>
                            <NotePage activeItem={this.state.activeItem}/>
                        </div>
                        <div style={{position: "fixed", top: "0", right: "0", left: "0"}}>
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

export default CreateNote;