import React, { Component } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import { connect, ConnectedProps } from 'react-redux';
import '../PhysicalExam.css';
import { CurrentNoteState } from 'redux/reducers';
import {
    AbdomenWidgetSection,
    AbdomenWidgetState,
} from 'redux/reducers/widgetReducers/abdomenWidgetReducer';
import { toggleAbdomenWidgetSection } from 'redux/actions/widgetActions/abdomenWidgetActions';
import { selectAbdomenWidgetSection } from 'redux/selectors/widgetSelectors/abdomenWidgetSelectors';

const options: (keyof AbdomenWidgetSection)[] = [
    'tenderness',
    'rebound',
    'guarding',
];

interface AbdomenExamButtonsProps {
    abdomenQuadrant: keyof AbdomenWidgetState;
}

class AbdomenExamButtons extends Component<
    AbdomenExamButtonsProps & PropsFromRedux
> {
    getHandleClick = (fieldName: keyof AbdomenWidgetSection) => (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        _data: ButtonProps
    ) => {
        event.preventDefault();
        this.props.toggleSection(this.props.abdomenQuadrant, fieldName);
    };

    renderButton = (option: keyof AbdomenWidgetSection) => (
        <Button
            size='small'
            key={option}
            active={this.props.sections[option]}
            color={this.props.sections[option] ? 'red' : undefined}
            content={option}
            onClick={this.getHandleClick(option)}
            className='pe-ros-button spaced-buttons'
        />
    );

    render() {
        return <div>{options.map(this.renderButton)}</div>;
    }
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: AbdomenExamButtonsProps
) => ({
    sections: selectAbdomenWidgetSection(state, ownProps.abdomenQuadrant),
});

const mapDispatchToProps = {
    toggleSection: toggleAbdomenWidgetSection,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AbdomenExamButtons);
