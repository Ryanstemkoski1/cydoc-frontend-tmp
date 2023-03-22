import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import './DifferentialDiagnoses.css';

const DifferentialDiagnoses = ({ description = [] }) => {
    const [activeIndex, setActiveIndex] = useState(1);
    const handleClick = () =>
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);

    const renderTextFromDesc = (arr) => {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (i % 2 === 0) {
                result.push(
                    <span
                        style={{
                            fontWeight: 'bold',
                            color: 'rgba(7, 126, 157, 255)',
                        }}
                    >
                        {arr[i]}
                    </span>
                );
            } else {
                result.push(<span>{arr[i]}</span>);
            }
        }
        return result;
    };

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
                    {renderTextFromDesc(description)}
                </Accordion.Content>
            </div>
        </Accordion>
    );
};

export default DifferentialDiagnoses;
