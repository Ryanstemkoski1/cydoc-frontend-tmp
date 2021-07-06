import React, { Fragment } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Grid, TextArea, Form, Segment } from 'semantic-ui-react';
import Tobacco from './Tobacco';
import Alcohol from './Alcohol';
import RecreationalDrugs from './RecreationalDrugs';
import { selectSecondaryFieldsState } from 'redux/selectors/socialHistorySelectors';
import {
    updateLivingSituation,
    updateEmployment,
    updateDiet,
    updateExercise,
} from 'redux/actions/socialHistoryActions';
import { CurrentNoteState } from 'redux/reducers';

interface OwnProps {
    mobile: boolean;
}
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

export class SocialHistoryContent extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    //generates a collection for the living situation, diet, exercise portion
    generateSecondaryFieldRows() {
        return (
            <>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Living Situation</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateLivingSituation(
                                    value as string
                                );
                            }}
                            value={this.props.secondaryFields.livingSituation}
                            field='Living Situation'
                            rows={2}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Employment</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateEmployment(value as string);
                            }}
                            value={this.props.secondaryFields.employment}
                            field='Employment'
                            rows={2}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Diet</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateDiet(value as string);
                            }}
                            value={this.props.secondaryFields.diet}
                            field='Diet'
                            rows={2}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Exercise</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateExercise(value as string);
                            }}
                            value={this.props.secondaryFields.exercise}
                            field='Exercise'
                            rows={2}
                        />
                    </Form>
                </Grid.Column>
            </>
        );
    }

    // renders Tobacco, Alcohol, and RecreationalDrugs components
    render() {
        const secondaryFieldRows = this.generateSecondaryFieldRows();

        return (
            <Fragment>
                <Segment>
                    <Tobacco mobile={this.props.mobile} />
                </Segment>
                <Segment>
                    <Alcohol mobile={this.props.mobile} />
                </Segment>
                <Segment>
                    <RecreationalDrugs mobile={this.props.mobile} />
                </Segment>
                <Segment>
                    <Grid columns={2} stackable>
                        {secondaryFieldRows}
                    </Grid>
                </Segment>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    secondaryFields: selectSecondaryFieldsState(state),
});

const mapDispatchToProps = {
    updateLivingSituation,
    updateEmployment,
    updateDiet,
    updateExercise,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SocialHistoryContent);
