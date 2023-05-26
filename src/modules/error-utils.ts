export type ErrorType = string | { message?: string; statusCode?: string };

export const stringFromError = (error: unknown): string => {
    const e = error as ErrorType;
    if (typeof e === 'string') {
        return e;
    } else if (typeof e?.message === 'string') {
        return e.message;
    } else if (typeof e?.statusCode === 'string') {
        return e.statusCode;
    } else {
        return `[stringFromError] unrecognized error object shape, message: ${typeof e?.message}`;
    }
};
