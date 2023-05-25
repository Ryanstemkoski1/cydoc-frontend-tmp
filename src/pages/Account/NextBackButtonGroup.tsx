import React from 'react';

import './Account.css';
import { Button } from 'semantic-ui-react';
import useEnableNext from './useEnableNext';
import { Box } from '@mui/system';

interface Props {
    step: number;
    onClose: () => void;
    onPrevClick: () => void;
    onNextClick: () => void;
}
export function NextBackButtonGroup({
    step,
    onClose,
    onNextClick,
    onPrevClick,
}: Props) {
    const enableNext = useEnableNext(step);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                marginBottom: '1.5rem',
                marginRight: '1.5rem',
            }}
        >
            <Button
                basic
                color='teal'
                content='Cancel'
                type='button'
                onClick={onClose}
            />
            {step > 0 ? (
                <Button
                    color='teal'
                    content='Prev'
                    type='button'
                    onClick={onPrevClick}
                />
            ) : null}
            <Button
                disabled={!enableNext}
                color='teal'
                content='Next'
                onClick={onNextClick}
            />
        </Box>
    );
}
