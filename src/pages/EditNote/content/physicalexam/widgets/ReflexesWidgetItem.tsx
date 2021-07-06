import { LeftRight } from 'constants/enums';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    deleteReflexesWidgetItem,
    updateIntensity,
    updateLocation,
    updateSide,
} from 'redux/actions/widgetActions/reflexesWidgetActions';
import { CurrentNoteState } from 'redux/reducers';
import { ReflexLocation } from 'redux/reducers/widgetReducers/reflexesWidgetReducer';
import { selectReflexesWidgetItem } from 'redux/selectors/widgetSelectors/reflexesWidgetSelectors';
import { Button, Table } from 'semantic-ui-react';

interface ReflexWidgetItemProps {
    id: string;
}

const locationOptions = Object.values(ReflexLocation);
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
    '0 no response',
    '1+ slight',
    '2+ normal',
    '3+ very brisk',
    '4+ clonus',
].map((option, index) => ({
    text: option,
    value: index as 0 | 1 | 2 | 3 | 4,
}));

class ReflexesWidgetItem extends Component<
    ReflexWidgetItemProps & PropsFromRedux
> {
    render() {
        return (
            <Table collapsing>
                <Table.Header>
                    <div style={{ float: 'right' }}>
                        <Button
                            basic
                            circular
                            icon='x'
                            size='mini'
                            onClick={() =>
                                this.props.deleteReflexesWidgetItem(
                                    this.props.id
                                )
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
                                key={option}
                                onClick={() =>
                                    this.props.updateLocation(
                                        this.props.id,
                                        option
                                    )
                                }
                                className={'spaced-buttons'}
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
                                key={text}
                                onClick={() =>
                                    this.props.updateSide(this.props.id, value)
                                }
                                className={'spaced-buttons'}
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
                                key={text}
                                onClick={() =>
                                    this.props.updateIntensity(
                                        this.props.id,
                                        value
                                    )
                                }
                                className={'spaced-buttons'}
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
    ownProps: ReflexWidgetItemProps
) => ({
    itemState: selectReflexesWidgetItem(state, ownProps.id),
});

const mapDispatchToProps = {
    updateLocation,
    updateSide,
    updateIntensity,
    deleteReflexesWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ReflexesWidgetItem);
