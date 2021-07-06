const tobaccoProducts = [
    { key: 'bidi', text: 'bidi', value: 'bidi' },
    { key: 'cigarette', text: 'cigarette', value: 'cigarette' },
    { key: 'cigar', text: 'cigar', value: 'cigar' },
    { key: 'hookah', text: 'hookah', value: 'hookah' },
    { key: 'pipe', text: 'pipe', value: 'pipe' },
    {
        key: 'chewing tobacco',
        text: 'chewing tobacco',
        value: 'chewing tobacco',
    },
    { key: 'dip', text: 'dip', value: 'dip' },
    { key: 'dissolvables', text: 'dissolvables', value: 'dissolvables' },
    { key: 'snuff', text: 'snuff', value: 'snuff' },
    { key: 'snus', text: 'snus', value: 'snus' },
];

export enum TobaccoProduct {
    None = '',
    Bidi = 'bidi',
    Cigarette = 'cigarette',
    Cigar = 'cigar',
    Hookah = 'hookah',
    Pipe = 'pipe',
    ChewingTobacco = 'chewing tobacco',
    Dip = 'dip',
    Dissolvables = 'dissolvables',
    Snuff = 'snuff',
    Snus = 'snus',
}

export default tobaccoProducts;
