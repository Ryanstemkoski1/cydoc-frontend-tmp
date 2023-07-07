import React, { Component } from 'react';
import { Table, Button, Popup } from 'semantic-ui-react';
import '../PhysicalExam.css';
import {
    MurmurLocation,
    MurmurPitch,
    Phase,
    MurmurQuality,
} from 'redux/reducers/widgetReducers/murmurswidgetReducer';
import {
    deleteMurmursWidgetItem,
    toggleCrescendoDecrescendo,
    toggleQuality,
    toggleSpecificMurmurInfo,
    updateBestHeardAt,
    updateIntensity,
    updatePhase,
    updatePitch,
} from 'redux/actions/widgetActions/murmursWidgetActions';
import { connect, ConnectedProps } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { selectMurmursWidgetItem } from 'redux/selectors/widgetSelectors/murmursWidgetSelectors';
import SpecificMurmurs from './SpecificMurmurs';
import './css/HeartMurmurs.css';

const phaseOptions = Object.values(Phase);
const crescDecrescOptions = ['crescendo', 'decrescendo', 'cresc-decresc'];
const bestHeardAtOptions = Object.values(MurmurLocation);
const intensityOptions = [1, 2, 3, 4, 5] as const;
const pitchOptions = Object.values(MurmurPitch);
const qualityOptions: MurmurQuality[] = [
    'blowing',
    'harsh',
    'rumbling',
    'whooshing',
    'rasping',
    'musical',
];
// type optionTypes =
//     | typeof phaseOptions
//     | typeof crescDecrescOptions
//     | typeof bestHeardAtOptions
//     | typeof intensityOptions
//     | typeof pitchOptions;

interface HeartMurmursItemProps {
    id: string;
}

class HeartMurmursItem extends Component<
    HeartMurmursItemProps & PropsFromRedux
> {
    generatePhaseRow = () => {
        return (
            <div className='phase-row'>
                {phaseOptions.map((option) => (
                    <Button
                        color={
                            this.props.itemState.phase === option
                                ? 'red'
                                : undefined
                        }
                        active={this.props.itemState.phase === option}
                        key={option}
                        onClick={() =>
                            this.props.updatePhase(this.props.id, option)
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    generateCrescDecrescRow = () => {
        return (
            <div className='phase-row'>
                {crescDecrescOptions.map((option, index) => (
                    <Button
                        color={
                            //assumes crescendo == 0, decresendo == 1, cresc-decresc == 2
                            this.props.itemState.crescendo === (index !== 1) &&
                            this.props.itemState.decrescendo === index > 0
                                ? 'red'
                                : undefined
                        }
                        active={
                            this.props.itemState.crescendo === (index !== 1) &&
                            this.props.itemState.decrescendo === index > 0
                        }
                        key={option}
                        onClick={
                            //assumes crescendo == 0, decresendo == 1, cresc-decresc == 2
                            () =>
                                this.props.toggleCrescendoDecrescendo(
                                    this.props.id,
                                    index !== 1,
                                    index > 0
                                )
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    generateBestHeardAtRow = () => {
        return (
            <div className='phase-row'>
                {bestHeardAtOptions.map((option) => (
                    <Button
                        color={
                            this.props.itemState.bestHeardAt === option
                                ? 'red'
                                : undefined
                        }
                        active={this.props.itemState.bestHeardAt === option}
                        key={option}
                        onClick={() =>
                            this.props.updateBestHeardAt(this.props.id, option)
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    generateIntensityRow = () => {
        return (
            <div className='phase-row'>
                {intensityOptions.map((option) => (
                    <Button
                        color={
                            this.props.itemState.intensity === option
                                ? 'red'
                                : undefined
                        }
                        active={this.props.itemState.intensity === option}
                        key={option}
                        onClick={() =>
                            this.props.updateIntensity(this.props.id, option)
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    generatePitchesRow = () => {
        return (
            <div className='phase-row'>
                {pitchOptions.map((option) => (
                    <Button
                        color={
                            this.props.itemState.pitch === option
                                ? 'red'
                                : undefined
                        }
                        active={this.props.itemState.pitch === option}
                        key={option}
                        onClick={() =>
                            this.props.updatePitch(this.props.id, option)
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    generateQualityRow = () => {
        return (
            <div className='phase-row'>
                {qualityOptions.map((option) => (
                    <Button
                        color={
                            this.props.itemState.quality[option]
                                ? 'red'
                                : undefined
                        }
                        active={this.props.itemState.quality[option]}
                        key={option}
                        onClick={() =>
                            this.props.toggleQuality(this.props.id, option)
                        }
                        content={option}
                        className={'pe-ros-button spaced-buttons'}
                    />
                ))}
            </div>
        );
    };

    render = () => {
        const specificMurmursButton = (
            <Button
                circular
                icon='plus'
                size='mini'
                content='Expand Specific Murmurs'
                onClick={() =>
                    this.props.toggleSpecificMurmurInfo(this.props.id, true)
                }
                className='pe-ros-button'
            />
        );

        return (
            <Table collapsing>
                <Table.Header>
                    <div className='murmurs-x'>
                        <Button
                            circular
                            icon='x'
                            size='mini'
                            onClick={() =>
                                this.props.deleteMurmursWidgetItem(
                                    this.props.id
                                )
                            }
                            className='pe-ros-button'
                        />
                    </div>
                </Table.Header>
                {this.generatePhaseRow()}
                {this.generateCrescDecrescRow()}
                Heard Best At: {this.generateBestHeardAtRow()}
                Intensity: {this.generateIntensityRow()}
                Pitch: {this.generatePitchesRow()}
                Quality: {this.generateQualityRow()}
                Specific Murmurs:
                {!this.props.itemState.specificMurmurInfo ? (
                    <div className='expand-specific'>
                        {this.props.itemState.phase == '' ? (
                            <Popup
                                content='Please select systolic or diastolic before expanding'
                                trigger={specificMurmursButton}
                            />
                        ) : (
                            specificMurmursButton
                        )}
                    </div>
                ) : (
                    <SpecificMurmurs id={this.props.id} />
                )}
            </Table>
        );
    };
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: HeartMurmursItemProps
) => ({
    itemState: selectMurmursWidgetItem(state, ownProps.id),
});

const mapDispatchToProps = {
    updatePhase,
    toggleCrescendoDecrescendo,
    updateBestHeardAt,
    updateIntensity,
    updatePitch,
    toggleQuality,
    toggleSpecificMurmurInfo,
    deleteMurmursWidgetItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeartMurmursItem);
