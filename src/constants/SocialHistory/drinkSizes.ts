const drinkSizes = [
    { key: 'shot', text: 'shot', value: 'shot' },
    { key: 'can', text: 'can', value: 'can' },
    { key: 'bottle', text: 'bottle', value: 'bottle' },
    { key: 'wine glass', text: 'wine glass', value: 'wine glass' },
    { key: 'tumbler', text: 'tumbler', value: 'tumbler' },
];

export enum DrinkSize {
    None = '',
    Shot = 'shot',
    Can = 'can',
    Bottle = 'bottle',
    WineGlass = 'wine glass',
    Tumbler = 'tumbler',
}

export default drinkSizes;
