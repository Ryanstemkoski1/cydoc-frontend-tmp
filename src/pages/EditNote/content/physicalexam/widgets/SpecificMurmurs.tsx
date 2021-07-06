import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Button, Popup } from 'semantic-ui-react';
import {
    toggleSpecificMurmurInfo,
    updateBestHeardAt,
    updateSpecificMurmur,
    toggleRadiationTo,
    toggleAdditionalFeatures,
    toggleCrescendoDecrescendo,
} from 'redux/actions/widgetActions/murmursWidgetActions';
import {
    selectMurmursWidgetItem,
    selectMurmursWidgetSpecificInfo,
} from 'redux/selectors/widgetSelectors/murmursWidgetSelectors';
import { CurrentNoteState } from 'redux/reducers';
import {
    DiastolicMurmur,
    MurmurAdditionalFeature,
    MurmurLocation,
    MurmurRadiation,
    Phase,
    SystolicMurmur,
} from 'redux/reducers/widgetReducers/murmurswidgetReducer';
import _ from 'lodash';
import './css/HeartMurmurs.css';

const getDisplayName = (fieldName: string) => {
    //If the fieldName is all caps
    if (/^([A-Z])+(^[a-z])*$/.test(fieldName)) {
        return fieldName;
    } else {
        return _.startCase(fieldName).toLowerCase();
    }
};

const inCrescDecresc = [
    SystolicMurmur.AorticStenosis,
    MurmurLocation.RUSB,
    'carotids',
    'leftClavicle',
    SystolicMurmur.AtrialSeptalDefect,
    MurmurLocation.LUSB,
    MurmurLocation.LLSB,
    SystolicMurmur.HOCM,
    'increasedWithValsava',
];

interface SpecificMurmursProps {
    id: string;
}

class SpecificMurmurs extends Component<SpecificMurmursProps & PropsFromRedux> {
    generateSpecificMurmurButton = (
        murmur: SystolicMurmur | DiastolicMurmur
    ) => {
        return (
            <Button
                color={
                    this.props.specificInfo.specificMurmur === murmur
                        ? 'red'
                        : undefined
                }
                key={murmur}
                content={murmur}
                onClick={() => {
                    if (
                        inCrescDecresc.includes(murmur) &&
                        (!this.props.itemState.crescendo ||
                            !this.props.itemState.decrescendo)
                    ) {
                        this.props.toggleCrescendoDecrescendo(
                            this.props.id,
                            true,
                            true
                        );
                    }
                    this.props.updateSpecificMurmur(this.props.id, murmur);
                }}
            />
        );
    };

    generateRadiationToButton = (radiationTo: MurmurRadiation) => {
        return (
            <Button
                color={
                    this.props.specificInfo.radiationTo[radiationTo]
                        ? 'red'
                        : undefined
                }
                key={radiationTo}
                content={`radiation to ${getDisplayName(radiationTo)}`}
                onClick={() => {
                    if (
                        inCrescDecresc.includes(radiationTo) &&
                        (!this.props.itemState.crescendo ||
                            !this.props.itemState.decrescendo)
                    ) {
                        this.props.toggleCrescendoDecrescendo(
                            this.props.id,
                            true,
                            true
                        );
                    }
                    this.props.toggleRadiationTo(this.props.id, radiationTo);
                }}
            />
        );
    };

    generateAdditionalFeaturesButton = (feature: MurmurAdditionalFeature) => {
        return (
            <Button
                color={
                    this.props.specificInfo.additionalFeatures[feature]
                        ? 'red'
                        : undefined
                }
                key={feature}
                content={getDisplayName(feature)}
                onClick={() => {
                    if (
                        inCrescDecresc.includes(feature) &&
                        (!this.props.itemState.crescendo ||
                            !this.props.itemState.decrescendo)
                    ) {
                        this.props.toggleCrescendoDecrescendo(
                            this.props.id,
                            true,
                            true
                        );
                    }
                    this.props.toggleAdditionalFeatures(this.props.id, feature);
                }}
            />
        );
    };

