import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import React from 'react';
import { Button } from 'semantic-ui-react';
import '../../HPI.css';
import '../css/Button.css';
import blooddrop from '../icons/blooddrop.svg';
import brain from '../icons/brain.svg';
import dermatologic from '../icons/dermatologic.svg';
import endocrine from '../icons/endocrine.svg';
import genmed from '../icons/genmed.svg';
import heart from '../icons/heart.svg';
import heent from '../icons/heent.svg';
import immunology from '../icons/immunology.svg';
import intestines from '../icons/intestines.svg';
import kidneys from '../icons/kidneys.svg';
import musculoskeletal from '../icons/musculoskeletal.svg';
import pediatrics from '../icons/pediatrics.svg';
import psychiatry from '../icons/psychiatry.svg';
import respiratory from '../icons/respiratory.svg';
import star from '../icons/star.svg';
import ChiefComplaintsButton from './ChiefComplaintsButton';

interface BodySystemDropdownProps {
    diseasesList: string[];
    name: string;
}

interface BodySystemDropdownState {
    selected: boolean;
}

const imgToRender: { [key: string]: any } = {
    Neurology: brain,
    Psychiatry: psychiatry,
    'Ophtho/ENT': heent,
    Pulmonology: respiratory,
    Cardiology: heart,
    'General Medicine': genmed,
    Gastroenterology: intestines,
    Rheumatology: immunology,
    Dermatology: dermatologic,
    'Ob/Gyn': kidneys,
    Endocrinology: endocrine,
    Pediatrics: pediatrics,
    Orthopedics: musculoskeletal,
    Favorites: star,
    'Heme/Onc': blooddrop,
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

        //Setting default render style to computer but changing to mobile if needed
        const styleToRender = 'hpi-disease-button';

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
                                className={'hpi-icons'}
                                src={imgToRender[name]}
                            />
                        </div>
                        <div className='hpi-disease-button-content-name'>
                            {name}
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
