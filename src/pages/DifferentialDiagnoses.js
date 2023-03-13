import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import './DifferentialDiagnoses.css';

const DifferentialDiagnoses = ({ text = '', description = '' }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const handleClick = () =>
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);

    return (
        <Accordion>
            <div
                className='differentialDiagnoses'
                style={{
                    color: 'rgba(7,126,157,255)',
                    textAlign: 'start',
                }}
            >
                <br></br>
                <Accordion.Title
                    active={activeIndex === 1}
                    onClick={handleClick}
                    index={0}
                    className='no-outline borderless'
                    style={{ fontWeight: 'bold', color: 'rgba(7,126,157,255)' }}
                >
                    <Icon name='dropdown' />
                    {'Differential Diagnosis  '}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    {description + text}
                </Accordion.Content>
            </div>
        </Accordion>
    );
};

export default DifferentialDiagnoses;
