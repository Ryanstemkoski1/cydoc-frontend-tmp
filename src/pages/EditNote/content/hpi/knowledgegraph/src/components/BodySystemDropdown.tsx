import React from 'react';
import { Button } from 'semantic-ui-react';
import '../css/Button.css';
import ChiefComplaintsButton from './ChiefComplaintsButton';
import '../../HPI.css';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';
import brain from '../icons/brain.svg';
import pain from '../icons/pain.svg';
import heent from '../icons/heent.svg';
import respiratory from '../icons/respiratory.svg';
import heart from '../icons/heart.svg';
import yoga from '../icons/yoga.svg';
import intestines from '../icons/intestines.svg';
import immunology from '../icons/immunology.svg';
import dermatologic from '../icons/dermatologic.svg';
import kidneys from '../icons/kidneys.svg';
import endocrine from '../icons/endocrine.svg';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

interface BodySystemDropdownProps {
    diseasesList: string[];
    name: string;
}

interface BodySystemDropdownState {
    selected: boolean;
}

const imgToRender: { [key: string]: any } = {
    'Neurologic/Psychiatric': brain,
    Pain: pain,
    HEENT: heent,
    Respiratory: respiratory,
    'Cardiovascular/Hematologic': heart,
    'General/Lifestyle': yoga,
    Gastrointestinal: intestines,
    Immune: immunology,
    Dermatologic: dermatologic,
    'ObGyn/GU': kidneys,
    Endocrine: endocrine,
};

class BodySystemDropdown extends React.Component<
    BodySystemDropdownProps,
    BodySystemDropdownState
> {
    constructor(props: BodySystemDropdownProps) {
        super(props);
        this.state = {
            selected: false, //Set to false so that dropdown is closed by default
        };
    }

    render(): React.ReactNode {
        const { name, diseasesList } = this.props;

        //Defining outlier conditions
        //for styling body system dropdown buttons including ...
        //if the screen size is mobile -> change button size and layout
        //if the BodySystem is Cardiovascular/Hematologic -> abbreviate to Cards/Heme
        //if the BodySystem is Neurologic/Psychiatric -> abbreviate to Neuro/Psych

        const isMobile = window.innerWidth < NOTE_PAGE_MOBILE_BP;
        const cardio = imgToRender[name] == heart;
        const neuro = imgToRender[name] == brain;

        //Setting name to default of name, but abbreviating if needed
        let nameAbrev = name;
        if (cardio) nameAbrev = 'Cards/Heme';
        if (neuro) nameAbrev = 'Neuro/Psych';

        //Setting default render style to computer but changing to mobile if needed
        let styleToRender = 'hpi-disease-button';
        if (isMobile) styleToRender = 'mobile-hpi-disease-button';

        return (
            <div>
                <Button
                    className={`hpi-chiefcomplaint-button ${styleToRender}`}
                    onClick={() =>
                        this.setState({ selected: !this.state.selected })
                    }
                    active={this.state.selected}
                >
                    {/* <Icon name='dropdown' /> */}
                    <img
                        className={isMobile ? 'mobile-hpi-icons' : 'hpi-icons'}
                        src={imgToRender[name]}
                    />
                    {nameAbrev}
                </Button>
                <div className='diseases-array'>
                    {this.state.selected
                        ? diseasesList
                              .filter((disease) => disease !== 'HIDDEN')
                              .map((disease) => (
                                  <ChiefComplaintsButton
                                      key={disease}
                                      name={disease}
                                  />
                              ))
                        : []}
                </div>
            </div>
        );
    }
}

export default BodySystemDropdown;
