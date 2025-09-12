import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿', nativeName: 'Kiswahili' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', nativeName: 'Ikinyarwanda' }
];

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (langCode: string) => void;
  t: (key: string, options?: any) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t, ready } = useTranslation('common');

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      // Persist language choice
      localStorage.setItem('jambolush_language', langCode);
      
      // Optional: Update document direction for RTL languages
      const selectedLang = languages.find(lang => lang.code === langCode);
      if (selectedLang) {
        document.documentElement.lang = langCode;
        // Add RTL support if needed in the future
        // document.documentElement.dir = ['ar', 'he'].includes(langCode) ? 'rtl' : 'ltr';
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Set initial language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jambolush_language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Update document language when i18n language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const contextValue: LanguageContextType = {
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    t,
    isLoading: !ready
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Utility hook for translations only (lighter weight)
export const useTranslations = () => {
  const { t } = useTranslation('common');
  return t;
};