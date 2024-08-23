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
