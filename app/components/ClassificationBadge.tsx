'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageClassification } from '@/lib/types';
import { getClassificationColor, getClassificationLabel } from '@/lib/classificationUtils';

interface ClassificationBadgeProps {
  classification?: MessageClassification;
  onClassificationChange: (classification: MessageClassification) => void;
  language: string;
}

export default function ClassificationBadge({
  classification = 'unclassified',
  onClassificationChange,
  language,
}: ClassificationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newClassification: MessageClassification) => {
    onClassificationChange(newClassification);
    setIsOpen(false);
  };

  const options: MessageClassification[] = ['obstacle', 'reflection', 'outcome'];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${getClassificationColor(classification)} text-white text-xs px-2 py-1 rounded-full hover:opacity-80 transition-opacity`}
        aria-label="Change classification"
      >
        {getClassificationLabel(classification, language)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm ${
                classification === option ? 'font-semibold' : ''
              } text-gray-700 dark:text-gray-200`}
            >
              <span className={`inline-block w-3 h-3 rounded-full ${getClassificationColor(option)} mr-2`}></span>
              {getClassificationLabel(option, language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
