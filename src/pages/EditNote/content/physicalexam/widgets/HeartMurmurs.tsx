import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { addMurmursWidgetItem } from '@redux/actions/widgetActions/murmursWidgetActions';
import '../PhysicalExam.css';
import { selectMurmursWidgetState } from '@redux/selectors/widgetSelectors/murmursWidgetSelectors';
import { connect, ConnectedProps } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import HeartMurmursItem from './HeartMurmursItem';
import './css/HeartMurmurs.css';

class HeartMurmurs extends Component<PropsFromRedux> {
    render = () => {
        const murmurItems = Object.keys(this.props.murmurs).map((id) => (
            <HeartMurmursItem id={id} key={id} />
        ));
        return (
            <div className='murmurs'>
                {murmurItems}
                <Button
                    circular
                    icon='plus'
                    size='mini'
                    content='Add Murmurs'
                    onClick={this.props.addMurmursWidgetItem}
                    className='pe-ros-button'
                />
            </div>
        );
    };
}

const mapStateToProps = (state: CurrentNoteState) => ({
    murmurs: selectMurmursWidgetState(state),
});

const mapDispatchToProps = {
    addMurmursWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeartMurmurs);
