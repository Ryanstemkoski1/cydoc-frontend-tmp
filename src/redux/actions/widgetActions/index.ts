import { AbdomenWidgetActionTypes } from './abdomenWidgetActions';
import { LungsWidgetActionTypes } from './lungsWidgetActions';
import { MurmursWidgetActionTypes } from './murmursWidgetActions';
import { PulsesWidgetActionTypes } from './pulsesWidgetActions';
import { ReflexesWidgetActionTypes } from './reflexesWidgetActions';

export type WidgetActionTypes =
    | LungsWidgetActionTypes
    | AbdomenWidgetActionTypes
    | PulsesWidgetActionTypes
    | ReflexesWidgetActionTypes
    | MurmursWidgetActionTypes;
