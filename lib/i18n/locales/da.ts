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
    trainer: {
      label: 'Træner',
      tooltip: 'Øv Clean Language coaching. Mike spiller klientrollen, du øver at stille CL spørgsmål.',
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
    trainer: {
      greeting: 'Velkommen til Træn Træneren tilstand!',
      description: 'I denne tilstand spiller jeg rollen som en coaching-klient med en reel udfordring eller et mål. Du øver Clean Language coaching-teknikker ved at vælge fra autentiske Clean Language spørgsmål.',
      instruction: 'Jeg har fået et scenarie og er klar til at blive coachet. Begynd ved at vælge et Clean Language spørgsmål at stille mig.',
      reminder: 'Husk: I Clean Language bruger du mine præcise ord og stiller minimale, ikke-ledende spørgsmål for at hjælpe mig med at udforske min egen tænkning.',
      ready: 'Vælg dit første spørgsmål når du er klar.',
    },
  },

  a11y: {
    toggleDarkMode: 'Skift mørk tilstand',
    toggleLanguage: 'Skift sprog',
  },

  errors: {
    rateLimit: {
      title: 'Et Øjeblik',
      message: 'For mange forespørgsler lige nu.',
      suggestion: 'Vent venligst et øjeblik og prøv igen.',
    },
    quotaExceeded: {
      title: 'Tokens Opbrugt',
      message: 'Mike er ikke tilgængelig lige nu. Den månedlige forbrugsgrænse er nået.',
      suggestion: 'Kontakt venligst administratoren. Grænsen nulstilles ved begyndelsen af hver måned.',
    },
    overloaded: {
      title: 'Stor Efterspørgsel',
      message: 'AI-tjenesten oplever stor efterspørgsel lige nu.',
      suggestion: 'Vent venligst et øjeblik og prøv igen.',
    },
    generic: {
      title: 'Noget Gik Galt',
      message: 'Der opstod en uventet fejl. Prøv venligst igen.',
    },
  },

  crisis: {
    title: 'Vi Bekymrer Os Om Dig',
    message: 'Det lyder som om du måske går igennem en meget svær tid. Mike er ikke i stand til at give dig den støtte, du har brug for lige nu.',
    resourcesIntro: 'Kontakt venligst uddannede fagfolk, der kan hjælpe:',
    hotline: {
      name: 'Livslinien',
      number: '70 201 201',
      available: 'Døgnåbent, alle dage',
    },
    additionalResources: 'Du kan også kontakte skadestuen eller din læge.',
    emergencyNote: 'Hvis du er i umiddelbar fare, ring 112.',
    acknowledgment: 'Jeg forstår og har noteret disse ressourcer',
    closeButton: 'Luk',
  },
};
