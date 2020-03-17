import React, {Component, Fragment} from 'react'
import {Menu, Container, Button, Dropdown} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import {TAB_NAMES} from '../constants/constants'
import {connect} from "react-redux";
import {saveNote} from "../actions";
import "../content/hpi/knowledgegraph/src/css/App.css";
import {Input} from "semantic-ui-react";
import HPIContext from '../contexts/HPIContext';
import {MENU_TABS_MOBILE_BP} from "../constants/breakpoints.js";
import "../../css/components/menuTabs.css";

const mapStateToProps = state => {
    return {
        currentNote: state.currentNote
    };
};

function mapDispatchToProps(dispatch){
    return {
        saveNote: note => dispatch(saveNote(note))
    };
}
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

    //onClick event is handled by parent
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

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value}) 
        this.context.onContextChange("title", event.target.value)
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
                className="menu-tab"
            />
        );

        return (
            <Fragment>
                <Menu secondary>
                    <Menu.Item>
                            <Input
                            className={this.state.isTitleFocused === true ? "ui input focus" : "ui input transparent"}
                            type='text'
                            placeholder="Untitled Note"
                            style={{fontSize: 16, marginBottom: 5, outline: 'none'}}
                            onChange={this.handleInputChange}
                            onFocus={()=>{
                                this.setState({isTitleFocused: true})
                                if (this.context.title === "Untitled Note") {
                                    this.context.onContextChange("title", "")
                                }
                            }}
                            onBlur={()=>{
                                this.setState({isTitleFocused: false})
                                if (this.context.title === '') {
                                    this.context.onContextChange("title", "Untitled Note")
                                }
                            }}
                            value={this.context.title} 
                            />
                            <Button onClick={this.context.saveNote} className="save-button">
                                Save
                            </Button>
                    </Menu.Item>
                </Menu>
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
                    />)}
            </Fragment>

        )
    }
}

function CollapsedMenuTabs(props) {
    return (
        <Menu tabular attached={props.attached}>
            <Container className="collapsed-menu-tabs">
                {props.tabMenuItems[props.activeTabIndex]}
                <Menu.Item>
                    <Dropdown icon="ellipsis horizontal" options={props.tabMenuItems} />
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

const MenuTabs = connect(mapStateToProps, mapDispatchToProps)(ConnectedMenuTabs);
export default MenuTabs;