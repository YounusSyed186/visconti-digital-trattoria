// components/LanguageToggle.jsx
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-2 bg-background/80 p-2 rounded-lg shadow-lg backdrop-blur-md">
      <button
        onClick={() => changeLanguage("en")}
        className="px-3 py-1 border rounded hover:bg-gold/20 transition"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("it")}
        className="px-3 py-1 border rounded hover:bg-wine/20 transition"
      >
        IT
      </button>
    </div>
  );
};

export default LanguageToggle;
