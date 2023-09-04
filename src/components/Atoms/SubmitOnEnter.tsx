import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

export function SubmitOnEnter() {
    const { submitForm } = useFormikContext();
    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            console.log('Enter key was pressed. Run your function.');
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                event.preventDefault();
                submitForm();
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [submitForm]);

    return null;
}
