
interface GeneratorOptions {
  quantity: number;
  useModifiers: boolean;
  useSynonyms: boolean;
  useQuestionsFormat: boolean;
}

// Common modifiers for keyphrases
const prefixModifiers = [
  'best', 'top', 'affordable', 'cheap', 'premium', 'professional',
  'how to', 'ways to', 'guide to', 'tips for', 'benefits of',
  'what is', 'why use'
];

const suffixModifiers = [
  'guide', 'tips', 'strategies', 'ideas', 'examples', 'techniques',
  'tools', 'services', 'software', 'solutions', 'for beginners',
  'for professionals', 'in 2023', 'near me', 'online', 'review'
];

// Question starters
const questionStarters = [
  'how to', 'what is', 'why is', 'where to', 'when to',
  'how can', 'how does', 'what are', 'why use', 'how much'
];

// Simple synonym mapping
const commonSynonyms: Record<string, string[]> = {
  'marketing': ['advertising', 'promotion', 'branding'],
  'business': ['company', 'enterprise', 'firm'],
  'software': ['application', 'program', 'tool'],
  'good': ['great', 'excellent', 'best'],
  'buy': ['purchase', 'acquire', 'get'],
  'cheap': ['affordable', 'budget', 'inexpensive'],
  'guide': ['tutorial', 'handbook', 'instructions'],
  'tips': ['advice', 'suggestions', 'recommendations'],
  'improve': ['enhance', 'boost', 'optimize'],
  'start': ['begin', 'launch', 'initiate'],
  'create': ['make', 'develop', 'produce'],
  'strategy': ['plan', 'approach', 'method'],
  'online': ['digital', 'web-based', 'internet'],
  'problem': ['issue', 'challenge', 'difficulty'],
  'solution': ['answer', 'fix', 'resolution'],
  'service': ['assistance', 'support', 'aid'],
  'product': ['item', 'goods', 'merchandise'],
  'customer': ['client', 'consumer', 'user'],
  'popular': ['trending', 'in-demand', 'favorite'],
  'free': ['complimentary', 'no-cost', 'gratis']
};

// Generate keyphrases based on input and options
export const generateKeyphrases = (
  seed: string,
  options: GeneratorOptions
): string[] => {
  const seedWords = seed
    .toLowerCase()
    .split(/[,\n]/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
  
  if (seedWords.length === 0) return [];
  
  const result: string[] = [];
  
  // Basic keyphrases from seed
  seedWords.forEach(word => {
    result.push(word);
    
    // Add with modifiers if enabled
    if (options.useModifiers) {
      // Add some prefix modifiers
      prefixModifiers
        .slice(0, 5)
        .forEach(prefix => {
          result.push(`${prefix} ${word}`);
        });
      
      // Add some suffix modifiers
      suffixModifiers
        .slice(0, 5)
        .forEach(suffix => {
          result.push(`${word} ${suffix}`);
        });
    }
    
    // Add question formats if enabled
    if (options.useQuestionsFormat) {
      questionStarters
        .slice(0, 3)
        .forEach(question => {
          result.push(`${question} ${word}?`);
        });
    }
  });
  
  // Add combinations of seed words
  if (seedWords.length > 1) {
    for (let i = 0; i < seedWords.length; i++) {
      for (let j = i + 1; j < seedWords.length; j++) {
        result.push(`${seedWords[i]} ${seedWords[j]}`);
        result.push(`${seedWords[j]} ${seedWords[i]}`);
      }
    }
  }
  
  // Add synonyms if enabled
  if (options.useSynonyms) {
    const synPhrases: string[] = [];
    
    seedWords.forEach(word => {
      // Find words that might have synonyms
      Object.keys(commonSynonyms).forEach(key => {
        if (word.includes(key)) {
          commonSynonyms[key].forEach(synonym => {
            const newPhrase = word.replace(key, synonym);
            synPhrases.push(newPhrase);
          });
        }
      });
    });
    
    result.push(...synPhrases);
  }
  
  // Deduplicate and limit to requested quantity
  const uniqueResults = [...new Set(result)];
  
  // Shuffle array to randomize results
  const shuffled = uniqueResults.sort(() => 0.5 - Math.random());
  
  // Return limited quantity
  return shuffled.slice(0, options.quantity);
};
