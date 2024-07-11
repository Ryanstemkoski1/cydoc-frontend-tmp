import React, { Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import './PhysicalExam.css';

interface Props {
    handleClick: (names: string[]) => void;
    children: React.JSX.Element[];
}

//Component that triggers its handleClick function on all children when clicked
export default class SelectAllButton extends React.Component<Props> {
    render = () => {
        return (
            <Fragment>
                <Button
                    toggle
                    content='∀'
                    active={React.Children.toArray(this.props.children).reduce(
                        (a, b: React.JSX.Element) => a && b.props.active,
                        true
                    )}
                    onClick={() => {
                        this.props.handleClick(
                            this.props.children.map((child) => child.props.name)
                        );
                    }}
                    className={'pe-ros-button spaced-buttons'}
                />
                {this.props.children}
            </Fragment>
        );
    };
}
