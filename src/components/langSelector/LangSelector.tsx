import { useTranslation } from 'react-i18next';
import { type ChangeEvent } from 'react';
import './LangSelector.scss';

/**
 * Public Language Selector
 * Simple select dropdown for public-facing pages
 */
const LangSelector = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'uz';

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <select 
      id="language-selector" 
      value={currentLanguage} 
      onChange={handleLanguageChange} 
      className={`outline-none language-selector ${currentLanguage}`}
      aria-label="Select language"
    >
      <option value="uz" data-flag="uz">UZ</option>
      <option value="ru" data-flag="ru">RU</option>
      <option value="en" data-flag="us">ENG</option>
    </select>
  );
};

export default LangSelector;
