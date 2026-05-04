import { useState, useEffect } from 'react';
import { Language, translations } from '../lib/translations';

export { translations };

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kukusoft_lang') as Language;
    return saved || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('kukusoft_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'SW' : 'EN');
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    let text = translations[language][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return { language, setLanguage, toggleLanguage, t };
}
