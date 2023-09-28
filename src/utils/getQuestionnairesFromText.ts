import SearchTermsToQuestionnaireMapping from 'constants/SearchTermsToQuestionnaireMapping';

export function getQuestionnairesFromText(text: string): string[] {
    text = text.toLowerCase();
    const questionnaires = new Set<string>();

    for (const [
        searchTerms,
        mappedQuestionnaire,
    ] of SearchTermsToQuestionnaireMapping) {
        for (let i = 0; i < searchTerms.length; ++i) {
            const currentSearchTerm = searchTerms[i];
            const isLast = i === searchTerms.length - 1;
            if (!text.includes(currentSearchTerm)) {
                break;
            }
            // If reached here means all the terms/words from map are present in the text
            if (isLast) {
                questionnaires.add(mappedQuestionnaire);
            }
        }
    }

    return Array.from(questionnaires);
}
