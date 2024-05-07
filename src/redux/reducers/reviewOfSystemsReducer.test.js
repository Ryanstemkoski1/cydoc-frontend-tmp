import { ROS_ACTION } from '@redux/actions/actionTypes';
import { reviewOfSystemsReducer } from './reviewOfSystemsReducer';
import { initialReviewOfSystemsState } from 'constants/reviewOfSystemsInitial';
import { YesNoResponse } from 'constants/enums';

describe('reviewOfSystems reducer', () => {
    let options;
    beforeEach(() => {
        options = Object.values(initialReviewOfSystemsState)[0];
    });

    it('returns the state', () => {
        expect(reviewOfSystemsReducer(undefined, {})).toEqual(
            initialReviewOfSystemsState
        );
    });

    it('toggles yes or no', () => {
        const YesOrNo = reviewOfSystemsReducer(initialReviewOfSystemsState, {
            type: ROS_ACTION.TOGGLE_OPTION,
            payload: {
                category: Object.keys(initialReviewOfSystemsState)[0],
                option: Object.keys(options)[0],
                yesOrNo: YesNoResponse.Yes,
            },
        });
        expect(YesOrNo).toMatchSnapshot();
    });

    it('toggles to none when clicked again', () => {
        const testState = {
            General: {
                'Weight changes': YesNoResponse.No,
            },
        };
        const noneState = {
            General: {
                'Weight changes': YesNoResponse.None,
            },
        };
        const action = {
            type: ROS_ACTION.TOGGLE_OPTION,
            payload: {
                category: Object.keys(initialReviewOfSystemsState)[0],
                option: Object.keys(options)[0],
                yesOrNo: YesNoResponse.None,
            },
        };
        expect(reviewOfSystemsReducer(testState, action)).toEqual(noneState);
    });
});
