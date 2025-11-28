import { MessageClassification } from './types';

// Multilingual keywords for classification
const obstacleKeywords: Record<string, string[]> = {
  en: ['problem', 'stuck', 'can\'t', 'cannot', 'struggle', 'difficult', 'challenge', 'issue', 'worried', 'anxious', 'frustrated', 'confused', 'blocking', 'prevent'],
  da: ['problem', 'fast', 'kan ikke', 'kæmper', 'svært', 'udfordring', 'bekymret', 'frustreret', 'forvirret', 'blokerer', 'forhindrer'],
  sv: ['problem', 'fast', 'kan inte', 'kämpar', 'svårt', 'utmaning', 'orolig', 'frustrerad', 'förvirrad', 'blockerar', 'hindrar'],
  no: ['problem', 'fast', 'kan ikke', 'strever', 'vanskelig', 'utfordring', 'bekymret', 'frustrert', 'forvirret', 'blokkerer', 'forhindrer'],
  de: ['problem', 'festgefahren', 'kann nicht', 'kämpfe', 'schwierig', 'herausforderung', 'besorgt', 'frustriert', 'verwirrt', 'blockiert', 'verhindert'],
};

const outcomeKeywords: Record<string, string[]> = {
  en: ['achieved', 'accomplished', 'completed', 'success', 'reached', 'goal', 'want to', 'will', 'plan to', 'going to', 'better', 'improved', 'hope', 'wish'],
  da: ['opnået', 'fuldført', 'succes', 'nået', 'mål', 'vil gerne', 'vil', 'planlægger', 'bedre', 'forbedret', 'håber', 'ønsker'],
  sv: ['uppnått', 'slutfört', 'framgång', 'nått', 'mål', 'vill', 'ska', 'planerar', 'bättre', 'förbättrat', 'hoppas', 'önskar'],
  no: ['oppnådd', 'fullført', 'suksess', 'nådd', 'mål', 'vil', 'skal', 'planlegger', 'bedre', 'forbedret', 'håper', 'ønsker'],
  de: ['erreicht', 'abgeschlossen', 'erfolg', 'erreicht', 'ziel', 'möchte', 'werde', 'plane', 'besser', 'verbessert', 'hoffe', 'wünsche'],
};

const reflectionKeywords: Record<string, string[]> = {
  en: ['think', 'feel', 'realize', 'understand', 'learned', 'noticed', 'seems', 'perhaps', 'maybe', 'wonder', 'considering', 'aware'],
  da: ['tænker', 'føler', 'indser', 'forstår', 'lærte', 'bemærkede', 'virker', 'måske', 'spekulerer', 'overvejer', 'opmærksom'],
  sv: ['tänker', 'känner', 'inser', 'förstår', 'lärde', 'märkte', 'verkar', 'kanske', 'undrar', 'överväger', 'medveten'],
  no: ['tenker', 'føler', 'innser', 'forstår', 'lærte', 'la merke til', 'virker', 'kanskje', 'lurer', 'vurderer', 'oppmerksom'],
  de: ['denke', 'fühle', 'erkenne', 'verstehe', 'gelernt', 'bemerkt', 'scheint', 'vielleicht', 'frage mich', 'erwäge', 'bewusst'],
};

export function classifyMessage(content: string, language: string = 'en'): MessageClassification {
  const lowerContent = content.toLowerCase();
  const lang = language in obstacleKeywords ? language : 'en';

  const obstacleScore = obstacleKeywords[lang].filter(kw => lowerContent.includes(kw)).length;
  const outcomeScore = outcomeKeywords[lang].filter(kw => lowerContent.includes(kw)).length;
  const reflectionScore = reflectionKeywords[lang].filter(kw => lowerContent.includes(kw)).length;

  const maxScore = Math.max(obstacleScore, outcomeScore, reflectionScore);

  // Anything not clearly obstacle or outcome is reflection
  if (maxScore === 0) return 'reflection';

  if (obstacleScore === maxScore) return 'obstacle';
  if (outcomeScore === maxScore) return 'outcome';
  if (reflectionScore === maxScore) return 'reflection';

  return 'reflection';
}

export function getClassificationColor(classification?: MessageClassification): string {
  // Keep all classifications neutral colored
  return 'bg-gray-400 dark:bg-gray-500';
}

export function getClassificationLabel(classification?: MessageClassification, language: string = 'en'): string {
  const labels: Record<string, Record<MessageClassification, string>> = {
    en: {
      obstacle: 'Obstacle',
      outcome: 'Outcome',
      reflection: 'Reflection',
      unclassified: 'Unclassified',
    },
    da: {
      obstacle: 'Forhindring',
      outcome: 'Resultat',
      reflection: 'Refleksion',
      unclassified: 'Uklassificeret',
    },
    sv: {
      obstacle: 'Hinder',
      outcome: 'Resultat',
      reflection: 'Reflektion',
      unclassified: 'Oklassificerad',
    },
    no: {
      obstacle: 'Hindring',
      outcome: 'Resultat',
      reflection: 'Refleksjon',
      unclassified: 'Uklassifisert',
    },
    de: {
      obstacle: 'Hindernis',
      outcome: 'Ergebnis',
      reflection: 'Reflexion',
      unclassified: 'Unklassifiziert',
    },
  };

  const lang = language in labels ? language : 'en';
  return labels[lang][classification || 'unclassified'];
}
