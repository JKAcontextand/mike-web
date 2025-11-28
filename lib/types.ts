export type MessageClassification = 'obstacle' | 'reflection' | 'outcome' | 'unclassified';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  classification?: MessageClassification;
}

export interface ClassificationStats {
  obstacles: number;
  reflections: number;
  outcomes: number;
}

export type CoachingMode = 'standard' | 'kaizen' | 'trainer';

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  mode?: CoachingMode;
  language?: 'en' | 'da' | 'sv' | 'no' | 'de';
}
