import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Secure Message Sharing',
      messageTab: 'Share Message',
      passwordTab: 'Generate Password',
      enterMessage: 'Enter your secure message here...',
      generatePassword: 'Generate Secure Password',
      generateLink: 'Generate Secure Link',
      generating: 'Generating...',
      secureLink: 'Your secure link:',
      linkWarning: 'This link will only work once and will expire after being viewed.',
      messageUnavailable: 'Message Unavailable',
      secureMessage: 'Secure Message',
      messageExpired: 'This message has already been viewed or has expired.',
      fetchError: 'Failed to fetch the message. It might have been already viewed or expired.',
      deleteWarning: 'This message has now been deleted and cannot be accessed again.',
      linkGenerated: 'Link Generated!',
      linkSuccess: 'The secure link has been created successfully.',
      error: 'Error',
      linkError: 'Failed to generate secure link.',
      passwordPlaceholder: 'Generated password will appear here',
    },
  },
  es: {
    translation: {
      title: 'Compartir Mensajes Seguros',
      messageTab: 'Compartir Mensaje',
      passwordTab: 'Generar Contraseña',
      enterMessage: 'Introduce tu mensaje seguro aquí...',
      generatePassword: 'Generar Contraseña Segura',
      generateLink: 'Generar Enlace Seguro',
      generating: 'Generando...',
      secureLink: 'Tu enlace seguro:',
      linkWarning: 'Este enlace solo funcionará una vez y expirará después de ser visto.',
      messageUnavailable: 'Mensaje No Disponible',
      secureMessage: 'Mensaje Seguro',
      messageExpired: 'Este mensaje ya ha sido visto o ha expirado.',
      fetchError: 'Error al obtener el mensaje. Es posible que ya haya sido visto o haya expirado.',
      deleteWarning: 'Este mensaje ha sido eliminado y no se puede acceder nuevamente.',
      linkGenerated: '¡Enlace Generado!',
      linkSuccess: 'El enlace seguro se ha creado correctamente.',
      error: 'Error',
      linkError: 'Error al generar el enlace seguro.',
      passwordPlaceholder: 'La contraseña generada aparecerá aquí',
    },
  },
  ca: {
    translation: {
      title: 'Compartir Missatges Segurs',
      messageTab: 'Compartir Missatge',
      passwordTab: 'Generar Contrasenya',
      enterMessage: 'Introdueix el teu missatge segur aquí...',
      generatePassword: 'Generar Contrasenya Segura',
      generateLink: 'Generar Enllaç Segur',
      generating: 'Generant...',
      secureLink: 'El teu enllaç segur:',
      linkWarning: 'Aquest enllaç només funcionarà una vegada i expirarà després de ser vist.',
      messageUnavailable: 'Missatge No Disponible',
      secureMessage: 'Missatge Segur',
      messageExpired: 'Aquest missatge ja ha estat vist o ha expirat.',
      fetchError: 'Error en obtenir el missatge. És possible que ja hagi estat vist o hagi expirat.',
      deleteWarning: 'Aquest missatge ha estat eliminat i no es pot accedir novament.',
      linkGenerated: 'Enllaç Generat!',
      linkSuccess: "L'enllaç segur s'ha creat correctament.",
      error: 'Error',
      linkError: "Error en generar l'enllaç segur.",
      passwordPlaceholder: 'La contrasenya generada apareixerà aquí',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;