import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import '../PhysicalExam.css';
import { selectReflexesWidgetState } from 'redux/selectors/widgetSelectors/reflexesWidgetSelectors';
import ReflexesWidgetItem from './ReflexesWidgetItem';
import { connect, ConnectedProps } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { addReflexesWidgetItem } from 'redux/actions/widgetActions/reflexesWidgetActions';

class ReflexesWidget extends Component<PropsFromRedux> {
    render() {
        const widgetItems = Object.keys(this.props.reflexes).map((id) => (
            <ReflexesWidgetItem id={id} key={id} />
        ));
        return (
            <div style={{ marginTop: 20 }}>
                {widgetItems}
                add abnormal reflexes{' '}
                <Button
                    basic
                    circular
                    icon='plus'
                    size='mini'
                    onClick={this.props.addReflexesWidgetItem}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    reflexes: selectReflexesWidgetState(state),
});

const mapDispatchToProps = {
    addReflexesWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ReflexesWidget);
