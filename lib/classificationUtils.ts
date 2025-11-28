import { MessageClassification } from './types';

// Multilingual keywords for classification
const obstacleKeywords: Record<string, string[]> = {
  en: ['problem', 'stuck', 'can\'t', 'cannot', 'unable', 'struggle', 'struggling', 'difficult', 'difficulty', 'challenge', 'challenging', 'issue', 'worried', 'worry', 'anxious', 'anxiety', 'frustrated', 'frustration', 'confused', 'confusion', 'blocking', 'blocked', 'prevent', 'prevented', 'barrier', 'obstacle', 'hard', 'impossible', 'fail', 'failed', 'failing', 'won\'t work', 'doesn\'t work', 'not working', 'keeps happening', 'always', 'never', 'stop me', 'stopping', 'holding back', 'in the way', 'resistance'],
  da: ['problem', 'problemer', 'fast', 'sidder fast', 'kan ikke', 'ude af stand', 'kæmper', 'kæmpe', 'svært', 'svær', 'svært ved', 'udfordring', 'udfordrende', 'bekymret', 'bekymring', 'frustreret', 'frustration', 'forvirret', 'forvirring', 'blokerer', 'blokeret', 'forhindrer', 'forhindret', 'barriere', 'forhindring', 'hård', 'umulig', 'fejler', 'fejlet', 'virker ikke', 'fungerer ikke', 'bliver ved', 'altid', 'aldrig', 'stopper mig', 'holder tilbage', 'i vejen', 'modstand'],
  sv: ['problem', 'fast', 'sitter fast', 'kan inte', 'oförmögen', 'kämpar', 'kämpa', 'svårt', 'svår', 'svårt att', 'utmaning', 'utmanande', 'orolig', 'oro', 'frustrerad', 'frustration', 'förvirrad', 'förvirring', 'blockerar', 'blockerad', 'hindrar', 'hindrad', 'barriär', 'hinder', 'hård', 'omöjlig', 'misslyckas', 'misslyckades', 'fungerar inte', 'fortsätter', 'alltid', 'aldrig', 'stoppar mig', 'håller tillbaka', 'i vägen', 'motstånd'],
  no: ['problem', 'fast', 'sitter fast', 'kan ikke', 'ute av stand', 'strever', 'streve', 'vanskelig', 'vanskelighet', 'utfordring', 'utfordrende', 'bekymret', 'bekymring', 'frustrert', 'frustrasjon', 'forvirret', 'forvirring', 'blokkerer', 'blokkert', 'forhindrer', 'forhindret', 'barriere', 'hindring', 'hard', 'umulig', 'mislykkes', 'mislyktes', 'virker ikke', 'fungerer ikke', 'fortsetter', 'alltid', 'aldri', 'stopper meg', 'holder tilbake', 'i veien', 'motstand'],
  de: ['problem', 'festgefahren', 'feststecken', 'kann nicht', 'unfähig', 'kämpfe', 'kämpfen', 'schwierig', 'schwierigkeit', 'herausforderung', 'herausfordernd', 'besorgt', 'sorge', 'frustriert', 'frustration', 'verwirrt', 'verwirrung', 'blockiert', 'verhindert', 'barriere', 'hindernis', 'hart', 'unmöglich', 'scheitern', 'gescheitert', 'funktioniert nicht', 'geht nicht', 'immer wieder', 'immer', 'nie', 'stoppt mich', 'hält zurück', 'im weg', 'widerstand'],
};

