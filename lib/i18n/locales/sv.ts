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
  },

  a11y: {
    toggleDarkMode: 'Växla mörkt läge',
    toggleLanguage: 'Byt språk',
  },
};
