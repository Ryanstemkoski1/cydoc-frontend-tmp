import React from 'react';
import { Grid, Button, ButtonProps } from 'semantic-ui-react';
import {
    HpiStateProps,
    BodyLocationOptions,
    BodyLocationLRItemType,
    options,
    BodyLocationType,
} from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import {
    bodyLocationHandleToggle,
    BodyLocationHandleToggleAction,
    BodyLocationResponseAction,
    bodyLocationResponse,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { LRButtonState } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import LRButton from 'components/tools/LRButtonRedux';
import { isBodyLocationLRItem } from 'redux/reducers/hpiReducer';

export const bodyLocationDefaultState = () => {
    const sectionState: {
        [name: string]: LRButtonState | boolean;
    } = {};
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
};

interface BodyLocationProps {
    node: string;
}

interface BodyLocationState {
    isBodyLocationResponse: boolean;
}

class BodyLocation extends React.Component<Props, BodyLocationState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isBodyLocationResponse: false,
        };
    }

    componentDidMount() {
        this.props.bodyLocationResponse(this.props.node, options);
        // const response = this.props.hpi.nodes[this.props.node];
        // isBodyLocationLRDict(response) && Object.keys(response).length
        // this.setState({ isBodyLocationResponse: true });
    }

    handleLRToggle = (
        node: string,
        option: BodyLocationOptions,
        _e: React.MouseEvent<Element, MouseEvent>,
        data: ButtonProps
    ) => {
        let leftRight: keyof LRButtonState;
        if (data.content === 'L') {
            leftRight = 'left';
        } else if (data.content === 'R') {
            leftRight = 'right';
        } else {
            leftRight = 'center';
        }
        this.props.bodyLocationHandleToggle(node, option, leftRight);
    };

    generateButtons = (
        row: { name: BodyLocationOptions; needsRightLeft: boolean }[]
    ) => {
        const { hpi, node, bodyLocationHandleToggle } = this.props;
        const buttons = row.map((option) => {
            const response = hpi.nodes[node].response as BodyLocationType;
            const responseItem = response[option.name];
            if (option.needsRightLeft && isBodyLocationLRItem(responseItem)) {
                return (
                    <LRButton
                        key={option.name}
                        content={option.name}
                        name={option.name}
                        group={node}
                        toggle={responseItem}
                        color={'red'}
                        isDropdown={false}
                        onClick={this.handleLRToggle}
                        className={'spaced-buttons'}
                    />
                );
            } else {
                return (
                    <Button
                        key={option.name}
                        content={option.name}
                        name={option.name}
                        group={node}
                        active={responseItem as boolean}
                        color={responseItem ? 'red' : undefined}
                        onClick={(
                            _e: React.MouseEvent<Element, MouseEvent>,
                            data: ButtonProps
                        ) =>
                            bodyLocationHandleToggle(
                                node,
                                option.name,
                                data.name
                            )
                        }
                        className={'spaced-buttons'}
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

interface DispatchProps {
    bodyLocationResponse: (
        medId: string,
        bodyOptions: BodyLocationLRItemType[][]
    ) => BodyLocationResponseAction;
    bodyLocationHandleToggle: (
        medId: string,
        bodyOption: BodyLocationOptions,
        toggle: 'left' | 'right' | 'center'
    ) => BodyLocationHandleToggleAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & BodyLocationProps;

const mapDispatchToProps = {
    bodyLocationHandleToggle,
    bodyLocationResponse,
};

export default connect(mapStateToProps, mapDispatchToProps)(BodyLocation);
