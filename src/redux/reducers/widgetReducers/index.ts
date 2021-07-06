import { combineReducers } from 'redux';
import { abdomenWidgetReducer } from './abdomenWidgetReducer';
import { lungsWidgetReducer } from './lungsWidgetReducer';
import { murmursWidgetReducer } from './murmurswidgetReducer';
import { pulsesWidgetReducer } from './pulsesWidgetReducer';
import { reflexesWidgetReducer } from './reflexesWidgetReducer';

export const widgetReducer = combineReducers({
    lungs: lungsWidgetReducer,
    abdomen: abdomenWidgetReducer,
    pulses: pulsesWidgetReducer,
    reflexes: reflexesWidgetReducer,
    murmurs: murmursWidgetReducer,
});
export type WidgetsState = ReturnType<typeof widgetReducer>;
