import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/translation.json";
import it from "../public/locales/it/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
  },
  lng: "it",           // 👈 Initial language set to Italian
  fallbackLng: "it",   // 👈 Fallback also Italian (instead of English)
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
