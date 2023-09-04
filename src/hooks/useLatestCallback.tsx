import { useRef } from 'react';

export const useLatestCallback = <TParameters extends any[], TReturnType>(
    callback: (...args: TParameters) => TReturnType
) => {
    const ref = useRef(callback);
    ref.current = callback;
    return useRef((...args: TParameters): TReturnType => {
        return ref.current(...args);
    }).current;
};
