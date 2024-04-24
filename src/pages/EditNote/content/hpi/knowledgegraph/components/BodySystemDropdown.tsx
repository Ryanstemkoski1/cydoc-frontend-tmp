import 'pages/EditNote/content/hpi/knowledgegraph/css/Button.css';
import React from 'react';
import { Button } from 'semantic-ui-react';
import '../HPI.css';
import '../css/Button.css';
import ChiefComplaintsButton from './ChiefComplaintsButton';

interface BodySystemDropdownProps {
    diseasesList: string[];
    name: string;
}

interface BodySystemDropdownState {
    selected: boolean;
}

const imgToRender: { [key: string]: any } = {
    Neurology: '/images/brain.svg',
    Psychiatry: '/images/psychiatry.svg',
    'Ophtho/ENT': '/images/heent.svg',
    Pulmonology: '/images/respiratory.svg',
    Cardiology: '/images/heart.svg',
    'General Medicine': '/images/genmed.svg',
    Gastroenterology: '/images/intestines.svg',
    Rheumatology: '/images/immunology.svg',
    Dermatology: '/images/dermatologic.svg',
    'Ob/Gyn': '/images/kidneys.svg',
    Endocrinology: '/images/endocrine.svg',
    Pediatrics: '/images/pediatrics.svg',
    Orthopedics: '/images/musculoskeletal.svg',
    Favorites: '/images/star.svg',
    'Heme/Onc': '/images/blooddrop.svg',
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
