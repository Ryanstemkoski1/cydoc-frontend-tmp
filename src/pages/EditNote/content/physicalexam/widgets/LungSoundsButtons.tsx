import React, { Component } from 'react';
import { Button, ButtonProps, Popup } from 'semantic-ui-react';
import { connect, ConnectedProps } from 'react-redux';
import '../PhysicalExam.css';
import { CurrentNoteState } from 'redux/reducers';
import {
    LungsWidgetSection,
    LungsWidgetState,
} from 'redux/reducers/widgetReducers/lungsWidgetReducer';
import { selectLungsWidgetSection } from 'redux/selectors/widgetSelectors/lungsWidgetSelectors';
import { toggleLungsWidgetSection } from 'redux/actions/widgetActions/lungsWidgetActions';
import _ from 'lodash';

const defaultOptions: (keyof LungsWidgetSection)[] = [
    'wheezes',
    'rales',
    'rhonchi',
];

const popupOptions: (keyof LungsWidgetSection)[] = [
    'bronchialBreathSounds',
    'vesicularBreathSounds',
    'egophony',
    'whistling',
    'stridor',
];

interface LungSoundsButtonsProps {
    lungLobe: keyof LungsWidgetState;
}

class LungSoundsButtons extends Component<
    LungSoundsButtonsProps & PropsFromRedux
> {
    getHandleClick =
        (fieldName: keyof LungsWidgetSection) =>
        (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            _data: ButtonProps
        ) => {
            event.preventDefault();
            this.props.toggleSection(this.props.lungLobe, fieldName);
        };

    getDisplayName = (fieldName: keyof LungsWidgetSection) => {
        return _.startCase(fieldName).toLowerCase();
    };

    renderButton = (option: keyof LungsWidgetSection) => (
        <Button
            size='small'
            key={option}
            color={this.props.sections[option] ? 'red' : undefined}
            active={this.props.sections[option]}
            content={this.getDisplayName(option)}
            onClick={this.getHandleClick(option)}
            className='pe-ros-button spaced-buttons'
        />
    );

    render() {
        const unselectedPopupOptions = popupOptions.filter(
            (option) => !this.props.sections[option]
        );
        const selectedPopupOptions = popupOptions.filter(
            (option) => this.props.sections[option]
        );
        const popupButtons = unselectedPopupOptions.map(this.renderButton);
        const defaultButtons = defaultOptions
            .concat(selectedPopupOptions)
            .map(this.renderButton);

        return (
            <div>
                {defaultButtons}
                {popupButtons.length > 0 && (
                    <Popup
                        trigger={
                            <Button
                                circular
                                icon='plus'
                                className={'pe-ros-button spaced-buttons'}
                            />
                        }
                        position='bottom center'
                        flowing
                        hoverable
                    >
                        {popupButtons}
                    </Popup>
                )}
            </div>
        );
    }
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: LungSoundsButtonsProps
) => ({
    sections: selectLungsWidgetSection(state, ownProps.lungLobe),
});

const mapDispatchToProps = {
    toggleSection: toggleLungsWidgetSection,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LungSoundsButtons);
