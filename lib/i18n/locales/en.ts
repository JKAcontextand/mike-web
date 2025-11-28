import { Translations } from '../types';

export const en: Translations = {
  header: {
    title: 'Mike',
    subtitle: 'Clean Language Coaching Assistant',
    disclaimer: {
      title: 'Important Disclaimer',
      content: 'I am not a licensed professional coach or therapist. I have no formal training or licensing, and I cannot replace professional coaching or therapy services. I\'m a tool for self-reflection and exploration.',
    },
  },

  modes: {
    standard: {
      label: 'Standard',
      tooltip: 'Explore through respectful questions and discover your own insights using Clean Language principles.',
    },
    kaizen: {
      label: 'Kaizen',
      tooltip: 'Small steps approach: Gentle questions and tiny achievable actions that bypass resistance.',
    },
    trainer: {
      label: 'Trainer',
      tooltip: 'Practice Clean Language coaching. Mike plays the client role, you practice asking CL questions.',
    },
  },

  chat: {
    inputPlaceholder: 'Type your message...',
    sendButton: 'Send',
    privacyNotice: 'Your conversation is private and will be cleared when you refresh the page.',
    voiceInputStart: 'Start voice input',
    voiceInputStop: 'Stop recording',
    voiceInputError: 'Voice input failed. Please try again.',
    voiceInputUnsupported: 'Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.',
  },

  welcome: {
    standard: {
      greeting: 'Hello, I\'m Mike - an AI coaching assistant using Clean Language and FOTO principles.',
      description: 'I use Clean Language and FOTO principles to help you explore your thinking through thoughtful questions and discover your own insights. This approach respects your wisdom and helps you find clarity through respectful exploration.',
      privacyNotice: 'This conversation is completely private - nothing is stored or recorded. When you refresh this page, our conversation will be cleared.',
      openingQuestion: 'What would you like to have happen?',
    },
    kaizen: {
      greeting: 'Hello, I\'m Mike - your AI coaching assistant in Kaizen mode, focused on continuous improvement.',
      description: 'I use Clean Language with a Kaizen approach—focusing on small steps for continuous improvement. I\'ll help you explore your thinking and guide you toward tiny, achievable actions that feel manageable. This gentle approach reduces resistance and builds momentum through small wins.',
      privacyNotice: 'This conversation is completely private - nothing is stored or recorded. When you refresh this page, our conversation will be cleared.',
      openingQuestion: 'What small step would you like to explore today?',
    },
    trainer: {
      greeting: 'Welcome to Train the Trainer mode!',
      description: 'In this mode, I\'ll play the role of a coaching client with a real challenge or goal. You\'ll practice Clean Language coaching techniques by selecting from authentic Clean Language questions.',
      instruction: 'I\'ve been given a scenario and I\'m ready to be coached. Begin by choosing a Clean Language question to ask me.',
      reminder: 'Remember: In Clean Language, you use my exact words and ask minimal, non-leading questions to help me explore my own thinking.',
      ready: 'Choose your first question when you\'re ready.',
    },
  },

  a11y: {
    toggleDarkMode: 'Toggle dark mode',
    toggleLanguage: 'Change language',
  },
};
