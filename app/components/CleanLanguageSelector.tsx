'use client';

import { useState, useMemo } from 'react';
import { cleanLanguageQuestions, CleanLanguageQuestion } from '@/lib/cleanLanguageQuestions';
import { Message } from '@/lib/types';

interface CleanLanguageSelectorProps {
  onQuestionSelect: (question: string) => void;
  disabled?: boolean;
  messages?: Message[];
}

export default function CleanLanguageSelector({ onQuestionSelect, disabled = false, messages = [] }: CleanLanguageSelectorProps) {
  const [showWordSelector, setShowWordSelector] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Extract meaningful words from assistant messages (Mike's responses)
  const clientWords = useMemo(() => {
    const quotedWords: string[] = [];
    const contextWords: string[] = [];

    // Extensive list of common words to filter out
    const commonWords = new Set([
      'the', 'and', 'but', 'for', 'with', 'that', 'this', 'from', 'what', 'when', 'where', 'how', 'why',
      'could', 'would', 'should', 'can', 'will', 'just', 'like', 'about', 'before', 'after', 'you', 'your',
      'are', 'have', 'has', 'had', 'been', 'was', 'were', 'being', 'not', 'but', 'all', 'some', 'any',
      'more', 'much', 'very', 'too', 'now', 'then', 'than', 'also', 'only', 'well', 'back', 'even', 'still',
      'way', 'make', 'get', 'see', 'know', 'take', 'come', 'think', 'look', 'want', 'give', 'use', 'find',
      'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'keep', 'let', 'put', 'mean', 'say',
      'there', 'here', 'who', 'which', 'them', 'these', 'those', 'their', 'they', 'she', 'him', 'her', 'his',
      'myself', 'yourself', 'itself', 'ourselves', 'themselves', 'something', 'anything', 'everything', 'nothing',
      'else', 'kind', 'notice', 'said', 'asking', 'sure', 'specific', 'word', 'concept', 'shared', 'asking',
      'explore', 'further', 'more'
    ]);

    messages
      .filter(m => m.role === 'assistant')
      .forEach(msg => {
        // Priority 1: Extract quoted words (these are often the client's exact metaphors)
        const quoted = msg.content.match(/"([^"]+)"/g);
        if (quoted) {
          quoted.forEach(q => {
            const word = q.replace(/"/g, '').trim();
            // Only single words or short phrases (2-3 words max)
            if (word.length >= 3 && word.split(' ').length <= 3) {
              quotedWords.push(word);
            }
          });
        }

        // Priority 2: Extract key nouns/concepts (5+ chars, capitalized or meaningful)
        const wordTokens = msg.content.match(/\b[A-Z][a-z]+\b|\b[a-z]{5,}\b/g) || [];
        wordTokens.forEach(w => {
          const lower = w.toLowerCase();
          if (!commonWords.has(lower) && lower.length >= 5) {
            contextWords.push(lower);
          }
        });
      });

    // Prioritize quoted words, then add context words, remove duplicates, keep last 12
    const uniqueWords = [...new Set([...quotedWords, ...contextWords])];
    return uniqueWords.slice(-12);
  }, [messages]);

  const handleSelect = (question: CleanLanguageQuestion) => {
    // Check if question contains X
    if (question.question.includes(' X')) {
      if (clientWords.length === 0) {
        // No client words yet, just send the question as-is
        onQuestionSelect(question.question);
      } else {
        // Show word selector
        setSelectedQuestion(question.question);
        setShowWordSelector(true);
      }
    } else {
      // No X, send directly
      onQuestionSelect(question.question);
    }
  };

  const handleWordSelect = (word: string) => {
    const finalQuestion = selectedQuestion.replace(/ X/g, ` ${word}`);
    setShowWordSelector(false);
    setSelectedQuestion('');
    onQuestionSelect(finalQuestion);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Group questions by position matching the cue card layout
  const topLeft = cleanLanguageQuestions.filter(q => q.position === 'top-left');
  const topRight = cleanLanguageQuestions.filter(q => q.position === 'top-right');
  const left = cleanLanguageQuestions.filter(q => q.position === 'left');
  const center = cleanLanguageQuestions.filter(q => q.position === 'center');
  const right = cleanLanguageQuestions.filter(q => q.position === 'right');

  const QuestionButton = ({ q }: { q: CleanLanguageQuestion }) => (
    <button
      onClick={() => handleSelect(q)}
      disabled={disabled}
      className="w-full text-left px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
      title={q.context}
    >
      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">
        {q.question}
      </p>
    </button>
  );

  return (
    <div className="p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">15-minute FOTO</h3>
        <p className="text-[10px] text-gray-600 dark:text-gray-400">From Obstacles To Outcomes</p>
      </div>

      {/* Top Row - Main Questions */}
      <div className="grid grid-cols-2 gap-2">
        {/* Obstacles - Left */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>Obstacles</span>
            <span className="text-blue-400">←</span>
          </div>
          {topLeft.map(q => <QuestionButton key={q.id} q={q} />)}
        </div>

        {/* Outcomes - Right */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Outcomes</span>
          </div>
          {topRight.map(q => <QuestionButton key={q.id} q={q} />)}
        </div>
      </div>

      {/* Flow Arrow Section */}
      <div className="relative mt-2">
        {/* Arrow Background */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="grid grid-cols-3 gap-2 relative bg-gray-50 dark:bg-gray-900">
          {/* Left - Exploring Backwards */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center mb-1">
              ← Before
            </div>
            {left.map(q => <QuestionButton key={q.id} q={q} />)}
          </div>

          {/* Center - Developing */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center mb-1">
              Developing
            </div>
            {center.map(q => <QuestionButton key={q.id} q={q} />)}
          </div>

          {/* Right - Moving Forward */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center mb-1">
              After →
            </div>
            {right.map(q => <QuestionButton key={q.id} q={q} />)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <p>Use X for client's words • © 2017-2024 Agendashift Ltd (CC BY-SA)</p>
      </div>

      {/* Word Selector Modal - Draggable */}
      {showWordSelector && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-400 dark:border-blue-500"
            style={{
              position: 'fixed',
              left: modalPosition.x || '50%',
              top: modalPosition.y || '50%',
              transform: modalPosition.x ? 'none' : 'translate(-50%, -50%)',
              width: '320px',
              cursor: isDragging ? 'grabbing' : 'default',
            }}
          >
            {/* Draggable Header */}
            <div
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 rounded-t-lg cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <h3 className="text-sm font-semibold text-white text-center">
                Select word for "X"
              </h3>
            </div>

            {/* Word Grid */}
            <div className="p-3 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {clientWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordSelect(word)}
                    className="px-2 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-xs font-medium"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowWordSelector(false)}
                className="w-full px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
