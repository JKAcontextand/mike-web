export type Language = 'en' | 'da' | 'sv' | 'no' | 'de';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  speechRecognitionCode: string;
}

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    disclaimer: {
      title: string;
      content: string;
    };
  };

  modes: {
    standard: {
      label: string;
      tooltip: string;
    };
    kaizen: {
      label: string;
      tooltip: string;
    };
    trainer: {
      label: string;
      tooltip: string;
    };
  };

  chat: {
    inputPlaceholder: string;
    sendButton: string;
    privacyNotice: string;
    voiceInputStart: string;
    voiceInputStop: string;
    voiceInputError: string;
    voiceInputUnsupported: string;
  };

  welcome: {
    standard: {
      greeting: string;
      description: string;
      privacyNotice: string;
      openingQuestion: string;
    };
    kaizen: {
      greeting: string;
      description: string;
      privacyNotice: string;
      openingQuestion: string;
    };
    trainer: {
      greeting: string;
      description: string;
      instruction: string;
      reminder: string;
      ready: string;
    };
  };

  a11y: {
    toggleDarkMode: string;
    toggleLanguage: string;
  };
}
