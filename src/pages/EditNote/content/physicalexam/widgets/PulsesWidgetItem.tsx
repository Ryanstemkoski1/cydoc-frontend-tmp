import { LeftRight } from 'constants/enums';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    deletePulsesWidgetItem,
    updateIntensity,
    updateLocation,
    updateSide,
} from '@redux/actions/widgetActions/pulsesWidgetActions';
import { CurrentNoteState } from '@redux/reducers';
import { PulseLocation } from '@redux/reducers/widgetReducers/pulsesWidgetReducer';
import { selectPulsesWidgetItem } from '@redux/selectors/widgetSelectors/pulsesWidgetSelectors';
import { Button, Table } from 'semantic-ui-react';
import '../PhysicalExam.css';

interface PulsesWidgetItemProps {
    id: string;
}

const locationOptions = Object.values(PulseLocation);
const sideOptions = [
    {
        text: 'right',
        value: LeftRight.Right,
    },
    {
        text: 'left',
        value: LeftRight.Left,
    },
];
const intensityOptions = [
    '0 absent',
    '1+ weak',
    '2+',
    '3+ normal',
    '4+ bounding',
].map((option, index) => ({
    text: option,
    value: index as 0 | 1 | 2 | 3 | 4,
}));

class PulsesWidgetItem extends Component<
    PulsesWidgetItemProps & PropsFromRedux
> {
    render() {
        return (
            <Table collapsing>
                <Table.Header>
                    <div style={{ float: 'right' }}>
                        <Button
                            className='pe-ros-button'
                            circular
                            icon='x'
                            size='mini'
                            onClick={() =>
                                this.props.deletePulsesWidgetItem(this.props.id)
                            }
                        />
                    </div>
                    <div style={{ margin: 10 }}>
                        {locationOptions.map((option) => (
                            <Button
                                color={
                                    this.props.itemState.location === option
                                        ? 'red'
                                        : undefined
                                }
                                active={
                                    this.props.itemState.location === option
                                }
                                key={option}
                                onClick={() =>
                                    this.props.updateLocation(
                                        this.props.id,
                                        option
                                    )
                                }
                                className={'pe-ros-button spaced-buttons'}
                            >
                                {' '}
                                {option}{' '}
                            </Button>
                        ))}
                    </div>
                    <div style={{ margin: 10 }}>
                        {sideOptions.map(({ text, value }) => (
                            <Button
                                color={
                                    this.props.itemState.side === value
                                        ? 'red'
                                        : undefined
                                }
                                active={this.props.itemState.side === value}
                                key={text}
                                onClick={() =>
                                    this.props.updateSide(this.props.id, value)
                                }
                                className={'pe-ros-button spaced-buttons'}
                            >
                                {' '}
                                {text}{' '}
                            </Button>
                        ))}
                    </div>
                    <div style={{ margin: 10 }}>
                        {intensityOptions.map(({ text, value }) => (
                            <Button
                                color={
                                    this.props.itemState.intensity === value
                                        ? 'red'
                                        : undefined
                                }
                                active={
                                    this.props.itemState.intensity === value
                                }
                                key={text}
                                onClick={() =>
                                    this.props.updateIntensity(
                                        this.props.id,
                                        value
                                    )
                                }
                                className={'pe-ros-button spaced-buttons'}
                            >
                                {' '}
                                {text}{' '}
                            </Button>
                        ))}
                    </div>
                </Table.Header>
            </Table>
        );
    }
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: PulsesWidgetItemProps
) => ({
    itemState: selectPulsesWidgetItem(state, ownProps.id),
});

const mapDispatchToProps = {
    updateLocation,
    updateSide,
    updateIntensity,
    deletePulsesWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PulsesWidgetItem);
