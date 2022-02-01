import { getOptionMapping } from '../_processOptions';

const rawAllergicReactions = {
    'Generalized anaphylaxis': 'Generalized anaphylaxis',
    'Hay fever': 'Hay fever',
    'Irritation of nose': 'Irritation of nose',
    Rhinitis: 'Rhinitis',
    Urticaria: 'Urticaria',
    Conjunctivitis: 'Conjunctivitis',
    Rash: 'Rash',
    Dermatitis: 'Dermatitis',
    Diarrhea: 'Diarrhea',
    Cough: 'Cough',
    Pruritus: 'Pruritus',
    Vomiting: 'Vomiting',
    Dyspnea: 'Dyspnea',
    Wheezing: 'Wheezing',
    'Abdominal cramping': 'Abdominal cramping',
    'Abdominal pain': 'Abdominal pain',
    Weakness: 'Weakness',
    'Heart palpitations': 'Heart palpitations',
    Eczema: 'Eczema',
    Asthma: 'Asthma',
};

export default getOptionMapping(rawAllergicReactions);
