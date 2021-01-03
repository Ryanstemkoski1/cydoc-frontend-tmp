import React, { Component } from 'react';
import { Menu, Container, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { TAB_NAMES } from 'constants/constants';
import HPIContext from 'contexts/HPIContext.js';
import { MENU_TABS_MOBILE_BP } from '../../constants/breakpoints.js';
import './MenuTabs.css';

//Component for the tabs that toggle the different sections of the Create Note editor
class ConnectedMenuTabs extends Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            textInput: 'Untitled',
            isTitleFocused: false,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    // onClick event is handled by parent
    handleItemClick = (e, { name }) => this.props.onTabChange(name);

    render() {
        const { activeItem, activeTabIndex } = this.props;
        const { windowWidth } = this.state;

        const collapseMenu = windowWidth < MENU_TABS_MOBILE_BP;
        const tabMenuItems = TAB_NAMES.map((name, index) => (
            <Menu.Item
                key={index}
                name={name}
                active={activeItem === name}
                onClick={this.handleItemClick}
                href={'#' + encodeURI(name)}
            />
        ));

        return (
            <div className='form-tabs'>
                <Menu secondary className={collapseMenu ? '' : 'menu-tab'}>
                    {/* Menu is different depending on screen size */}
                    {collapseMenu ? (
                        <CollapsedMenuTabs
                            tabMenuItems={tabMenuItems}
                            attached={this.props.attached}
                            activeItem={activeItem}
                            activeTabIndex={activeTabIndex}
                        />
                    ) : (
                        <ExpandededMenuTabs
                            tabMenuItems={tabMenuItems}
                            attached={this.props.attached}
                            activeItem={activeItem}
                        />
                    )}
                </Menu>
            </div>
        );
    }
}

// Functional component to display when tabs are collapsed
function CollapsedMenuTabs(props) {
    return (
        <>
            <div></div>
            <Menu
                tabular
                attached={props.attached}
                className='collapsed-menu-tabs'
            >
                <Menu.Item className='arrow'>
                    <Icon
                        name='window maximize outline'
                        className='collapsed-menu-icon'
                    />
                </Menu.Item>
                {props.tabMenuItems}
            </Menu>
        </>
    );
}

const MenuTabs = ConnectedMenuTabs;
export default MenuTabs;

// Functional component to display when tabs are all shown
function ExpandededMenuTabs(props) {
    return (
        <Menu tabular attached={props.attached}>
            <Container className='expanded-menu-tabs'>
                {props.tabMenuItems}
            </Container>
        </Menu>
    );
}

ConnectedMenuTabs.propTypes = {
    activeItem: PropTypes.string,
    attached: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onTabChange: PropTypes.func,
};
