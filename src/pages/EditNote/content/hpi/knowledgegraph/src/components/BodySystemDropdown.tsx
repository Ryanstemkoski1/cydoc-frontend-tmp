import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import '../css/Button.css';
import ChiefComplaintsButton from './ChiefComplaintsButton';
import '../../HPI.css';
import { BodySystemNames, DoctorView } from 'constants/hpiEnums';

interface BodySystemDropdownProps {
    diseasesList: DoctorView[];
    name: BodySystemNames;
}

interface BodySystemDropdownState {
    selected: boolean;
}

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
        return (
            <div>
                <Button
                    basic
                    className='hpi-disease-button'
                    onClick={() =>
                        this.setState({ selected: !this.state.selected })
                    }
                >
                    <Icon name='dropdown' />
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
