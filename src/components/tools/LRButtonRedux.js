import React from 'react';
import { Button } from 'semantic-ui-react';
import './LRButton.css';
//import PropTypes from 'prop-types';

//Component that manages content for the Physical Exam tab
export default class LRButton extends React.Component {
    render = () => {
        const { group, content } = this.props;
        if (this.props.toggle.center) {
            return (
                <Button.Group className={'spaced-buttons'}>
                    <Button
                        attached='left'
                        content='L'
                        active={this.props.toggle.left === true}
                        color={
                            this.props.toggle.left === true
                                ? this.props.color
                                : null
                        }
                        onClick={(e, data) =>
                            this.props.onClick(group, content, e, data)
                        }
                    />
                    <Button
                        content={this.props.content}
                        active={this.props.toggle.center}
                        color={
                            this.props.toggle.center ? this.props.color : null
                        }
                        onClick={(e, data) => {
                            this.props.onClick(group, content, e, data);
                            if (this.props.isDropdown) {
                                this.props.onDropdownButtonClick(data);
                            }
                        }}
                    />
                    <Button
                        attached='right'
                        content='R'
                        active={this.props.toggle.right === true}
                        color={
                            this.props.toggle.right === true
                                ? this.props.color
                                : null
                        }
                        onClick={(e, data) =>
                            this.props.onClick(group, content, e, data)
                        }
                    />
                </Button.Group>
            );
        } else {
            return (
                <Button.Group className={'spaced-buttons'}>
                    <Button
                        content={this.props.content}
                        active={this.props.toggle.center}
                        color={
                            this.props.toggle.center ? this.props.color : null
                        }
                        onClick={
                            //this.props.onClick(null, this.props.name, !active)
                            (e, data) => {
                                this.props.onClick(group, content, e, data);
                                if (this.props.isDropdown) {
                                    this.props.onDropdownButtonClick(data);
                                }
                            }
                        }
                    />
                </Button.Group>
            );
        }
    };
}
