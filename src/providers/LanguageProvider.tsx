import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'hi' | 'te' | 'gu' | 'bn' | 'ta';

// Interface for language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => Promise<string>;
}

// Create language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Google Translate API Key (Replace with your actual key)
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// Function to fetch translations from Google Translate API
const fetchTranslation = async (text: string, targetLang: string): Promise<string> => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ q: text, target: targetLang }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return data?.data?.translations[0]?.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text in case of failure
  }
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Get browser's default language
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'hi', 'te', 'gu', 'bn', 'ta'].includes(browserLang) ? (browserLang as Language) : 'en';
};

// Get initial language (from session or browser)
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLanguage = sessionStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage) return savedLanguage;
  }
  return getBrowserLanguage();
};

// Language Provider Component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());

  // Function to translate text dynamically
  const t = async (text: string): Promise<string> => {
    return fetchTranslation(text, language);
  };

  // Set language and save in session storage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('preferredLanguage', newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
