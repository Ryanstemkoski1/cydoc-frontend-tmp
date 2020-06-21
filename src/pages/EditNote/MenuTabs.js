import React, {Component, Fragment} from 'react'
import {Menu, Container, Button, Dropdown, Grid, Image} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {TAB_NAMES} from 'constants/constants'
import {Input} from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js';
import {MENU_TABS_MOBILE_BP} from "../../constants/breakpoints.js";
import "./MenuTabs.css";
import LogoName from "../../assets/logo-name.png"

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
    //
    // handleInputChange = (event) => {
    //     this.setState({textInput: event.target.value})
    //     this.context.onContextChange("title", event.target.value)
    // }

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
                <Container textAlign={collapseMenu? 'left' : 'right'} className="note-name-menu">
                    <Image floated="left" className="sticky-logo" size="tiny" src={LogoName} />
                    
                </Container>

                <Menu secondary className="menu-tab">
                    {collapseMenu ?
                        (<CollapsedMenuTabs
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

function CollapsedMenuTabs(props) {
    const curTab = props.tabMenuItems[props.activeTabIndex].props.name

    return (
        <Menu tabular attached={props.attached}>
            <Container className="collapsed-menu-tabs">
                {props.tabMenuItems[props.activeTabIndex]}
                {props.tabMenuItems[props.tabMenuItems.length - 1]}
                <Menu.Item>
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
    );
}

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

const MenuTabs = ConnectedMenuTabs;
export default MenuTabs;