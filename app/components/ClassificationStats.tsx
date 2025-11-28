'use client';

import { ClassificationStats } from '@/lib/types';
import { getClassificationLabel } from '@/lib/classificationUtils';

interface ClassificationStatsProps {
  stats: ClassificationStats;
  language: string;
  showReflections?: boolean;
}

export default function ClassificationStatsComponent({
  stats,
  language,
  showReflections = false,
}: ClassificationStatsProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="max-w-4xl mx-auto flex justify-between items-center text-sm px-20">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300">
            {getClassificationLabel('obstacle', language)}: <span className="font-semibold">{stats.obstacles}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300">
            {getClassificationLabel('outcome', language)}: <span className="font-semibold">{stats.outcomes}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
