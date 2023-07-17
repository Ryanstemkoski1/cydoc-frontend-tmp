import React from 'react';
import { Button } from 'semantic-ui-react';
import './PrevNextButton.css';
interface IProps {
    nextClick: () => void;
    previousClick: () => void;
}

const PrevNextButton = (props: IProps) => {
    const { nextClick, previousClick } = props;
    return (
        <>
            <Button
                icon='arrow left'
                floated='left'
                className='small-previous-button big'
                aria-label='previous-button'
                onClick={previousClick}
            />
            <Button
                icon='arrow left'
                labelPosition='left'
                floated='left'
                onClick={previousClick}
                className='previous-button'
                aria-label='previous-button'
                content='Prev'
            />
            <Button
                icon='arrow right'
                floated='right'
                aria-label='next-button'
                className='small-next-button big'
                onClick={nextClick}
            />
            <Button
                icon='arrow right'
                labelPosition='right'
                aria-label='next-button'
                floated='right'
                onClick={nextClick}
                className='next-button'
                content='Next'
            />
        </>
    );
};

export default PrevNextButton;
