import React, {Component, Fragment} from 'react'
import {Menu, Container, Dropdown, Segment, Icon} from 'semantic-ui-react'
import PropTypes from 'prop-types'

import {TAB_NAMES} from 'constants/constants'
import HPIContext from 'contexts/HPIContext.js';
import {MENU_TABS_MOBILE_BP} from "../../constants/breakpoints.js";
import "./MenuTabs.css";

//Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            textInput: "Untitled",
            isTitleFocused: false,
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick =  this.handleItemClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }
 
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    // onClick event is handled by parent
    handleItemClick = (e, { name }) => this.props.onTabChange(name);

    handleSave = () => {
        this.props.saveNote({
            noteName:"note",
            body:
                [
                    {dogs:["terriers","corgis","dalmations"]},
                    {fish:["goldfish", "beta"]}
                ],
            doctorID:"5d696a7dbf476c61064fd58d"
        });
    }


    render() {
        const {activeItem, activeTabIndex} = this.props;
        const { windowWidth } = this.state;

        const collapseMenu = windowWidth < MENU_TABS_MOBILE_BP;
        const tabMenuItems = TAB_NAMES.map((name, index) =>
            <Menu.Item
                key={index}
                name={name}
                active={activeItem === name}
                onClick={this.handleItemClick}
                href={"#"+ encodeURI(name)}
            />
        );

        return (
            <div style={{backgroundColor: 'white'}}>
                <Menu secondary className="menu-tab">
                    {/* Menu is different depending on screen size */}
                    {collapseMenu ?
                        (


                            <CollapsedMenuTabs
                            tabMenuItems={tabMenuItems}
                            attached={this.props.attached}
                            activeItem={activeItem}
                            activeTabIndex={activeTabIndex}
                        />) : (<ExpandededMenuTabs
                            tabMenuItems={tabMenuItems}
                            attached={this.props.attached}
                            activeItem={activeItem}
                        />)
                    }
                </Menu>
            </div>



        )
    }
}


// Functional component to display when tabs are collapsed
function CollapsedMenuTabs(props) {
    const curTab = props.tabMenuItems[props.activeTabIndex].props.name

    return (
        <Menu tabular attached={props.attached} >
            <Container className="collapsed-menu-tabs">
                {props.tabMenuItems[props.activeTabIndex]}
                {props.tabMenuItems[props.tabMenuItems.length - 1]}
                <Menu.Item style={{flex: "0 0 auto"}}>
                    {curTab.length < 10 ?
                        <Dropdown
                            icon="ellipsis horizontal"
                            options={props.tabMenuItems.slice(0, props.tabMenuItems.length - 1)}
                        />
                        :
                        <Dropdown
                            icon="ellipsis horizontal"
                            direction='left'
                            options={props.tabMenuItems.slice(0, props.tabMenuItems.length - 1)}
                        />
                    }
                </Menu.Item>
            </Container>
        </Menu>
        // <>
        //     <div>
        //     <Icon name="angle left" style={{
        //         verticalAlign: 'middle',
        //         textAlign: 'center',
        //         padding: '5px '
        //     }}/>
        //     </div>
        // <Menu tabular attached={props.attached} className="collapsed-menu-tabs" style={{
        //     overflow: 'auto',
        //     maxHeight: '50vh',
        //     whiteSpace: 'nowrap',
        //     display: 'flex',
        //     flexWrap: 'nowrap',
        //     overflowX: 'auto',
        //     WebkitOverflowScrolling: 'touch'}}
        // >
        //
        //     {props.tabMenuItems}
        // </Menu>
        // </>
    );
}

const MenuTabs = ConnectedMenuTabs;
export default MenuTabs;

// Functional component to display when tabs are all shown
function ExpandededMenuTabs(props) {
    return <Menu tabular attached={props.attached}>
        <Container className="expanded-menu-tabs">
            {props.tabMenuItems}
        </Container>
    </Menu>;
}


ConnectedMenuTabs.propTypes = {
    activeItem: PropTypes.string,
    attached: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    onTabChange: PropTypes.func
};
