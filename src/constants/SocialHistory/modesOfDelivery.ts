const modesOfDelivery = [
    { key: 'smoking', text: 'smoking', value: 'smoking' },
    { key: 'vaporizing', text: 'vaporizing', value: 'vaporizing' },
    { key: 'sniffing', text: 'sniffing', value: 'sniffing' },
    { key: 'snorting', text: 'snorting', value: 'snorting' },
    {
        key: 'injected into skin',
        text: 'injected into skin',
        value: 'injected into skin',
    },
    {
        key: 'injected into muscle',
        text: 'injected into muscle',
        value: 'injected into muscle',
    },
    {
        key: 'injected into vein',
        text: 'injected into vein',
        value: 'injected into vein',
    },
    { key: 'swallowed', text: 'swallowed', value: 'swallowed' },
    {
        key: 'dissolved under tongue',
        text: 'dissolved under tongue',
        value: 'dissolved under tongue',
    },
    { key: 'rectal', text: 'rectal', value: 'rectal' },
    {
        key: 'sticker on the skin',
        text: 'sticker on the skin',
        value: 'sticker on the skin',
    },
    { key: 'other', text: 'other', value: 'other' },
];

export enum ModeOfDelivery {
    None = '',
    Smoking = 'smoking',
    Vaporizing = 'vaporizing',
    Sniffing = 'sniffing',
    Snorting = 'snorting',
    InjectedIntoSkin = 'injected into skin',
    InjectedIntoMuscle = 'injected into muscle',
    InjectedIntoVein = 'injected into vein',
    Swallowed = 'swallowed',
    DissolvedUnderTongue = 'dissolved under tongue',
    Rectal = 'rectal',
    StickerOnTheSkin = 'sticker on the skin',
    Other = 'other',
}

export default modesOfDelivery;
