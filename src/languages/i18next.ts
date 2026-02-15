import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

// Supported languages in order: Uzbek (default), Russian, English
const Languages = ["uz", "ru", "en"];

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'uz', // Uzbek as default
        lng: 'uz', // Force Uzbek as initial language
        debug: false,
        supportedLngs: Languages,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "cookie", "navigator"],
            lookupCookie: "i18next",
            lookupLocalStorage: "i18nextLng",
            caches: ["localStorage", "cookie"]
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    });

export default i18n; 