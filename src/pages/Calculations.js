import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import './Calculations.css';

const Calculations = ({
    PrimaryDisorder = '',
    SecondaryDisorder = '',
    AnionGap = '',
}) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const handleClick = () =>
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);
    return (
        <Accordion>
            <div
                className='calculations'
                style={{
                    color: 'rgba(7,126,157,255)',
                    textAlign: 'start',
                    outline: 'none',
                }}
            >
                <br></br>
                <Accordion.Title
                    active={activeIndex == 1}
                    onClick={handleClick}
                    index={0}
                    className='no-outline borderless'
                    style={{ color: 'rgba(7,126,157,255)', fontWeight: 'bold' }}
                >
                    <Icon name='dropdown' />
                    Calculations
                </Accordion.Title>
                <Accordion.Content
                    className='borderless'
                    active={activeIndex === 1}
                >
                    <div>
                        <h5
                            className='acidBaseTest'
                            style={{ fontWeight: 'bold' }}
                        >
                            Primary Disorder
                        </h5>
                        <span className='acidBaseTest css-fix'>
                            {PrimaryDisorder}
                        </span>
                        <h5
                            className='acidBaseTest'
                            style={{ fontWeight: 'bold' }}
                        >
                            Secondary Disorder
                        </h5>
                        <span className='acidBaseTest css-fix'>
                            {SecondaryDisorder}
                        </span>
                        <h5
                            className='acidBaseTest css-fix'
                            style={{ fontWeight: 'bold' }}
                        >
                            Anion Gap
                        </h5>
                        <span className='acidBaseTest css-fix'>{AnionGap}</span>
                    </div>
                </Accordion.Content>
            </div>
        </Accordion>
    );
};

export default Calculations;
