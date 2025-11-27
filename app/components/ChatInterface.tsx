'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';

type CoachingMode = 'standard' | 'kaizen';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coachingMode, setCoachingMode] = useState<CoachingMode>('standard');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + (prev ? ' ' : '') + transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setError('Voice input failed. Please try again.');
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Show initial Mike greeting based on coaching mode
  useEffect(() => {
    if (messages.length === 0) {
      const standardGreeting = `Hello, I'm Mike - an AI coaching assistant using Clean Language and FOTO principles.

**Important Disclaimer:** I am not a licensed professional coach or therapist. I have no formal training or licensing, and I cannot replace professional coaching or therapy services. I'm a tool for self-reflection and exploration.

This conversation is completely private - nothing is stored or recorded. When you refresh this page, our conversation will be cleared.

What would you like to have happen?`;

      const kaizenGreeting = `Hello, I'm Mike - your AI coaching assistant in Kaizen mode, focused on continuous improvement.

**Important Disclaimer:** I am not a licensed professional coach or therapist. I have no formal training or licensing, and I cannot replace professional coaching or therapy services. I'm a tool for self-reflection and exploration.

This conversation is completely private - nothing is stored or recorded. When you refresh this page, our conversation will be cleared.

What small step would you like to explore today?`;

      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        content: coachingMode === 'kaizen' ? kaizenGreeting : standardGreeting,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [messages.length, coachingMode]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
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
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
    } catch (err) {
      console.error('Send message error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to send message'
      );
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
      setError('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
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

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Mike</h1>
            <p className="text-sm text-blue-100 mt-1">
              Clean Language Coaching Assistant
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Coaching Mode Selector */}
            <div className="flex bg-blue-800 dark:bg-blue-950 rounded-lg p-1">
              <button
                onClick={() => handleModeChange('standard')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  coachingMode === 'standard'
                    ? 'bg-white text-blue-600 font-medium'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => handleModeChange('kaizen')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  coachingMode === 'kaizen'
                    ? 'bg-white text-blue-600 font-medium'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                Kaizen
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-blue-800 dark:bg-blue-950 hover:bg-blue-900 dark:hover:bg-blue-800 transition-colors"
              aria-label="Toggle dark mode"
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
              className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-md ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
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
        <div className="mx-6 mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 transition-colors"
            maxLength={2000}
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={startVoiceInput}
            disabled={isLoading}
            className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed font-medium transition-colors ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Your conversation is private and will be cleared when you refresh the page.
        </p>
      </form>
    </div>
  );
}
