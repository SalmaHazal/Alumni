import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

import enTranslation from '../public/assets/locales/en/en/translation.json';
import frTranslation from '../public/assets/locales/en/fr/translation.json';
import arTranslation from '../public/assets/locales/en/ar/translation.json';
import taTranslation from '../public/assets/locales/en/ta/translation.json';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      ar: {
        translation: arTranslation,
      },
      ta: {
        translation: taTranslation,
      },
    },
    lng: savedLanguage, // Default language
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    },
    
    supportedLngs: ['en', 'fr', 'ar','ta'],
  });
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng); // Save the selected language to localStorage
  });

export default i18n;