    generateBestHeardAtButton = (bestHeardAt: MurmurLocation) => {
        return (
            <Button
                color={
                    this.props.itemState.bestHeardAt === bestHeardAt
                        ? 'red'
                        : undefined
                }
                key={bestHeardAt}
                content={`best heard at ${bestHeardAt}`}
                onClick={() => {
                    if (
                        inCrescDecresc.includes(bestHeardAt) &&
                        (!this.props.itemState.crescendo ||
                            !this.props.itemState.decrescendo)
                    ) {
                        this.props.toggleCrescendoDecrescendo(
                            this.props.id,
                            true,
                            true
                        );
                    }
                    this.props.updateBestHeardAt(this.props.id, bestHeardAt);
                }}
            />
        );
    };

    generateButtonGroup = ([...buttons]: JSX.Element[]) => {
        return <div className='specific-group'>{buttons}</div>;
    };

    generateSystolic = () => {
        return (
            <>
                <div>Systolic</div>
                <div className='div-30'>cresc-decresc</div>
                <div className='div-35'>
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.AorticStenosis
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.RUSB),
                        this.generateRadiationToButton('carotids'),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.AtrialSeptalDefect
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.LUSB),
                        this.generateRadiationToButton('leftClavicle'),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(SystolicMurmur.HOCM),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                        this.generateAdditionalFeaturesButton(
                            'increasedWithValsava'
                        ),
                    ])}
                </div>
                <div className='div-30'>pansystolic</div>
                <div className='div-35'>
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.MitralRegurgitation
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.Apex),
                        this.generateRadiationToButton('precordium'),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.TricuspidRegurgitation
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                        this.generateRadiationToButton('LUSB'),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.VentricularSeptalDefect
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                        this.generateAdditionalFeaturesButton('palpableThrill'),
                    ])}
                </div>
                <div className='div-15'>
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.MitralProlapse
                        ),
                        this.generateAdditionalFeaturesButton('systolicClick'),
                        this.generateAdditionalFeaturesButton(
                            'increasedWithValsava'
                        ),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            SystolicMurmur.Physiologic
                        ),
                    ])}
                </div>
            </>
        );
    };

    generateDiastolic = () => {
        return (
            <>
                <div>Diastolic</div>
                <div className='div-30'>decrescendo</div>
                <div className='div-35'>
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            DiastolicMurmur.AorticRegurgitation
                        ),
                        this.generateAdditionalFeaturesButton('early'),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                        this.generateBestHeardAtButton(MurmurLocation.RLSB),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            DiastolicMurmur.MitralStenosis
                        ),
                        this.generateAdditionalFeaturesButton('mid'),
                        this.generateBestHeardAtButton(MurmurLocation.Apex),
                        this.generateAdditionalFeaturesButton('openingSnap'),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            DiastolicMurmur.TricuspidStenosis
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                    ])}
                    {this.generateButtonGroup([
                        this.generateSpecificMurmurButton(
                            DiastolicMurmur.PulmonaryRegurgitation
                        ),
                        this.generateBestHeardAtButton(MurmurLocation.LLSB),
                    ])}
                </div>
            </>
        );
    };

    render = () => {
        const murmurs = (() => {
            if (this.props.itemState.phase === Phase.Systolic) {
                return this.generateSystolic();
            } else if (this.props.itemState.phase === Phase.Diastolic) {
                return this.generateDiastolic();
            } else {
                return undefined;
            }
        })();
        return (
            <div className='expand-specific'>
                <Table collapsing>
                    <Table.Header>
                        <div className='murmurs-x'>
                            <Button
                                basic
                                circular
                                icon='x'
                                size='mini'
                                onClick={() =>
                                    this.props.toggleSpecificMurmurInfo(
                                        this.props.id,
                                        false
                                    )
                                }
                            />
                        </div>
                    </Table.Header>
                    {murmurs}
                </Table>
            </div>
        );
    };
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: SpecificMurmursProps
) => ({
    itemState: selectMurmursWidgetItem(state, ownProps.id),
    specificInfo: selectMurmursWidgetSpecificInfo(state, ownProps.id),
});

const mapDispatchToProps = {
    updateBestHeardAt,
    toggleSpecificMurmurInfo,
    updateSpecificMurmur,
    toggleRadiationTo,
    toggleAdditionalFeatures,
    toggleCrescendoDecrescendo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SpecificMurmurs);
