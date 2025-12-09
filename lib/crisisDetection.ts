// Crisis detection utility
// Detects messages that may indicate self-harm or harm to others

// Keywords and phrases that may indicate crisis (multi-language)
const crisisPatterns = {
  // Self-harm indicators
  selfHarm: [
    // English
    /\b(kill|end|harm|hurt)\s*(my)?self\b/i,
    /\bsuicid(e|al)\b/i,
    /\bwant\s+to\s+die\b/i,
    /\bdon'?t\s+want\s+to\s+(live|be\s+alive|exist)\b/i,
    /\bend\s+(my\s+)?life\b/i,
    /\bbetter\s+off\s+dead\b/i,
    /\bno\s+reason\s+to\s+live\b/i,
    /\bcut(ting)?\s+myself\b/i,

    // Danish
    /\b(slå|tage)\s+(mig\s+)?ihjel\b/i,
    /\bselvmord\b/i,
    /\bvil\s+dø\b/i,
    /\bvil\s+ikke\s+leve\b/i,
    /\bgøre\s+en\s+ende\s+på\b/i,
    /\bskade\s+mig\s+selv\b/i,
    /\bskære\s+(i\s+)?mig\s+selv\b/i,

    // Swedish
    /\b(döda|ta\s+livet\s+av)\s+mig\b/i,
    /\bsjälvmord\b/i,
    /\bvill\s+dö\b/i,
    /\bvill\s+inte\s+leva\b/i,
    /\bskada\s+mig\s+själv\b/i,
    /\bskära\s+mig\b/i,

    // Norwegian
    /\b(drepe|ta\s+livet\s+av)\s+meg\b/i,
    /\bselvmord\b/i,
    /\bvil\s+dø\b/i,
    /\bvil\s+ikke\s+leve\b/i,
    /\bskade\s+meg\s+selv\b/i,
    /\bkutte\s+meg\b/i,

    // German
    /\b(mich\s+)?(umbringen|töten)\b/i,
    /\bselbstmord\b/i,
    /\bsuizid\b/i,
    /\bsterben\s+wollen\b/i,
    /\bnicht\s+(mehr\s+)?leben\s+wollen\b/i,
    /\bmich\s+selbst\s+verletzen\b/i,
    /\bmich\s+ritzen\b/i,
  ],

  // Harm to others indicators
  harmOthers: [
    // English
    /\b(kill|murder|hurt|harm)\s+(someone|them|him|her|people|my\s+(family|wife|husband|children|kids|partner))\b/i,
    /\bwant\s+to\s+(kill|hurt|harm)\b/i,
    /\bgoing\s+to\s+(kill|hurt|harm)\b/i,

    // Danish
    /\b(slå|dræbe)\s+(nogen|dem|ham|hende|min|mit|mine)\b/i,
    /\bvil\s+(slå|dræbe|skade)\b/i,

    // Swedish
    /\b(döda|skada)\s+(någon|dem|honom|henne|min|mitt|mina)\b/i,
    /\bvill\s+(döda|skada)\b/i,

    // Norwegian
    /\b(drepe|skade)\s+(noen|dem|ham|henne|min|mitt|mine)\b/i,
    /\bvil\s+(drepe|skade)\b/i,

    // German
    /\b(jemanden|sie|ihn|meine?n?)\s+(töten|umbringen|verletzen)\b/i,
    /\bwill\s+(töten|umbringen|verletzen)\b/i,
  ],
};

export type CrisisType = 'self_harm' | 'harm_others' | null;

/**
 * Detects if a message contains crisis indicators
 * @param message The user's message to check
 * @returns The type of crisis detected, or null if none
 */
export function detectCrisis(message: string): CrisisType {
  // Normalize the message
  const normalizedMessage = message.toLowerCase().trim();

  // Check for self-harm patterns
  for (const pattern of crisisPatterns.selfHarm) {
    if (pattern.test(normalizedMessage)) {
      return 'self_harm';
    }
  }

  // Check for harm to others patterns
  for (const pattern of crisisPatterns.harmOthers) {
    if (pattern.test(normalizedMessage)) {
      return 'harm_others';
    }
  }

  return null;
}

/**
 * Check if the detected crisis should show the modal
 * This allows for future refinement of detection sensitivity
 */
export function shouldShowCrisisModal(crisisType: CrisisType): boolean {
  return crisisType !== null;
}
