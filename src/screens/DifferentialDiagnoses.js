import React, { useState } from 'react';
import { Accordion } from 'semantic-ui-react';
import './DifferentialDiagnoses.css';

const DifferentialDiagnoses = ({ description = [] }) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const handleClick = () =>
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);

    const renderTextFromDesc = (arr) => {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (i % 2 === 0) {
                result.push(<strong>{arr[i]}</strong>);
            } else {
                result.push(<span>{arr[i]}</span>);
            }
        }
        return result;
    };

    return (
        <Accordion className='accordion-ui'>
            <Accordion.Title
                active={activeIndex === 1}
                onClick={handleClick}
                index={0}
            >
                Differential Diagnosis
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
                {renderTextFromDesc(description)}
            </Accordion.Content>
        </Accordion>
    );
};

export default DifferentialDiagnoses;
