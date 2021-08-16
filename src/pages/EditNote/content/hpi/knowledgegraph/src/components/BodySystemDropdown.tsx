import React from 'react';
import { Button } from 'semantic-ui-react';
import '../css/Button.css';
import ChiefComplaintsButton from './ChiefComplaintsButton';
import '../../HPI.css';
import { BodySystemNames, DoctorView } from 'constants/hpiEnums';
import { NOTE_PAGE_MOBILE_BP } from 'constants/breakpoints';
import brain from '../icons/brain.png';
import pain from '../icons/pain.png';
import heent from '../icons/heent.png';
import respiratory from '../icons/respiratory.png';
import heart from '../icons/heart.png';
import yoga from '../icons/yoga.png';
import intestines from '../icons/intestines.png';
import immunology from '../icons/immunology.png';
import dermatologic from '../icons/dermatologic.png';
import kidneys from '../icons/kidneys.png';
import genitourinary from '../icons/genitourinary.png';

interface BodySystemDropdownProps {
    diseasesList: DoctorView[];
    name: BodySystemNames;
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
    Genitourinary: kidneys,
    Endocrine: genitourinary,
};

class BodySystemDropdown extends React.Component<
    BodySystemDropdownProps,
    BodySystemDropdownState
> {
    constructor(props: BodySystemDropdownProps) {
        super(props);
        this.state = {
            selected: true,
        };
    }

    render(): React.ReactNode {
        const { name, diseasesList } = this.props;
        const isMobile = window.innerWidth < NOTE_PAGE_MOBILE_BP;
        const mobileCardio = isMobile && imgToRender[name] == heart;
        const normalCardio = !isMobile && imgToRender[name] == heart;
        let styleToRender = 'hpi-disease-button';

        if (isMobile) {
            styleToRender = 'mobile-hpi-disease-button';
        }
        if (mobileCardio) {
            styleToRender = 'cardiovascular-mobile';
        }
        if (normalCardio) {
            styleToRender = 'cardiovascular-normal';
        }

        return (
            <div>
                <Button
                    basic
                    className={styleToRender}
                    onClick={() =>
                        this.setState({ selected: !this.state.selected })
                    }
                >
                    {/* <Icon name='dropdown' /> */}
                    <img
                        className={isMobile ? 'mobile-hpi-icons' : 'hpi-icons'}
                        src={imgToRender[name]}
                    />
                    {name}
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
