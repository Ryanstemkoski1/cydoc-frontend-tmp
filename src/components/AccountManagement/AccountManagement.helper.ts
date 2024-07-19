export const generateAvatarBgColor = (name: string) => {
    const hash = Array.from(name).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const color = Array.from({ length: 3 }, (_, i) => {
        const value = (hash >> (i * 8)) & 0xff;
        return `00${value.toString(16)}`.slice(-2);
    }).join('');

    return `#${color}`;
};

export const getAvatarLetters = ({
    firstName,
    lastName,
}: {
    firstName: string | undefined;
    lastName: string | undefined;
}) => {
    if (firstName === undefined || lastName === undefined) return 'U';
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`;
};
