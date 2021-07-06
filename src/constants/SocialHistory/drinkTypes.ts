const drinkTypes = [
    { key: 'beer', text: 'beer', value: 'beer' },
    { key: 'wine', text: 'wine', value: 'wine' },
    {
        key: 'distilled spirits',
        text: 'distilled spirits',
        value: 'distilled spirits',
    },
];

export enum DrinkType {
    None = '',
    Beer = 'beer',
    Wine = 'wine',
    DistilledSpirits = 'distilled spirits',
}

export default drinkTypes;