const outcomeKeywords: Record<string, string[]> = {
  en: ['achieved', 'accomplish', 'accomplished', 'complete', 'completed', 'success', 'successful', 'succeed', 'reached', 'reach', 'goal', 'want to', 'want', 'will', 'plan to', 'planning', 'going to', 'better', 'improve', 'improved', 'hope', 'hoping', 'wish', 'desire', 'aspire', 'aim', 'intend', 'would like', 'dream', 'vision', 'achieve', 'solution', 'resolve', 'fix', 'overcome', 'manage', 'handle', 'able to', 'ready to', 'forward', 'progress', 'breakthrough'],
  da: ['opnået', 'opnå', 'fuldført', 'fuldføre', 'succes', 'succesfuld', 'lykkes', 'nået', 'nå', 'mål', 'vil gerne', 'vil', 'ønsker', 'planlægger', 'planlægge', 'skal til', 'bedre', 'forbedre', 'forbedret', 'håber', 'håbe', 'ønske', 'ønske mig', 'drøm', 'drømmer', 'vision', 'løsning', 'løse', 'fikse', 'overvinde', 'håndtere', 'kan', 'klar til', 'fremad', 'fremgang', 'gennembrud'],
  sv: ['uppnått', 'uppnå', 'slutfört', 'slutföra', 'framgång', 'framgångsrik', 'lyckas', 'nått', 'nå', 'mål', 'vill', 'önskar', 'ska', 'planerar', 'planera', 'kommer att', 'bättre', 'förbättra', 'förbättrat', 'hoppas', 'hoppa', 'önska', 'önskning', 'dröm', 'drömmer', 'vision', 'lösning', 'lösa', 'fixa', 'övervinna', 'hantera', 'kan', 'redo att', 'framåt', 'framsteg', 'genombrott'],
  no: ['oppnådd', 'oppnå', 'fullført', 'fullføre', 'suksess', 'vellykket', 'lykkes', 'nådd', 'nå', 'mål', 'vil', 'ønsker', 'skal', 'planlegger', 'planlegge', 'skal til', 'bedre', 'forbedre', 'forbedret', 'håper', 'håpe', 'ønske', 'ønsker meg', 'drøm', 'drømmer', 'visjon', 'løsning', 'løse', 'fikse', 'overvinne', 'håndtere', 'kan', 'klar til', 'fremover', 'fremgang', 'gjennombrudd'],
  de: ['erreicht', 'erreichen', 'abgeschlossen', 'abschließen', 'erfolg', 'erfolgreich', 'gelingen', 'erreicht', 'erreichen', 'ziel', 'möchte', 'will', 'wünsche', 'werde', 'plane', 'planen', 'werde', 'besser', 'verbessern', 'verbessert', 'hoffe', 'hoffen', 'wunsch', 'wünschen', 'traum', 'träume', 'vision', 'lösung', 'lösen', 'beheben', 'überwinden', 'bewältigen', 'kann', 'bereit', 'vorwärts', 'fortschritt', 'durchbruch'],
};

const reflectionKeywords: Record<string, string[]> = {
  en: ['think', 'thinking', 'thought', 'feel', 'feeling', 'felt', 'realize', 'realized', 'understand', 'understanding', 'learned', 'learning', 'noticed', 'notice', 'seems', 'seem', 'perhaps', 'maybe', 'wonder', 'wondering', 'consider', 'considering', 'aware', 'awareness', 'recognize', 'reflection', 'reflect', 'believe', 'sense', 'appears', 'curious'],
  da: ['tænker', 'tænker på', 'tænkte', 'føler', 'følelse', 'følte', 'indser', 'indse', 'forstår', 'forståelse', 'lærte', 'lære', 'bemærkede', 'bemærke', 'virker', 'virker som', 'måske', 'mon', 'spekulerer', 'spekulere', 'overvejer', 'overveje', 'opmærksom', 'opmærksomhed', 'anerkender', 'refleksion', 'reflekterer', 'tror', 'fornemmelse', 'ser ud til', 'nysgerrig'],
  sv: ['tänker', 'tänker på', 'tänkte', 'känner', 'känsla', 'kände', 'inser', 'inse', 'förstår', 'förståelse', 'lärde', 'lära', 'märkte', 'märka', 'verkar', 'verkar som', 'kanske', 'undrar', 'undra', 'överväger', 'överväga', 'medveten', 'medvetenhet', 'erkänner', 'reflektion', 'reflekterar', 'tror', 'känsla', 'verkar', 'nyfiken'],
  no: ['tenker', 'tenker på', 'tenkte', 'føler', 'følelse', 'følte', 'innser', 'innse', 'forstår', 'forståelse', 'lærte', 'lære', 'la merke til', 'merke', 'virker', 'virker som', 'kanskje', 'mon', 'lurer', 'lure', 'vurderer', 'vurdere', 'oppmerksom', 'oppmerksomhet', 'anerkjenner', 'refleksjon', 'reflekterer', 'tror', 'følelse', 'ser ut til', 'nysgjerrig'],
  de: ['denke', 'denken', 'dachte', 'fühle', 'fühlen', 'gefühl', 'fühlte', 'erkenne', 'erkennen', 'verstehe', 'verstehen', 'verständnis', 'gelernt', 'lernen', 'bemerkt', 'bemerken', 'scheint', 'scheinen', 'vielleicht', 'frage mich', 'fragen', 'erwäge', 'erwägen', 'bewusst', 'bewusstsein', 'anerkennen', 'reflexion', 'reflektieren', 'glaube', 'gefühl', 'erscheint', 'neugierig'],
};

