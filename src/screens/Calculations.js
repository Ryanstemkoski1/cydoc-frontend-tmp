import React, { useState } from 'react';
import { Accordion } from 'semantic-ui-react';
import style from './Calculations.module.scss';

const Calculations = ({
    PrimaryDisorder = '',
    SecondaryDisorder = '',
    AnionGap = '',
}) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const handleClick = () =>
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);
    return (
        <Accordion className='accordion-ui'>
            <Accordion.Title
                active={activeIndex == 1}
                onClick={handleClick}
                index={0}
            >
                Calculations
            </Accordion.Title>
            <Accordion.Content
                className='borderless'
                active={activeIndex === 1}
            >
                <div className={style.calculations}>
                    <h5>Primary Disorder</h5>
                    <span>{PrimaryDisorder}</span>
                    <h5>Secondary Disorder</h5>
                    <span>{SecondaryDisorder}</span>
                    <h5>Anion Gap</h5>
                    <span>{AnionGap}</span>
                </div>
            </Accordion.Content>
        </Accordion>
    );
};

export default Calculations;
