'use client';

import { useState, useSyncExternalStore } from 'react';
import { Language, Translations, LanguageConfig } from './types';
import { en } from './locales/en';
import { da } from './locales/da';
import { sv } from './locales/sv';
import { no } from './locales/no';
import { de } from './locales/de';

export const DEFAULT_LANGUAGE: Language = 'en';
const STORAGE_KEY = 'mike-language';

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechRecognitionCode: 'en-US',
  },
  da: {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    flag: '🇩🇰',
    speechRecognitionCode: 'da-DK',
  },
  sv: {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    speechRecognitionCode: 'sv-SE',
  },
  no: {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    flag: '🇳🇴',
    speechRecognitionCode: 'nb-NO',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechRecognitionCode: 'de-DE',
  },
};

export const translations: Record<Language, Translations> = {
  en,
  da,
  sv,
  no,
  de,
};

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

// Client-side hydration detection using useSyncExternalStore
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useTranslations() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);
  };

  return {
    language,
    changeLanguage,
    t: translations[language],
    config: LANGUAGES[language],
    mounted,
  };
}

export function getLanguageConfig(language: Language): LanguageConfig {
  return LANGUAGES[language];
}

export * from './types';
