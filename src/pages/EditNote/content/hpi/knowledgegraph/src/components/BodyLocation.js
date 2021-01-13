import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import LRButton from 'components/tools/LRButton.js';
import HPIContext from 'contexts/HPIContext.js';

const options = [
    [
        { name: 'Head', needsRightLeft: false },
        { name: 'Eye', needsRightLeft: true },
        { name: 'Ear', needsRightLeft: true },
        { name: 'Nose', needsRightLeft: false },
        { name: 'Mouth', needsRightLeft: false },
        { name: 'Throat', needsRightLeft: false },
        { name: 'Neck', needsRightLeft: false },
    ],
    [
        { name: 'Chest', needsRightLeft: false },
        { name: 'Stomach', needsRightLeft: false },
        { name: 'Pelvis', needsRightLeft: false },
        { name: 'Groin', needsRightLeft: false },
    ],
    [
        { name: 'Shoulder', needsRightLeft: true },
        { name: 'Upper Arm', needsRightLeft: true },
        { name: 'Elbow', needsRightLeft: true },
        { name: 'Lower Arm', needsRightLeft: true },
    ],
    [
        { name: 'Wrist', needsRightLeft: true },
        { name: 'Hand', needsRightLeft: true },
        { name: 'Finger', needsRightLeft: true },
    ],
    [
        { name: 'Upper Back', needsRightLeft: false },
        { name: 'Mid Back', needsRightLeft: false },
        { name: 'Lower Back', needsRightLeft: false },
    ],
    [
        { name: 'Hip', needsRightLeft: true },
        { name: 'Upper Leg', needsRightLeft: true },
        { name: 'Knee', needsRightLeft: true },
        { name: 'Lower Leg', needsRightLeft: true },
    ],
    [
        { name: 'Ankle', needsRightLeft: true },
        { name: 'Foot', needsRightLeft: true },
        { name: 'Toe', needsRightLeft: true },
    ],
];

export const bodyLocationDefaultState = (() => {
    let sectionState = {};
    options.forEach((row) => {
        row.forEach((option) => {
            if (option.needsRightLeft) {
                sectionState[option.name] = {
                    left: false,
                    center: false,
                    right: false,
                };
            } else {
                sectionState[option.name] = false;
            }
        });
    });
    return sectionState;
})();

export default class BodyLocation extends React.Component {
    static contextType = HPIContext;

    handleToggle = (_name, data) => {
        const values = this.context.hpi;
        values[this.props.node].response = data;
        this.context.onContextChange('hpi', values);
    };

    generateButtons = (options) => {
        const value = this.context.hpi[this.props.node].response;
        let buttons = options.map((option) => {
            if (options.needsRightLeft) {
                return (
                    <LRButton
                        content={option.name}
                        name={option.name}
                        active={value.center}
                        toggle={value}
                        color={value.center ? 'gray' : null}
                        onClick={this.handleLRToggle}
                    />
                );
            } else {
                return (
                    <Button
                        content={option.name}
                        name={option.name}
                        active={value}
                        color={value ? 'gray' : null}
                        onClick={(e, { name, active }) =>
                            this.handleToggle(name, !active)
                        }
                    />
                );
            }
        });

        return buttons;
    };

    render() {
        return (
            <div>
                <Grid>
                    {options.map((row, index) => {
                        return (
                            <Grid.Row key={index}>
                                {this.generateButtons(row)}
                            </Grid.Row>
                        );
                    })}
                </Grid>
            </div>
        );
    }
}
