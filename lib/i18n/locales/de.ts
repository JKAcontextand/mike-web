import { Translations } from '../types';

export const de: Translations = {
  header: {
    title: 'Mike',
    subtitle: 'Clean Language Coaching-Assistent',
    disclaimer: {
      title: 'Wichtiger Haftungsausschluss',
      content: 'Ich bin kein lizenzierter professioneller Coach oder Therapeut. Ich habe keine formale Ausbildung oder Lizenz und kann keine professionellen Coaching- oder Therapiedienste ersetzen. Ich bin ein Werkzeug zur Selbstreflexion und Erforschung.',
    },
  },

  modes: {
    standard: {
      label: 'Standard',
      tooltip: 'Erkunden Sie durch respektvolle Fragen und entdecken Sie Ihre eigenen Einsichten mit Clean Language-Prinzipien.',
    },
    kaizen: {
      label: 'Kaizen',
      tooltip: 'Kleine-Schritte-Ansatz: Sanfte Fragen und winzige erreichbare Handlungen, die Widerstand umgehen.',
    },
    trainer: {
      label: 'Trainer',
      tooltip: 'Üben Sie Clean Language-Coaching. Mike spielt die Klientenrolle, Sie üben CL-Fragen zu stellen.',
    },
  },

  chat: {
    inputPlaceholder: 'Geben Sie Ihre Nachricht ein...',
    sendButton: 'Senden',
    privacyNotice: 'Ihr Gespräch ist privat und wird gelöscht, wenn Sie die Seite aktualisieren.',
    voiceInputStart: 'Spracheingabe starten',
    voiceInputStop: 'Aufnahme stoppen',
    voiceInputError: 'Spracheingabe fehlgeschlagen. Bitte versuchen Sie es erneut.',
    voiceInputUnsupported: 'Spracheingabe wird in Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome, Edge oder Safari.',
  },

  welcome: {
    standard: {
      greeting: 'Hallo, ich bin Mike - ein KI-Coaching-Assistent, der Clean Language und FOTO-Prinzipien verwendet.',
      description: 'Ich verwende Clean Language und FOTO-Prinzipien, um Ihnen zu helfen, Ihr Denken durch durchdachte Fragen zu erkunden und Ihre eigenen Einsichten zu entdecken. Dieser Ansatz respektiert Ihre Weisheit und hilft Ihnen, durch respektvolle Erforschung Klarheit zu finden.',
      privacyNotice: 'Dieses Gespräch ist vollständig privat - nichts wird gespeichert oder aufgezeichnet. Wenn Sie diese Seite aktualisieren, wird unser Gespräch gelöscht.',
      openingQuestion: 'Was soll Ihrer Meinung nach geschehen?',
    },
    kaizen: {
      greeting: 'Hallo, ich bin Mike - Ihr KI-Coaching-Assistent im Kaizen-Modus, fokussiert auf kontinuierliche Verbesserung.',
      description: 'Ich verwende Clean Language mit einem Kaizen-Ansatz—fokussiert auf kleine Schritte zur kontinuierlichen Verbesserung. Ich helfe Ihnen, Ihr Denken zu erkunden und Sie zu winzigen, erreichbaren Handlungen zu führen, die sich bewältigbar anfühlen. Dieser sanfte Ansatz reduziert Widerstand und baut Schwung durch kleine Erfolge auf.',
      privacyNotice: 'Dieses Gespräch ist vollständig privat - nichts wird gespeichert oder aufgezeichnet. Wenn Sie diese Seite aktualisieren, wird unser Gespräch gelöscht.',
      openingQuestion: 'Welchen kleinen Schritt möchten Sie heute erkunden?',
    },
    trainer: {
      greeting: 'Willkommen im Train-the-Trainer-Modus!',
      description: 'In diesem Modus spiele ich die Rolle eines Coaching-Klienten mit einer echten Herausforderung oder einem Ziel. Sie üben Clean Language-Coaching-Techniken, indem Sie aus authentischen Clean Language-Fragen wählen.',
      instruction: 'Ich habe ein Szenario erhalten und bin bereit, gecoacht zu werden. Beginnen Sie damit, eine Clean Language-Frage auszuwählen, die Sie mir stellen möchten.',
      reminder: 'Denken Sie daran: Im Clean Language verwenden Sie meine exakten Worte und stellen minimale, nicht-leitende Fragen, um mir zu helfen, mein eigenes Denken zu erkunden.',
      ready: 'Wählen Sie Ihre erste Frage, wenn Sie bereit sind.',
    },
  },

  a11y: {
    toggleDarkMode: 'Dunkelmodus umschalten',
    toggleLanguage: 'Sprache wechseln',
  },
};
