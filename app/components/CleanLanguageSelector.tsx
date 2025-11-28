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
  const [showWordInput, setShowWordInput] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [inputWord, setInputWord] = useState<string>('');
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


  const handleSelect = (question: CleanLanguageQuestion) => {
    // Check if question contains X
    if (question.question.includes(' X')) {
      // Show input modal for manual word entry
      setSelectedQuestion(question.question);
      setInputWord('');
      setShowWordInput(true);
    } else {
      // No X, send directly
      onQuestionSelect(question.question);
    }
  };

  const handleWordSubmit = () => {
    if (inputWord.trim()) {
      const finalQuestion = selectedQuestion.replace(/ X/g, ` ${inputWord.trim()}`);
      setShowWordInput(false);
      setSelectedQuestion('');
      setInputWord('');
      onQuestionSelect(finalQuestion);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleWordSubmit();
    } else if (e.key === 'Escape') {
      setShowWordInput(false);
      setInputWord('');
    }
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

      {/* Word Input Modal - Draggable */}
      {showWordInput && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-400 dark:border-blue-500 pointer-events-auto"
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
                Type word for "X"
              </h3>
            </div>

            {/* Input Field */}
            <div className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Question: <span className="font-medium">{selectedQuestion}</span>
              </p>
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type the word here..."
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Press Enter to submit, Esc to cancel
              </p>
            </div>

            {/* Buttons */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => {
                  setShowWordInput(false);
                  setInputWord('');
                }}
                className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleWordSubmit}
                disabled={!inputWord.trim()}
                className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
