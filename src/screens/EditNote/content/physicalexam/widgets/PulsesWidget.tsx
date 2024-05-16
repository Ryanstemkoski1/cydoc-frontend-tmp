import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import '../PhysicalExam.css';
import { selectPulsesWidgetState } from '@redux/selectors/widgetSelectors/pulsesWidgetSelectors';
import PulsesWidgetItem from './PulsesWidgetItem';
import { connect, ConnectedProps } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import { addPulsesWidgetItem } from '@redux/actions/widgetActions/pulsesWidgetActions';

class PulsesWidget extends Component<PropsFromRedux> {
    render() {
        const widgetItems = Object.keys(this.props.pulses).map((id) => (
            <PulsesWidgetItem id={id} key={id} />
        ));
        return (
            <div style={{ marginTop: 20 }}>
                {widgetItems}
                add abnormal pulses{' '}
                <Button
                    className='pe-ros-button'
                    circular
                    icon='plus'
                    size='mini'
                    onClick={this.props.addPulsesWidgetItem}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    pulses: selectPulsesWidgetState(state),
});

const mapDispatchToProps = {
    addPulsesWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PulsesWidget);
