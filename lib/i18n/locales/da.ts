import { Translations } from '../types';

export const da: Translations = {
  header: {
    title: 'Mike',
    subtitle: 'Clean Language Coaching Assistent',
    disclaimer: {
      title: 'Vigtig Ansvarsfraskrivelse',
      content: 'Jeg er ikke en autoriseret professionel coach eller terapeut. Jeg har ingen formel uddannelse eller licens, og jeg kan ikke erstatte professionelle coaching- eller terapitjenester. Jeg er et værktøj til selvrefleksion og udforskning.',
    },
  },

  modes: {
    standard: {
      label: 'Standard',
      tooltip: 'Udforsk gennem respektfulde spørgsmål og find dine egne indsigter ved hjælp af Clean Language principper.',
    },
    kaizen: {
      label: 'Kaizen',
      tooltip: 'Små skridt tilgang: Blide spørgsmål og små opnåelige handlinger der omgår modstand.',
    },
  },

  chat: {
    inputPlaceholder: 'Skriv din besked...',
    sendButton: 'Send',
    privacyNotice: 'Din samtale er privat og vil blive slettet når du opdaterer siden.',
    voiceInputStart: 'Start stemmeinput',
    voiceInputStop: 'Stop optagelse',
    voiceInputError: 'Stemmeinput fejlede. Prøv venligst igen.',
    voiceInputUnsupported: 'Stemmeinput understøttes ikke i din browser. Brug venligst Chrome, Edge eller Safari.',
  },

  welcome: {
    standard: {
      greeting: 'Hej, jeg er Mike - en AI coaching assistent der bruger Clean Language og FOTO principper.',
      description: 'Jeg bruger Clean Language og FOTO principper til at hjælpe dig med at udforske din tænkning gennem tankevækkende spørgsmål og finde dine egne indsigter. Denne tilgang respekterer din visdom og hjælper dig med at finde klarhed gennem respektfuld udforskning.',
      privacyNotice: 'Denne samtale er fuldstændig privat - intet gemmes eller optages. Når du opdaterer denne side, vil vores samtale blive slettet.',
      openingQuestion: 'Hvad vil du gerne have sker?',
    },
    kaizen: {
      greeting: 'Hej, jeg er Mike - din AI coaching assistent i Kaizen tilstand, fokuseret på kontinuerlig forbedring.',
      description: 'Jeg bruger Clean Language med en Kaizen tilgang—fokuseret på små skridt til kontinuerlig forbedring. Jeg vil hjælpe dig med at udforske din tænkning og guide dig mod små, opnåelige handlinger der føles håndterbare. Denne blide tilgang reducerer modstand og skaber momentum gennem små sejre.',
      privacyNotice: 'Denne samtale er fuldstændig privat - intet gemmes eller optages. Når du opdaterer denne side, vil vores samtale blive slettet.',
      openingQuestion: 'Hvilket lille skridt vil du gerne udforske i dag?',
    },
  },

  a11y: {
    toggleDarkMode: 'Skift mørk tilstand',
    toggleLanguage: 'Skift sprog',
  },
};
