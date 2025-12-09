'use client';

import { Translations } from '@/lib/i18n/types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  t: Translations;
}

export default function CrisisModal({ isOpen, onClose, onAcknowledge, t }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header with heart icon */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold">{t.crisis.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t.crisis.message}
          </p>

          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
              {t.crisis.resourcesIntro}
            </p>

            {/* Hotline */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-rose-100 dark:bg-rose-800 rounded-full p-2">
                  <svg className="w-6 h-6 text-rose-600 dark:text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {t.crisis.hotline.name}
                  </p>
                  <a
                    href={`tel:${t.crisis.hotline.number.replace(/\s/g, '')}`}
                    className="text-2xl font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    {t.crisis.hotline.number}
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.crisis.hotline.available}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t.crisis.additionalResources}
          </p>

          {/* Emergency note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3">
            <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
              {t.crisis.emergencyNote}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-2">
          <button
            onClick={onAcknowledge}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
          >
            {t.crisis.acknowledgment}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
          >
            {t.crisis.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
}
