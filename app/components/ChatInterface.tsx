'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Message, MessageClassification, ClassificationStats, CoachingMode } from '@/lib/types';
import { useTranslations } from '@/lib/i18n';
import LanguageSelector from './LanguageSelector';
import ClassificationBadge from './ClassificationBadge';
import ClassificationStatsComponent from './ClassificationStats';
import CleanLanguageSelector from './CleanLanguageSelector';
import { classifyMessage, learnFromReclassification } from '@/lib/classificationUtils';
import { detectCrisis, shouldShowCrisisModal, CrisisType } from '@/lib/crisisDetection';
import CrisisModal from './CrisisModal';

export default function ChatInterface() {
  const { language, changeLanguage, t, config, mounted: i18nMounted } = useTranslations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coachingMode, setCoachingMode] = useState<CoachingMode>('standard');
  const [isRecording, setIsRecording] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load dark mode preference on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem('mike-dark-mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Apply dark mode class when darkMode state changes
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  // Load coaching mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('mike-coaching-mode');
    if (savedMode === 'kaizen' || savedMode === 'standard') {
      setCoachingMode(savedMode);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input after loading completes
  useEffect(() => {
    if (!isLoading && mounted) {
      inputRef.current?.focus();
    }
  }, [isLoading, mounted]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = config.speechRecognitionCode;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + (prev ? ' ' : '') + transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setError({ message: t.chat.voiceInputError });
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [config, t]);

  // Show initial Mike greeting based on coaching mode
  useEffect(() => {
    if (messages.length === 0 && i18nMounted) {
      // Trainer mode has different welcome structure
      if (coachingMode === 'trainer') {
        const welcomeText = `${t.welcome.trainer.greeting}\n\n${t.welcome.trainer.description}\n\n${t.welcome.trainer.instruction}\n\n${t.welcome.trainer.reminder}`;
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: welcomeText,
          timestamp: new Date(),
        };

        // Automatically send the opening Clean Language question
        const openingQuestion: Message = {
          id: 'opening-question',
          role: 'user',
          content: 'And what would you like to have happen?',
          timestamp: new Date(),
        };

        setMessages([welcomeMessage, openingQuestion]);
        setIsLoading(true);

        // Send to API to get Mike's response as client
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [welcomeMessage, openingQuestion].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            mode: 'trainer',
            language: language,
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              const errorType = errorData.errorType || 'unknown';
              throw { message: errorData.error || `API error: ${response.status}`, type: errorType };
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';
            const assistantId = crypto.randomUUID();

            setMessages((prev) => [
              ...prev,
              {
                id: assistantId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
              },
            ]);

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                      setIsLoading(false);
                      break;
                    }

                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.text) {
                        assistantContent += parsed.text;
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === assistantId
                              ? { ...msg, content: assistantContent }
                              : msg
                          )
                        );
                      }
                    } catch (e) {
                      // Skip parse errors
                    }
                  }
                }
              }
            }

            // Classify Mike's response in trainer mode
            if (assistantContent) {
              const classification = classifyMessage(assistantContent, language);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, classification }
                    : msg
                )
              );
            }

            setIsLoading(false);
          })
          .catch((err: any) => {
            console.error('Opening question error:', err);
            setError({
              message: err?.message || (err instanceof Error ? err.message : 'Failed to send message'),
              type: err?.type,
            });
            setIsLoading(false);
          });
      } else {
        const modeKey = coachingMode === 'kaizen' ? 'kaizen' : 'standard';
        const welcomeText = `${t.welcome[modeKey].greeting}\n\n${t.welcome[modeKey].description}\n\n${t.welcome[modeKey].privacyNotice}`;
        const openingQuestion = t.welcome[modeKey].openingQuestion;

        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: welcomeText,
          timestamp: new Date(),
        };

        const questionMessage: Message = {
          id: 'opening-question',
          role: 'assistant',
          content: openingQuestion,
          timestamp: new Date(),
        };

        setMessages([welcomeMessage, questionMessage]);
      }
    }
  }, [messages.length, coachingMode, i18nMounted, t]);

  // Reset messages when language changes
  useEffect(() => {
    if (i18nMounted && messages.length > 0) {
      setMessages([]);
    }
  }, [language, i18nMounted]);

  // Compute classification stats
  const stats = useMemo<ClassificationStats>(() => {
    return messages.reduce((acc, msg) => {
      // In standard mode: count user (client) messages
      // In trainer mode: count assistant (Mike as client) messages
      const shouldCount = (coachingMode === 'trainer' && msg.role === 'assistant') ||
                          (coachingMode === 'standard' && msg.role === 'user');

      if (shouldCount && msg.classification) {
        if (msg.classification === 'obstacle') acc.obstacles++;
        else if (msg.classification === 'reflection') acc.reflections++;
        else if (msg.classification === 'outcome') acc.outcomes++;
      }
      return acc;
    }, { obstacles: 0, reflections: 0, outcomes: 0 });
  }, [messages, coachingMode]);

  // Update message classification
  const updateClassification = (messageId: string, classification: MessageClassification) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          // Learn from the reclassification
          learnFromReclassification(msg.content, classification);
          return { ...msg, classification };
        }
        return msg;
      })
    );
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || sessionEnded) return;

    // Check for crisis signals before sending
    const crisisType = detectCrisis(input.trim());
    if (shouldShowCrisisModal(crisisType)) {
      setShowCrisisModal(true);
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      // Classify in standard and trainer modes
      classification: (coachingMode === 'standard' || coachingMode === 'trainer')
        ? classifyMessage(input.trim(), language)
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          mode: coachingMode,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorType = errorData.errorType || 'unknown';
        throw { message: errorData.error || `API error: ${response.status}`, type: errorType };
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      // Create placeholder for streaming
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsLoading(false);
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantContent += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: assistantContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Skip parse errors
              }
            }
          }
        }
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Send message error:', err);
      setError({
        message: err?.message || (err instanceof Error ? err.message : 'Failed to send message'),
        type: err?.type,
      });
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('mike-dark-mode', String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleModeChange = (newMode: CoachingMode) => {
    setCoachingMode(newMode);
    localStorage.setItem('mike-coaching-mode', newMode);
    // Reset messages to show new greeting
    setMessages([]);
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      setError({ message: t.chat.voiceInputUnsupported });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleCrisisAcknowledge = () => {
    setShowCrisisModal(false);
    setSessionEnded(true);
    setInput('');
    // Add a system message indicating the session has ended
    const crisisMessage: Message = {
      id: 'crisis-end',
      role: 'assistant',
      content: t.crisis.message + '\n\n' + t.crisis.resourcesIntro + '\n' + t.crisis.hotline.name + ': ' + t.crisis.hotline.number + ' (' + t.crisis.hotline.available + ')',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, crisisMessage]);
  };

  const handleCrisisClose = () => {
    setShowCrisisModal(false);
    // Don't end session, just close modal - user can continue but message wasn't sent
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-gray-900 transition-colors">
      {/* Header - Compact */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white p-3 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{t.header.title}</h1>
              {/* Disclaimer Tooltip */}
              <div className="group relative">
                <svg
                  className="w-5 h-5 text-yellow-300 cursor-help"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label={t.header.disclaimer.title}
                >
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {/* Tooltip */}
                <div className="absolute left-0 top-8 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <p className="font-semibold mb-2">{t.header.disclaimer.title}</p>
                  <p className="text-gray-200">
                    {t.header.disclaimer.content}
                  </p>
                  {/* Arrow */}
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>
            </div>
            <span className="text-xs text-blue-100">
              {t.header.subtitle}
            </span>

            {/* Classification Stats - Inline in Header */}
            {(coachingMode === 'standard' || coachingMode === 'trainer') && messages.some(m => m.role === 'user') && (
              <div className="flex gap-3 text-xs">
                <span className="bg-blue-800 dark:bg-blue-950 px-2 py-0.5 rounded">
                  Obstacle: {stats.obstacles}
                </span>
                <span className="bg-blue-800 dark:bg-blue-950 px-2 py-0.5 rounded">
                  Outcome: {stats.outcomes}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {/* Coaching Mode Selector */}
            <div className="flex bg-blue-800 dark:bg-blue-950 rounded-lg p-1">
              {/* Standard Mode Button with Tooltip */}
              <div className="group relative">
                <button
                  onClick={() => handleModeChange('standard')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    coachingMode === 'standard'
                      ? 'bg-white text-blue-600 font-medium'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {t.modes.standard.label}
                </button>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <p className="text-gray-200">
                    {t.modes.standard.tooltip}
                  </p>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>

              {/* Kaizen Mode Button with Tooltip */}
              <div className="group relative">
                <button
                  onClick={() => handleModeChange('kaizen')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    coachingMode === 'kaizen'
                      ? 'bg-white text-blue-600 font-medium'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {t.modes.kaizen.label}
                </button>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <p className="text-gray-200">
                    {t.modes.kaizen.tooltip}
                  </p>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>

              {/* Trainer Mode Button with Tooltip */}
              <div className="group relative">
                <button
                  onClick={() => handleModeChange('trainer')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    coachingMode === 'trainer'
                      ? 'bg-white text-blue-600 font-medium'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {t.modes.trainer.label}
                </button>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                  <p className="text-gray-200">
                    {t.modes.trainer.tooltip}
                  </p>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={changeLanguage}
              a11yLabel={t.a11y.toggleLanguage}
            />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-blue-800 dark:bg-blue-950 hover:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
              aria-label={t.a11y.toggleDarkMode}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-md relative ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              {/* Show classification badges:
                  - In standard mode: on user (client) messages
                  - In trainer mode: on assistant (Mike as client) messages */}
              {((msg.role === 'user' && coachingMode === 'standard') ||
                (msg.role === 'assistant' && coachingMode === 'trainer')) && (
                <div className="absolute top-2 right-2">
                  <ClassificationBadge
                    classification={msg.classification}
                    onClassificationChange={(newClass) => updateClassification(msg.id, newClass)}
                    language={language}
                  />
                </div>
              )}
              <p className={`whitespace-pre-wrap leading-relaxed ${
                (msg.role === 'user' && coachingMode === 'standard') ||
                (msg.role === 'assistant' && coachingMode === 'trainer')
                  ? 'pr-20'
                  : ''
              }`}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className={`mx-6 mb-4 border-l-4 p-4 rounded ${
          error.type === 'rate_limit' || error.type === 'overloaded'
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
            : error.type === 'quota_exceeded' || error.type === 'daily_limit' || error.type === 'monthly_limit'
            ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500'
        }`}>
          {error.type === 'rate_limit' ? (
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">{t.errors.rateLimit.title}</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">{t.errors.rateLimit.message}</p>
              <p className="text-amber-600 dark:text-amber-500 text-xs mt-2">{t.errors.rateLimit.suggestion}</p>
            </div>
          ) : error.type === 'daily_limit' ? (
            <div>
              <p className="font-semibold text-rose-800 dark:text-rose-300">{t.errors.dailyLimitReached.title}</p>
              <p className="text-rose-700 dark:text-rose-400 text-sm mt-1">{t.errors.dailyLimitReached.message}</p>
              <p className="text-rose-600 dark:text-rose-500 text-xs mt-2">{t.errors.dailyLimitReached.suggestion}</p>
            </div>
          ) : error.type === 'monthly_limit' ? (
            <div>
              <p className="font-semibold text-rose-800 dark:text-rose-300">{t.errors.monthlyLimitReached.title}</p>
              <p className="text-rose-700 dark:text-rose-400 text-sm mt-1">{t.errors.monthlyLimitReached.message}</p>
              <p className="text-rose-600 dark:text-rose-500 text-xs mt-2">{t.errors.monthlyLimitReached.suggestion}</p>
            </div>
          ) : error.type === 'quota_exceeded' ? (
            <div>
              <p className="font-semibold text-rose-800 dark:text-rose-300">{t.errors.quotaExceeded.title}</p>
              <p className="text-rose-700 dark:text-rose-400 text-sm mt-1">{t.errors.quotaExceeded.message}</p>
              <p className="text-rose-600 dark:text-rose-500 text-xs mt-2">{t.errors.quotaExceeded.suggestion}</p>
            </div>
          ) : error.type === 'overloaded' ? (
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">{t.errors.overloaded.title}</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">{t.errors.overloaded.message}</p>
              <p className="text-amber-600 dark:text-amber-500 text-xs mt-2">{t.errors.overloaded.suggestion}</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">{t.errors.generic.title}</p>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">{t.errors.generic.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Input - Different UI for Trainer mode */}
      {coachingMode === 'trainer' ? (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <CleanLanguageSelector
            messages={messages}
            onQuestionSelect={(question) => {
              setInput(question);
              // Auto-submit the selected question
              const userMessage: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: question,
                timestamp: new Date(),
                // Don't classify trainer's questions - only Mike's responses matter
              };
              setMessages((prev) => [...prev, userMessage]);
              setInput('');
              setIsLoading(true);
              setError(null);

              // Send to API
              fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: [...messages, userMessage].map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                  })),
                  mode: coachingMode,
                  language: language,
                }),
              })
                .then(async (response) => {
                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorType = errorData.errorType || 'unknown';
                    throw { message: errorData.error || `API error: ${response.status}`, type: errorType };
                  }

                  const reader = response.body?.getReader();
                  const decoder = new TextDecoder();
                  let assistantContent = '';
                  const assistantId = crypto.randomUUID();

                  setMessages((prev) => [
                    ...prev,
                    {
                      id: assistantId,
                      role: 'assistant',
                      content: '',
                      timestamp: new Date(),
                    },
                  ]);

                  if (reader) {
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;

                      const chunk = decoder.decode(value);
                      const lines = chunk.split('\n');

                      for (const line of lines) {
                        if (line.startsWith('data: ')) {
                          const data = line.slice(6);
                          if (data === '[DONE]') {
                            setIsLoading(false);
                            break;
                          }

                          try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                              assistantContent += parsed.text;
                              setMessages((prev) =>
                                prev.map((msg) =>
                                  msg.id === assistantId
                                    ? { ...msg, content: assistantContent }
                                    : msg
                                )
                              );
                            }
                          } catch (e) {
                            // Skip parse errors
                          }
                        }
                      }
                    }
                  }

                  // Classify Mike's response in trainer mode
                  if (assistantContent) {
                    const classification = classifyMessage(assistantContent, language);
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantId
                          ? { ...msg, classification }
                          : msg
                      )
                    );
                  }

                  setIsLoading(false);
                })
                .catch((err: any) => {
                  console.error('Send message error:', err);
                  setError({
                    message: err?.message || (err instanceof Error ? err.message : 'Failed to send message'),
                    type: err?.type,
                  });
                  setIsLoading(false);
                });
            }}
            disabled={isLoading || sessionEnded}
          />
        </div>
      ) : !sessionEnded ? (
        <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || sessionEnded}
              placeholder={sessionEnded ? '' : t.chat.inputPlaceholder}
              className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 transition-colors"
              maxLength={2000}
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={isLoading || sessionEnded}
              className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed font-medium transition-colors ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
              aria-label={isRecording ? t.chat.voiceInputStop : t.chat.voiceInputStart}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim() || sessionEnded}
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {t.chat.sendButton}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            {t.chat.privacyNotice}
          </p>
        </form>
      ) : null}

      {/* Session ended message */}
      {sessionEnded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {t.crisis.message}
          </p>
        </div>
      )}

      {/* Crisis Modal */}
      <CrisisModal
        isOpen={showCrisisModal}
        onClose={handleCrisisClose}
        onAcknowledge={handleCrisisAcknowledge}
        t={t}
      />
    </div>
  );
}
