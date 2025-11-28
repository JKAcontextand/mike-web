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
  },

  a11y: {
    toggleDarkMode: 'Bytt mørk modus',
    toggleLanguage: 'Bytt språk',
  },
};
