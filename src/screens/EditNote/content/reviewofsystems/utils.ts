import { YesNoResponse } from '@constants/enums';

export const initialStore = {
    Eyes: {
        Glasses: YesNoResponse.None,
        Contacts: YesNoResponse.None,
        Blurriness: YesNoResponse.None,
    },
    Throat: {
        Lumps: YesNoResponse.None,
        Swelling: YesNoResponse.None,
        Pain: YesNoResponse.None,
        Stiffness: YesNoResponse.None,
    },
    Nose: {
        Colds: YesNoResponse.None,
        Stuffiness: YesNoResponse.None,
        Sneezing: YesNoResponse.None,
        Itching: YesNoResponse.None,
        Allergy: YesNoResponse.None,
        Nosebleed: YesNoResponse.None,
    },
};
