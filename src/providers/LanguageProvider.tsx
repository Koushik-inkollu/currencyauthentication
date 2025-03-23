
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export const LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  ur: 'اردو (Urdu)',
};

// Define the translation data structure
interface TranslationData {
  [key: string]: {
    [key: string]: string;
  };
}

// Define translations
const translations: TranslationData = {
  // English translations (default)
  en: {
    appTitle: "AI-Powered Tools Collection",
    appSubtitle: "Explore our suite of AI tools to boost your productivity",
    currencyAuth: "₹500 Currency Authentication",
    signInRegister: "Sign in / Register",
    myDashboard: "My Dashboard",
    uploadImage: "Upload Image",
    useCamera: "Use Camera",
    uploadNote: "Upload a ₹500 Note Image",
    captureNote: "Capture a ₹500 Note Image",
    uploadDescription: "Choose a clear, well-lit image of the full ₹500 note for best results",
    captureDescription: "Position the note clearly in the frame and ensure good lighting",
    dragDrop: "Drag and drop your file here or click to browse",
    analyzeImage: "Analyze Image",
    analyzing: "Analyzing...",
    captureImage: "Capture Image",
    retakePhoto: "Retake Photo",
    authResults: "Authentication Results",
    securityFeatures: "Security Features",
    analysisConfidence: "Analysis Confidence",
    downloadReport: "Download Report",
    anotherNote: "Analyze Another Note",
    genuine: "Genuine Currency",
    suspicious: "Suspicious Currency",
    counterfeit: "Likely Counterfeit",
    genuineDesc: "The analyzed note appears to be genuine with {confidence}% confidence.",
    suspiciousDesc: "Some security features could not be verified. Recommend physical verification.",
    counterfeitDesc: "Several security features are missing or don't match genuine currency patterns.",
    present: "Present",
    notDetected: "Not Detected",
    match: "{percent}% match",
    startAuth: "Start Authentication",
    selectLanguage: "Select Language",
    copyright: "₹500 Currency Authentication System © {year} - Detect counterfeit ₹500 notes",
  },
  // Hindi translations
  hi: {
    appTitle: "एआई-संचालित उपकरण संग्रह",
    appSubtitle: "अपनी उत्पादकता बढ़ाने के लिए हमारे एआई उपकरणों का अन्वेषण करें",
    currencyAuth: "₹500 मुद्रा प्रमाणीकरण",
    signInRegister: "साइन इन / रजिस्टर",
    myDashboard: "मेरा डैशबोर्ड",
    uploadImage: "छवि अपलोड करें",
    useCamera: "कैमरा का उपयोग करें",
    uploadNote: "₹500 नोट की छवि अपलोड करें",
    captureNote: "₹500 नोट की छवि कैप्चर करें",
    uploadDescription: "सर्वोत्तम परिणामों के लिए पूरे ₹500 नोट की एक स्पष्ट, अच्छी तरह से प्रकाशित छवि चुनें",
    captureDescription: "नोट को फ्रेम में स्पष्ट रूप से रखें और अच्छी रोशनी सुनिश्चित करें",
    dragDrop: "अपनी फ़ाइल को यहां खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें",
    analyzeImage: "छवि का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    captureImage: "छवि कैप्चर करें",
    retakePhoto: "फोटो फिर से लें",
    authResults: "प्रमाणीकरण परिणाम",
    securityFeatures: "सुरक्षा विशेषताएं",
    analysisConfidence: "विश्लेषण विश्वास",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    anotherNote: "एक और नोट का विश्लेषण करें",
    genuine: "वास्तविक मुद्रा",
    suspicious: "संदिग्ध मुद्रा",
    counterfeit: "संभावित नकली",
    genuineDesc: "विश्लेषित नोट {confidence}% विश्वास के साथ वास्तविक प्रतीत होता है।",
    suspiciousDesc: "कुछ सुरक्षा विशेषताओं को सत्यापित नहीं किया जा सका। भौतिक सत्यापन की सिफारिश करता है।",
    counterfeitDesc: "कई सुरक्षा विशेषताएं गायब हैं या वास्तविक मुद्रा पैटर्न से मेल नहीं खाती हैं।",
    present: "मौजूद",
    notDetected: "पता नहीं चला",
    match: "{percent}% मिलान",
    startAuth: "प्रमाणीकरण शुरू करें",
    selectLanguage: "भाषा चुनें",
    copyright: "₹500 मुद्रा प्रमाणीकरण प्रणाली © {year} - नकली ₹500 नोट का पता लगाएं",
  },
  // Bengali translations
  bn: {
    appTitle: "এআই-চালিত টুলস সংগ্রহ",
    appSubtitle: "আপনার উৎপাদনশীলতা বাড়াতে আমাদের এআই টুল সুইট অন্বেষণ করুন",
    currencyAuth: "₹500 মুদ্রা প্রমাণীকরণ",
    signInRegister: "সাইন ইন / নিবন্ধন",
    myDashboard: "আমার ড্যাশবোর্ড",
    uploadImage: "ছবি আপলোড করুন",
    useCamera: "ক্যামেরা ব্যবহার করুন",
    uploadNote: "₹500 নোটের ছবি আপলোড করুন",
    captureNote: "₹500 নোটের ছবি ক্যাপচার করুন",
    uploadDescription: "সেরা ফলাফলের জন্য পুরো ₹500 নোটের একটি পরিষ্কার, ভালভাবে আলোকিত ছবি বেছে নিন",
    captureDescription: "নোটটিকে ফ্রেমে স্পষ্টভাবে রাখুন এবং ভালো আলো নিশ্চিত করুন",
    dragDrop: "আপনার ফাইল এখানে টেনে আনুন বা ব্রাউজ করতে ক্লিক করুন",
    analyzeImage: "ছবি বিশ্লেষণ করুন",
    analyzing: "বিশ্লেষণ হচ্ছে...",
    captureImage: "ছবি ক্যাপচার করুন",
    retakePhoto: "আবার ছবি তুলুন",
    authResults: "প্রমাণীকরণ ফলাফল",
    securityFeatures: "নিরাপত্তা বৈশিষ্ট্য",
    analysisConfidence: "বিশ্লেষণ আত্মবিশ্বাস",
    downloadReport: "রিপোর্ট ডাউনলোড করুন",
    anotherNote: "আরেকটি নোট বিশ্লেষণ করুন",
    genuine: "আসল মুদ্রা",
    suspicious: "সন্দেহজনক মুদ্রা",
    counterfeit: "সম্ভাব্য জাল",
    genuineDesc: "বিশ্লেষিত নোটটি {confidence}% আত্মবিশ্বাসের সাথে আসল বলে মনে হচ্ছে।",
    suspiciousDesc: "কিছু নিরাপত্তা বৈশিষ্ট্য যাচাই করা যায়নি। শারীরিক যাচাইকরণের পরামর্শ দেওয়া হচ্ছে।",
    counterfeitDesc: "বেশ কয়েকটি নিরাপত্তা বৈশিষ্ট্য অনুপস্থিত বা আসল মুদ্রা প্যাটার্নের সাথে মেলে না।",
    present: "উপস্থিত",
    notDetected: "সনাক্ত করা যায়নি",
    match: "{percent}% মিল",
    startAuth: "প্রমাণীকরণ শুরু করুন",
    selectLanguage: "ভাষা নির্বাচন করুন",
    copyright: "₹500 মুদ্রা প্রমাণীকরণ সিস্টেম © {year} - জাল ₹500 নোট সনাক্ত করুন",
  },
  // Add more languages as needed
};

// Add more languages following the same pattern

// Define the Language context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to detect browser language
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(LANGUAGES).includes(browserLang) ? browserLang : 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get language from localStorage, fallback to browser detection
  const [language, setLanguage] = useState<string>(() => {
    const savedLang = localStorage.getItem('preferred-language');
    return savedLang || detectBrowserLanguage();
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Get the translations for the current language, fallback to English
    const langTranslations = translations[language] || translations.en;
    let value = langTranslations[key] || translations.en[key] || key;

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return value;
  };

  const value = {
    language,
    setLanguage,
    t,
    languages: LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