// localStorage key for persisting learned keywords
const STORAGE_KEY = 'mike-learned-keywords';

// Persistent learning storage
let sessionLearning: {
  obstacle: string[];
  outcome: string[];
  reflection: string[];
} = {
  obstacle: [],
  outcome: [],
  reflection: [],
};

// Load learned keywords from localStorage
function loadLearnedKeywords() {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      sessionLearning = {
        obstacle: parsed.obstacle || [],
        outcome: parsed.outcome || [],
        reflection: parsed.reflection || [],
      };
    }
  } catch (e) {
    console.error('Failed to load learned keywords:', e);
  }
}

// Save learned keywords to localStorage
function saveLearnedKeywords() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionLearning));
  } catch (e) {
    console.error('Failed to save learned keywords:', e);
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  loadLearnedKeywords();
}

export function classifyMessage(content: string, language: string = 'en'): MessageClassification {
  const lowerContent = content.toLowerCase();
  const lang = language in obstacleKeywords ? language : 'en';

  // Check base keywords + session-learned keywords
  const obstacleScore = obstacleKeywords[lang].filter(kw => lowerContent.includes(kw)).length +
                        sessionLearning.obstacle.filter(kw => lowerContent.includes(kw)).length;
  const outcomeScore = outcomeKeywords[lang].filter(kw => lowerContent.includes(kw)).length +
                       sessionLearning.outcome.filter(kw => lowerContent.includes(kw)).length;
  const reflectionScore = reflectionKeywords[lang].filter(kw => lowerContent.includes(kw)).length +
                          sessionLearning.reflection.filter(kw => lowerContent.includes(kw)).length;

  const maxScore = Math.max(obstacleScore, outcomeScore, reflectionScore);

  // Anything not clearly obstacle or outcome is reflection
  if (maxScore === 0) return 'reflection';

  if (obstacleScore === maxScore) return 'obstacle';
  if (outcomeScore === maxScore) return 'outcome';
  if (reflectionScore === maxScore) return 'reflection';

  return 'reflection';
}

// Learn from user reclassification
export function learnFromReclassification(content: string, newClassification: MessageClassification) {
  // Extract significant words (3+ characters, not common words)
  const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use',
                       'det', 'den', 'ett', 'och', 'att', 'för', 'med', 'som', 'till', 'var', 'har', 'ett', 'men', 'vid', 'han', 'hon', 'från', 'eller', 'där',
                       'der', 'die', 'das', 'und', 'ist', 'mit', 'von', 'ein', 'für', 'auf', 'dem', 'den', 'des', 'als', 'auch', 'bei', 'nach', 'oder', 'wie'];

  const words = content.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length >= 3 && !commonWords.includes(w))
    .slice(0, 5); // Take up to 5 significant words

  // Add to session learning for the classification type
  if (newClassification === 'obstacle' || newClassification === 'outcome' || newClassification === 'reflection') {
    sessionLearning[newClassification].push(...words.filter(w =>
      !sessionLearning[newClassification].includes(w)
    ));

    // Keep session learning limited to 50 words per type
    if (sessionLearning[newClassification].length > 50) {
      sessionLearning[newClassification] = sessionLearning[newClassification].slice(-50);
    }

    // Save to localStorage
    saveLearnedKeywords();
  }
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
