import { Translations } from '../types';

export const sv: Translations = {
  header: {
    title: 'Mike',
    subtitle: 'Clean Language Coachningsassistent',
    disclaimer: {
      title: 'Viktig Ansvarsfriskrivning',
      content: 'Jag är inte en licensierad professionell coach eller terapeut. Jag har ingen formell utbildning eller licens, och jag kan inte ersätta professionella coachnings- eller terapitjänster. Jag är ett verktyg för självreflektion och utforskning.',
    },
  },

  modes: {
    standard: {
      label: 'Standard',
      tooltip: 'Utforska genom respektfulla frågor och upptäck dina egna insikter med Clean Language-principer.',
    },
    kaizen: {
      label: 'Kaizen',
      tooltip: 'Små steg-tillvägagångssätt: Milda frågor och små uppnåeliga åtgärder som kringgår motstånd.',
    },
    trainer: {
      label: 'Tränare',
      tooltip: 'Öva Clean Language-coachning. Mike spelar klientrollen, du övar på att ställa CL-frågor.',
    },
  },

  chat: {
    inputPlaceholder: 'Skriv ditt meddelande...',
    sendButton: 'Skicka',
    privacyNotice: 'Din konversation är privat och kommer att rensas när du uppdaterar sidan.',
    voiceInputStart: 'Starta röstinmatning',
    voiceInputStop: 'Stoppa inspelning',
    voiceInputError: 'Röstinmatning misslyckades. Försök igen.',
    voiceInputUnsupported: 'Röstinmatning stöds inte i din webbläsare. Använd Chrome, Edge eller Safari.',
  },

  welcome: {
    standard: {
      greeting: 'Hej, jag är Mike - en AI-coachningsassistent som använder Clean Language och FOTO-principer.',
      description: 'Jag använder Clean Language och FOTO-principer för att hjälpa dig utforska ditt tänkande genom tankeväckande frågor och upptäcka dina egna insikter. Detta tillvägagångssätt respekterar din visdom och hjälper dig hitta klarhet genom respektfull utforskning.',
      privacyNotice: 'Denna konversation är helt privat - inget sparas eller spelas in. När du uppdaterar denna sida kommer vår konversation att rensas.',
      openingQuestion: 'Vad vill du ska hända?',
    },
    kaizen: {
      greeting: 'Hej, jag är Mike - din AI-coachningsassistent i Kaizen-läge, fokuserad på kontinuerlig förbättring.',
      description: 'Jag använder Clean Language med ett Kaizen-tillvägagångssätt—fokuserat på små steg för kontinuerlig förbättring. Jag hjälper dig utforska ditt tänkande och vägleder dig mot små, uppnåeliga åtgärder som känns hanterbara. Detta milda tillvägagångssätt minskar motstånd och bygger momentum genom små framgångar.',
      privacyNotice: 'Denna konversation är helt privat - inget sparas eller spelas in. När du uppdaterar denna sida kommer vår konversation att rensas.',
      openingQuestion: 'Vilket litet steg vill du utforska idag?',
    },
    trainer: {
      greeting: 'Välkommen till Träna Tränaren-läge!',
      description: 'I detta läge spelar jag rollen som en coachningsklient med en verklig utmaning eller ett mål. Du övar Clean Language-coachningstekniker genom att välja från autentiska Clean Language-frågor.',
      instruction: 'Jag har fått ett scenario och är redo att bli coachad. Börja med att välja en Clean Language-fråga att ställa till mig.',
      reminder: 'Kom ihåg: I Clean Language använder du mina exakta ord och ställer minimala, icke-ledande frågor för att hjälpa mig utforska mitt eget tänkande.',
      ready: 'Välj din första fråga när du är redo.',
    },
  },

  a11y: {
    toggleDarkMode: 'Växla mörkt läge',
    toggleLanguage: 'Byt språk',
  },

  errors: {
    rateLimit: {
      title: 'Tar en Kort Paus',
      message: 'Mike är väldigt populär just nu! Systemet har nått sin kapacitetsgräns för tillfället.',
      suggestion: 'Vänta några minuter och försök igen. Administratören har meddelats.',
    },
    overloaded: {
      title: 'Hög Efterfrågan',
      message: 'AI-tjänsten upplever hög efterfrågan just nu.',
      suggestion: 'Vänta en stund och försök igen.',
    },
    generic: {
      title: 'Något Gick Fel',
      message: 'Ett oväntat fel uppstod. Försök igen.',
    },
  },

  crisis: {
    title: 'Vi Bryr Oss Om Dig',
    message: 'Det låter som att du kanske går igenom en mycket svår tid. Mike kan inte ge dig det stöd du behöver just nu.',
    resourcesIntro: 'Kontakta utbildade yrkespersoner som kan hjälpa:',
    hotline: {
      name: 'Mind Självmordslinjen',
      number: '90101',
      available: 'Dygnet runt, alla dagar',
    },
    additionalResources: 'Du kan också kontakta akutmottagningen eller din vårdcentral.',
    emergencyNote: 'Om du är i omedelbar fara, ring 112.',
    acknowledgment: 'Jag förstår och har noterat dessa resurser',
    closeButton: 'Stäng',
  },
};
