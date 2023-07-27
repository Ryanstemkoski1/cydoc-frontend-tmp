/* eslint-disable no-console */
import React from 'react';
import constants from 'constants/constants';
import './Tab.css';

const Tab = ({ panes, activeIndex, onTabChange }) => {
    return (
        <div className='tab'>
            {panes.map((item, index) => (
                <button
                    onClick={(event) => {
                        onTabChange(event, {
                            activeIndex: index,
                            activeTabName: constants.PMH_TAB_NAMES[index],
                            value: index,
                        });
                    }}
                    className={`tab-item ${
                        activeIndex === index ? 'tab-active' : ''
                    }`}
                    key={item.menuItem}
                >
                    {item.menuItem}
                </button>
            ))}
        </div>
    );
};

export default Tab;
