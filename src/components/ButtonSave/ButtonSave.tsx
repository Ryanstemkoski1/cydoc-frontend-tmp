import ButtonLoader from '@components/ButtonLoader/ButtonLoader';
import React from 'react';

interface ButtonSaveProps {
    text?: string;
    handleOnSave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    loading?: boolean;
}

const ButtonSave = ({ text, handleOnSave, loading }: ButtonSaveProps) => {
    return (
        <div
            style={{
                position: 'sticky',
                right: '0',
                bottom: '10px',
                float: 'right',
                marginTop: '-45px',
            }}
        >
            <button
                className='button'
                disabled={loading}
                onClick={handleOnSave}
            >
                {text}
                {loading && <ButtonLoader />}
            </button>
        </div>
    );
};

export default ButtonSave;
