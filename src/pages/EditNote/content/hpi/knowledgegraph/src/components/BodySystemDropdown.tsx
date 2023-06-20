import React from 'react';
import { Button } from 'semantic-ui-react';
import '../css/Button.css';
import ChiefComplaintsButton from './ChiefComplaintsButton';
import '../../HPI.css';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';
import brain from '../icons/brain.svg';
import psychiatry from '../icons/psychiatry.svg';
import heent from '../icons/heent.svg';
import respiratory from '../icons/respiratory.svg';
import heart from '../icons/heart.svg';
import yoga from '../icons/yoga.svg';
import intestines from '../icons/intestines.svg';
import immunology from '../icons/immunology.svg';
import dermatologic from '../icons/dermatologic.svg';
import kidneys from '../icons/kidneys.svg';
import endocrine from '../icons/endocrine.svg';
import pediatrics from '../icons/pediatrics.svg';
import musculoskeletal from '../icons/musculoskeletal.svg';
import star from '../icons/star.svg';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

interface BodySystemDropdownProps {
    diseasesList: string[];
    name: string;
}

interface BodySystemDropdownState {
    selected: boolean;
}

const imgToRender: { [key: string]: any } = {
    Neurologic: brain,
    Psychiatric: psychiatry,
    HEENT: heent,
    Respiratory: respiratory,
    'Cardiovascular/Hematologic': heart,
    'General/Lifestyle': yoga,
    Gastrointestinal: intestines,
    Immune: immunology,
    Dermatologic: dermatologic,
    'ObGyn/GU': kidneys,
    Endocrine: endocrine,
    Pediatrics: pediatrics,
    Musculoskeletal: musculoskeletal,
    Favorites: star,
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
        // const neuro = imgToRender[name] == brain;

        //Setting name to default of name, but abbreviating if needed
        let nameAbrev = name;
        if (cardio) nameAbrev = 'Cards/Heme';

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

                    <div className='hpi-disease-button-content-outer'>
                        <div className='hpi-disease-button-content-icon'>
                            <img
                                className={
                                    isMobile ? 'mobile-hpi-icons' : 'hpi-icons'
                                }
                                src={imgToRender[name]}
                            />
                        </div>
                        <div className='hpi-disease-button-content-name'>
                            {nameAbrev}
                        </div>
                    </div>
                </Button>
                <div className='diseases-array btn-wrap'>
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
