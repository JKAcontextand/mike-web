import { Translations } from '../types';

export const no: Translations = {
  header: {
    title: 'Mike',
    subtitle: 'Clean Language Coachingassistent',
    disclaimer: {
      title: 'Viktig Ansvarsfraskrivelse',
      content: 'Jeg er ikke en lisensiert profesjonell coach eller terapeut. Jeg har ingen formell utdanning eller lisens, og jeg kan ikke erstatte profesjonelle coaching- eller terapitjenester. Jeg er et verktøy for selvrefleksjon og utforskning.',
    },
  },

  modes: {
    standard: {
      label: 'Standard',
      tooltip: 'Utforsk gjennom respektfulle spørsmål og oppdag dine egne innsikter ved hjelp av Clean Language-prinsipper.',
    },
    kaizen: {
      label: 'Kaizen',
      tooltip: 'Små skritt-tilnærming: Milde spørsmål og små oppnåelige handlinger som omgår motstand.',
    },
    trainer: {
      label: 'Trener',
      tooltip: 'Øv på Clean Language-coaching. Mike spiller klientrollen, du øver på å stille CL-spørsmål.',
    },
  },

  chat: {
    inputPlaceholder: 'Skriv meldingen din...',
    sendButton: 'Send',
    privacyNotice: 'Samtalen din er privat og vil bli slettet når du oppdaterer siden.',
    voiceInputStart: 'Start stemmeinput',
    voiceInputStop: 'Stopp opptak',
    voiceInputError: 'Stemmeinput feilet. Vennligst prøv igjen.',
    voiceInputUnsupported: 'Stemmeinput støttes ikke i nettleseren din. Vennligst bruk Chrome, Edge eller Safari.',
  },

  welcome: {
    standard: {
      greeting: 'Hei, jeg er Mike - en AI-coachingassistent som bruker Clean Language og FOTO-prinsipper.',
      description: 'Jeg bruker Clean Language og FOTO-prinsipper for å hjelpe deg utforske tankene dine gjennom tankevekkende spørsmål og oppdage dine egne innsikter. Denne tilnærmingen respekterer din visdom og hjelper deg finne klarhet gjennom respektfull utforskning.',
      privacyNotice: 'Denne samtalen er helt privat - ingenting lagres eller tas opp. Når du oppdaterer denne siden, vil samtalen vår bli slettet.',
      openingQuestion: 'Hva vil du gjerne skal skje?',
    },
    kaizen: {
      greeting: 'Hei, jeg er Mike - din AI-coachingassistent i Kaizen-modus, fokusert på kontinuerlig forbedring.',
      description: 'Jeg bruker Clean Language med en Kaizen-tilnærming—fokusert på små skritt for kontinuerlig forbedring. Jeg vil hjelpe deg utforske tankene dine og veilede deg mot små, oppnåelige handlinger som føles håndterbare. Denne milde tilnærmingen reduserer motstand og bygger momentum gjennom små seire.',
      privacyNotice: 'Denne samtalen er helt privat - ingenting lagres eller tas opp. Når du oppdaterer denne siden, vil samtalen vår bli slettet.',
      openingQuestion: 'Hvilket lite skritt vil du gjerne utforske i dag?',
    },
    trainer: {
      greeting: 'Velkommen til Tren Treneren-modus!',
      description: 'I denne modusen spiller jeg rollen som en coachingklient med en ekte utfordring eller et mål. Du øver på Clean Language-coachingteknikker ved å velge fra autentiske Clean Language-spørsmål.',
      instruction: 'Jeg har fått et scenario og er klar til å bli coachet. Begynn med å velge et Clean Language-spørsmål å stille meg.',
      reminder: 'Husk: I Clean Language bruker du mine eksakte ord og stiller minimale, ikke-ledende spørsmål for å hjelpe meg utforske min egen tenkning.',
      ready: 'Velg ditt første spørsmål når du er klar.',
    },
  },

  a11y: {
    toggleDarkMode: 'Bytt mørk modus',
    toggleLanguage: 'Bytt språk',
  },

  errors: {
    rateLimit: {
      title: 'Et Øyeblikk',
      message: 'For mange forespørsler akkurat nå.',
      suggestion: 'Vennligst vent et øyeblikk og prøv igjen.',
    },
    quotaExceeded: {
      title: 'Tokens Brukt Opp',
      message: 'Mike er ikke tilgjengelig akkurat nå. Den månedlige bruksgrensen er nådd.',
      suggestion: 'Kontakt administratoren. Grensen tilbakestilles i begynnelsen av hver måned.',
    },
    dailyLimitReached: {
      title: 'Daglig Grense Nådd',
      message: 'Mike har nådd den daglige bruksgrensen for å sikre tilgjengelighet for alle.',
      suggestion: 'Prøv igjen i morgen. Grensen tilbakestilles ved midnatt.',
    },
    monthlyLimitReached: {
      title: 'Månedlig Grense Nådd',
      message: 'Mike har nådd den månedlige bruksgrensen.',
      suggestion: 'Prøv igjen neste måned eller kontakt administratoren.',
    },
    overloaded: {
      title: 'Høy Etterspørsel',
      message: 'AI-tjenesten opplever høy etterspørsel akkurat nå.',
      suggestion: 'Vennligst vent et øyeblikk og prøv igjen.',
    },
    generic: {
      title: 'Noe Gikk Galt',
      message: 'En uventet feil oppstod. Vennligst prøv igjen.',
    },
  },

  crisis: {
    title: 'Vi Bryr Oss Om Deg',
    message: 'Det høres ut som at du kanskje går gjennom en veldig vanskelig tid. Mike kan ikke gi deg den støtten du trenger akkurat nå.',
    resourcesIntro: 'Kontakt utdannede fagfolk som kan hjelpe:',
    hotline: {
      name: 'Kirkens SOS',
      number: '22 40 00 40',
      available: 'Døgnåpent, alle dager',
    },
    additionalResources: 'Du kan også kontakte legevakten eller din fastlege.',
    emergencyNote: 'Hvis du er i umiddelbar fare, ring 113.',
    acknowledgment: 'Jeg forstår og har notert disse ressursene',
    closeButton: 'Lukk',
  },
};
