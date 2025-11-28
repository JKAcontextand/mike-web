// Clean Language Questions Bank - Official 15-minute FOTO
// Copyright © 2017-2024 Agendashift Ltd - CC BY-SA
// From the official "And When X..." game cue card

export interface CleanLanguageQuestion {
  id: string;
  question: string;
  position: 'top-left' | 'top-right' | 'left' | 'center' | 'right';
  context?: string;
}

export const cleanLanguageQuestions: CleanLanguageQuestion[] = [
  // TOP ROW - Main questions
  {
    id: 'obstacle-in-way',
    question: "What obstacle might be in the way of X?",
    position: 'top-left',
    context: 'Identify obstacles blocking progress'
  },
  {
    id: 'what-would-like',
    question: "What would you like to have happen?",
    position: 'top-right',
    context: 'The fundamental outcome question'
  },

  // LEFT SIDE - Exploring backwards
  {
    id: 'where-come-from',
    question: "Where does X come from?",
    position: 'left',
    context: 'Explore origins of obstacles or outcomes'
  },
  {
    id: 'happens-before',
    question: "What happens before X?",
    position: 'left',
    context: 'Explore what precedes something'
  },

  // CENTER - Developing detail
  {
    id: 'what-kind',
    question: "What kind of X?",
    position: 'center',
    context: 'Develop attributes and qualities'
  },
  {
    id: 'is-happening-when',
    question: "What is happening when X?",
    position: 'center',
    context: 'Explore context and conditions'
  },
  {
    id: 'anything-else',
    question: "Is there anything else about X?",
    position: 'center',
    context: 'Develop more information'
  },

  // RIGHT SIDE - Moving forward
  {
    id: 'when-x-then',
    question: "And when X, then what happens?",
    position: 'right',
    context: 'Move time forward, explore next steps'
  },
];

// Helper function to format questions with client's words
export function formatQuestion(template: string, words: Record<string, string>): string {
  let formatted = template;
  Object.entries(words).forEach(([key, value]) => {
    formatted = formatted.replace(`[${key}]`, value);
  });
  return formatted;
}

// Get questions by category
export function getQuestionsByCategory(category: CleanLanguageQuestion['category']): CleanLanguageQuestion[] {
  return cleanLanguageQuestions.filter(q => q.category === category);
}
