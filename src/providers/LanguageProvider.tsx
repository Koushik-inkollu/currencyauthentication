
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define our supported languages
export type Language = 'en' | 'hi' | 'te' | 'gu' | 'bn' | 'ta';

// Interface for our language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries for all supported languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Authentication page
    currencyAuth: '500 Currency Authentication',
    uploadDescription: 'Upload or capture a ₹500 note to verify its authenticity using our advanced AI system',
    startAuth: 'Start Authentication',
    uploadImage: 'Upload Image',
    useCamera: 'Use Camera',
    uploadNote: 'Upload a ₹500 Note Image',
    captureNote: 'Capture a ₹500 Note Image',
    captureDescription: 'Position the note clearly in the frame and ensure good lighting',
    dragDrop: 'Drag and drop your file here or click to browse',
    analyzing: 'Analyzing...',
    analyzeImage: 'Analyze Image',
    captureImage: 'Capture Image',
    retakePhoto: 'Retake Photo',
    authResults: 'Authentication Results',
    genuine: 'Genuine Currency',
    genuineDesc: 'The analyzed note appears to be genuine with {{confidence}}% confidence.',
    suspicious: 'Suspicious Currency',
    suspiciousDesc: 'Some security features could not be verified. Recommend physical verification.',
    counterfeit: 'Likely Counterfeit',
    counterfeitDesc: 'Several security features are missing or don\'t match genuine currency patterns.',
    securityFeatures: 'Security Features',
    present: 'Present',
    notDetected: 'Not Detected',
    match: '{{percent}}% match',
    analysisConfidence: 'Analysis Confidence',
    downloadReport: 'Download Report',
    anotherNote: 'Analyze Another Note',
    
    // Login page
    welcomeBack: 'Welcome back',
    createAccount: 'Create an account',
    resetPassword: 'Reset your password',
    loginDesc: 'Enter your email and password to log in',
    signupDesc: 'Enter your details to create a new account',
    resetDesc: 'Enter your email and we\'ll send you a reset link',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    login: 'Log In',
    loggingIn: 'Logging in...',
    signup: 'Sign Up',
    creatingAccount: 'Creating account...',
    sendResetLink: 'Send Reset Link',
    sendingResetLink: 'Sending reset link...',
    backToLogin: 'Back to Login',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    terms: 'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
    
    // Landing page
    authenticatePrecision: 'Authenticate ₹500 Notes with Precision',
    currencyGuardDesc: 'CurrencyGuard\'s advanced hybrid decision system analyzes multiple security features to verify ₹500 notes with exceptional accuracy.',
    authNow: 'Authenticate Now',
    advancedSecurity: 'Advanced Security Analysis',
    hybraidDesc: 'Our hybrid decision system leverages multiple verification techniques for 99.8% accuracy',
    multiPoint: 'Multi-Point Analysis',
    multiPointDesc: 'Examines 15+ security features simultaneously for comprehensive verification',
    hybridSystem: 'Hybrid Decision System',
    hybridSystemDesc: 'Combines computer vision with expert verification rules for enhanced accuracy',
    confidenceScoring: 'Confidence Scoring',
    confidenceScoringDesc: 'Provides detailed confidence scores for each analyzed security feature',
    counterfeitDetection: 'Counterfeit Detection',
    counterfeitDetectionDesc: 'Advanced algorithms to identify common and sophisticated counterfeiting techniques',
    securityVerification: 'Security Verification',
    securityVerificationDesc: 'Validates microprinting, watermarks, and specialized ink patterns with precision',
    currencyExpertise: 'Currency Expertise',
    currencyExpertiseDesc: 'Built with expertise from currency specialists and security printing technologies',
    hybridDecisionTech: 'Hybrid Decision Technology',
    hybridTechDesc: 'Our system combines multiple verification technologies to achieve industry-leading accuracy:',
    readyToVerify: 'Ready to Verify Your Currency?',
    startUsingDesc: 'Start using our industry-leading authentication system to protect yourself from sophisticated counterfeit notes.',
    
    // Language selector
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  },
  hi: {
    // Authentication page
    currencyAuth: '₹500 मुद्रा प्रमाणीकरण',
    uploadDescription: 'हमारी उन्नत AI प्रणाली का उपयोग करके प्रामाणिकता सत्यापित करने के लिए ₹500 नोट अपलोड करें या कैप्चर करें',
    startAuth: 'प्रमाणीकरण शुरू करें',
    uploadImage: 'छवि अपलोड करें',
    useCamera: 'कैमरा का उपयोग करें',
    uploadNote: '₹500 नोट इमेज अपलोड करें',
    captureNote: '₹500 नोट इमेज कैप्चर करें',
    captureDescription: 'नोट को फ्रेम में स्पष्ट रूप से रखें और अच्छी रोशनी सुनिश्चित करें',
    dragDrop: 'अपनी फ़ाइल को यहां खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    analyzing: 'विश्लेषण हो रहा है...',
    analyzeImage: 'छवि का विश्लेषण करें',
    captureImage: 'छवि कैप्चर करें',
    retakePhoto: 'फोटो फिर से लें',
    authResults: 'प्रमाणीकरण परिणाम',
    genuine: 'वास्तविक मुद्रा',
    genuineDesc: 'विश्लेषित नोट {{confidence}}% विश्वास के साथ वास्तविक प्रतीत होता है।',
    suspicious: 'संदिग्ध मुद्रा',
    suspiciousDesc: 'कुछ सुरक्षा विशेषताओं को सत्यापित नहीं किया जा सका। भौतिक सत्यापन की अनुशंसा करें।',
    counterfeit: 'संभावित नकली',
    counterfeitDesc: 'कई सुरक्षा विशेषताएँ गायब हैं या वास्तविक मुद्रा पैटर्न से मेल नहीं खाती हैं।',
    securityFeatures: 'सुरक्षा विशेषताएँ',
    present: 'मौजूद',
    notDetected: 'पता नहीं चला',
    match: '{{percent}}% मेल',
    analysisConfidence: 'विश्लेषण विश्वास',
    downloadReport: 'रिपोर्ट डाउनलोड करें',
    anotherNote: 'अन्य नोट का विश्लेषण करें',

    // Login page
    welcomeBack: 'वापसी पर स्वागत है',
    createAccount: 'खाता बनाएं',
    resetPassword: 'अपना पासवर्ड रीसेट करें',
    loginDesc: 'लॉग इन करने के लिए अपना ईमेल और पासवर्ड दर्ज करें',
    signupDesc: 'नया खाता बनाने के लिए अपना विवरण दर्ज करें',
    resetDesc: 'अपना ईमेल दर्ज करें और हम आपको एक रीसेट लिंक भेजेंगे',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    login: 'लॉग इन',
    loggingIn: 'लॉग इन हो रहा है...',
    signup: 'साइन अप',
    creatingAccount: 'खाता बनाया जा रहा है...',
    sendResetLink: 'रीसेट लिंक भेजें',
    sendingResetLink: 'रीसेट लिंक भेजा जा रहा है...',
    backToLogin: 'लॉगिन पर वापस जाएं',
    noAccount: 'खाता नहीं है?',
    hasAccount: 'पहले से ही खाता है?',
    terms: 'जारी रखकर, आप हमारी सेवा की शर्तें और गोपनीयता नीति से सहमत हैं।',

    // Landing page
    authenticatePrecision: 'सटीकता के साथ ₹500 नोट्स को प्रमाणित करें',
    currencyGuardDesc: 'करेंसीगार्ड की उन्नत हाइब्रिड निर्णय प्रणाली असाधारण सटीकता के साथ ₹500 नोट्स को सत्यापित करने के लिए कई सुरक्षा विशेषताओं का विश्लेषण करती है।',
    authNow: 'अभी प्रमाणित करें',
    advancedSecurity: 'उन्नत सुरक्षा विश्लेषण',
    hybraidDesc: 'हमारी हाइब्रिड निर्णय प्रणाली 99.8% सटीकता के लिए कई सत्यापन तकनीकों का लाभ उठाती है',
    multiPoint: 'मल्टी-पॉइंट एनालिसिस',
    multiPointDesc: 'व्यापक सत्यापन के लिए एक साथ 15+ सुरक्षा विशेषताओं की जांच करता है',
    hybridSystem: 'हाइब्रिड निर्णय प्रणाली',
    hybridSystemDesc: 'बेहतर सटीकता के लिए कंप्यूटर विजन को विशेषज्ञ सत्यापन नियमों के साथ जोड़ती है',
    confidenceScoring: 'कॉन्फिडेंस स्कोरिंग',
    confidenceScoringDesc: 'प्रत्येक विश्लेषित सुरक्षा विशेषता के लिए विस्तृत विश्वास स्कोर प्रदान करता है',
    counterfeitDetection: 'नकली पहचान',
    counterfeitDetectionDesc: 'सामान्य और परिष्कृत जालसाजी तकनीकों की पहचान करने के लिए उन्नत एल्गोरिदम',
    securityVerification: 'सुरक्षा सत्यापन',
    securityVerificationDesc: 'सटीकता के साथ माइक्रोप्रिंटिंग, वाटरमार्क्स और विशेष स्याही पैटर्न का सत्यापन करता है',
    currencyExpertise: 'मुद्रा विशेषज्ञता',
    currencyExpertiseDesc: 'मुद्रा विशेषज्ञों और सुरक्षा प्रिंटिंग प्रौद्योगिकियों के विशेषज्ञ ज्ञान के साथ निर्मित',
    hybridDecisionTech: 'हाइब्रिड निर्णय तकनीक',
    hybridTechDesc: 'हमारी प्रणाली उद्योग-अग्रणी सटीकता प्राप्त करने के लिए कई सत्यापन प्रौद्योगिकियों को जोड़ती है:',
    readyToVerify: 'अपनी मुद्रा सत्यापित करने के लिए तैयार हैं?',
    startUsingDesc: 'परिष्कृत नकली नोटों से खुद को बचाने के लिए हमारी उद्योग-अग्रणी प्रमाणीकरण प्रणाली का उपयोग शुरू करें।',

    // Language selector
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  },
  te: {
    // Authentication page
    currencyAuth: '₹500 కరెన్సీ ప్రామాణీకరణ',
    uploadDescription: 'మా అధునాతన AI వ్యవస్థను ఉపయోగించి ₹500 నోటు యొక్క ప్రామాణికతను ధృవీకరించడానికి అప్‌లోడ్ చేయండి లేదా క్యాప్చర్ చేయండి',
    startAuth: 'ప్రామాణీకరణను ప్రారంభించండి',
    uploadImage: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    useCamera: 'కెమెరాను ఉపయోగించండి',
    uploadNote: '₹500 నోట్ చిత్రాన్ని అప్‌లోడ్ చేయండి',
    captureNote: '₹500 నోట్ చిత్రాన్ని క్యాప్చర్ చేయండి',
    captureDescription: 'నోటును ఫ్రేమ్‌లో స్పష్టంగా ఉంచండి మరియు మంచి లైటింగ్‌ను నిర్ధారించుకోండి',
    dragDrop: 'మీ ఫైల్‌ను ఇక్కడ లాగండి మరియు వదిలివేయండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    analyzeImage: 'చిత్రాన్ని విశ్లేషించండి',
    captureImage: 'చిత్రాన్ని క్యాప్చర్ చేయండి',
    retakePhoto: 'ఫోటో మళ్ళీ తీయండి',
    authResults: 'ప్రామాణీకరణ ఫలితాలు',
    genuine: 'నిజమైన కరెన్సీ',
    genuineDesc: 'విశ్లేషించిన నోటు {{confidence}}% విశ్వాసంతో నిజమైనదిగా కనిపిస్తోంది.',
    suspicious: 'అనుమానాస్పద కరెన్సీ',
    suspiciousDesc: 'కొన్ని భద్రతా ఫీచర్‌లను ధృవీకరించలేకపోయాము. భౌతిక ధృవీకరణను సిఫార్సు చేస్తున్నాము.',
    counterfeit: 'సంభావ్య నకిలీ',
    counterfeitDesc: 'అనేక భద్రతా ఫీచర్‌లు లేవు లేదా నిజమైన కరెన్సీ నమూనాలతో సరిపోలడం లేదు.',
    securityFeatures: 'భద్రతా ఫీచర్లు',
    present: 'ఉన్నది',
    notDetected: 'కనుగొనబడలేదు',
    match: '{{percent}}% మ్యాచ్',
    analysisConfidence: 'విశ్లేషణ విశ్వాసం',
    downloadReport: 'నివేదికను డౌన్‌లోడ్ చేయండి',
    anotherNote: 'మరొక నోట్‌ను విశ్లేషించండి',

    // Login page
    welcomeBack: 'తిరిగి స్వాగతం',
    createAccount: 'ఖాతాను సృష్టించండి',
    resetPassword: 'మీ పాస్‌వర్డ్‌ను రీసెట్ చేయండి',
    loginDesc: 'లాగిన్ చేయడానికి మీ ఇమెయిల్ మరియు పాస్‌వర్డ్‌ను నమోదు చేయండి',
    signupDesc: 'కొత్త ఖాతాను సృష్టించడానికి మీ వివరాలను నమోదు చేయండి',
    resetDesc: 'మీ ఇమెయిల్‌ను నమోదు చేయండి మరియు మేము మీకు రీసెట్ లింక్‌ను పంపుతాము',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    login: 'లాగిన్',
    loggingIn: 'లాగిన్ అవుతోంది...',
    signup: 'సైన్ అప్',
    creatingAccount: 'ఖాతా సృష్టించబడుతోంది...',
    sendResetLink: 'రీసెట్ లింక్‌ను పంపండి',
    sendingResetLink: 'రీసెట్ లింక్ పంపబడుతోంది...',
    backToLogin: 'లాగిన్‌కి తిరిగి వెళ్ళండి',
    noAccount: 'ఖాతా లేదా?',
    hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    terms: 'కొనసాగించడం ద్వారా, మీరు మా సేవా నిబంధనలు మరియు గోప్యతా విధానానికి అంగీకరిస్తున్నారు.',

    // Landing page
    authenticatePrecision: 'ఖచ్చితత్వంతో ₹500 నోట్లను ప్రామాణీకరించండి',
    currencyGuardDesc: 'కరెన్సీగార్డ్ యొక్క అధునాతన హైబ్రిడ్ నిర్ణయ వ్యవస్థ అసాధారణ ఖచ్చితత్వంతో ₹500 నోట్లను ధృవీకరించడానికి బహుళ భద్రతా ఫీచర్‌లను విశ్లేషిస్తుంది.',
    authNow: 'ఇప్పుడే ప్రామాణీకరించండి',
    advancedSecurity: 'అధునాతన భద్రతా విశ్లేషణ',
    hybraidDesc: 'మా హైబ్రిడ్ నిర్ణయ వ్యవస్థ 99.8% ఖచ్చితత్వం కోసం బహుళ ధృవీకరణ పద్ధతులను ఉపయోగిస్తుంది',
    multiPoint: 'మల్టీ-పాయింట్ అనాలిసిస్',
    multiPointDesc: 'సమగ్ర ధృవీకరణ కోసం 15+ భద్రతా ఫీచర్‌లను ఒకేసారి పరీక్షిస్తుంది',
    hybridSystem: 'హైబ్రిడ్ నిర్ణయ వ్యవస్థ',
    hybridSystemDesc: 'మెరుగైన ఖచ్చితత్వం కోసం కంప్యూటర్ విజన్‌ను నిపుణుల ధృవీకరణ నియమాలతో మిళితం చేస్తుంది',
    confidenceScoring: 'కాన్ఫిడెన్స్ స్కోరింగ్',
    confidenceScoringDesc: 'ప్రతి విశ్లేషించిన భద్రతా ఫీచర్ కోసం వివరణాత్మక విశ్వాస స్కోర్‌లను అందిస్తుంది',
    counterfeitDetection: 'నకిలీ గుర్తింపు',
    counterfeitDetectionDesc: 'సాధారణ మరియు సంక్లిష్ట నకిలీ పద్ధతులను గుర్తించడానికి అధునాతన అల్గారిథమ్‌లు',
    securityVerification: 'భద్రతా ధృవీకరణ',
    securityVerificationDesc: 'ఖచ్చితత్వంతో మైక్రోప్రింటింగ్, వాటర్‌మార్క్‌లు మరియు ప్రత్యేక సిరా నమూనాలను ధృవీకరిస్తుంది',
    currencyExpertise: 'కరెన్సీ నిపుణత',
    currencyExpertiseDesc: 'కరెన్సీ నిపుణులు మరియు భద్రతా ముద్రణ సాంకేతికతల నిపుణతతో నిర్మించబడింది',
    hybridDecisionTech: 'హైబ్రిడ్ నిర్ణయ సాంకేతికత',
    hybridTechDesc: 'మా వ్యవస్థ పరిశ్రమ-నాయకత్వ ఖచ్చితత్వాన్ని సాధించడానికి బహుళ ధృవీకరణ సాంకేతికతలను కలుపుతుంది:',
    readyToVerify: 'మీ కరెన్సీని ధృవీకరించడానికి సిద్ధంగా ఉన్నారా?',
    startUsingDesc: 'సంక్లిష్ట నకిలీ నోట్ల నుండి మిమ్మల్ని రక్షించుకోవడానికి మా పరిశ్రమ-నాయకత్వ ప్రామాణీకరణ వ్యవస్థను ఉపయోగించడం ప్రారంభించండి.',

    // Language selector
    selectLanguage: 'భాషను ఎంచుకోండి',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  },
  gu: {
    // Authentication page
    currencyAuth: '₹500 ચલણી નોટની પ્રમાણભૂતતા',
    uploadDescription: 'અમારી અદ્યતન AI સિસ્ટમનો ઉપયોગ કરીને ₹500 નોટની પ્રમાણિકતા ચકાસવા માટે અપલોડ કરો અથવા કેપ્ચર કરો',
    startAuth: 'પ્રમાણીકરણ શરૂ કરો',
    uploadImage: 'છબી અપલોડ કરો',
    useCamera: 'કેમેરાનો ઉપયોગ કરો',
    uploadNote: '₹500 નોટની છબી અપલોડ કરો',
    captureNote: '₹500 નોટની છબી કેપ્ચર કરો',
    captureDescription: 'નોટને ફ્રેમમાં સ્પષ્ટ રીતે સ્થિત કરો અને સારી લાઈટિંગ સુનિશ્ચિત કરો',
    dragDrop: 'તમારી ફાઈલને અહીં ખેંચો અને છોડો અથવા બ્રાઉઝ કરવા માટે ક્લિક કરો',
    analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
    analyzeImage: 'છબીનું વિશ્લેષણ કરો',
    captureImage: 'છબી કેપ્ચર કરો',
    retakePhoto: 'ફોટો ફરીથી લો',
    authResults: 'પ્રમાણીકરણ પરિણામો',
    genuine: 'વાસ્તવિક ચલણ',
    genuineDesc: 'વિશ્લેષિત નોટ {{confidence}}% વિશ્વાસ સાથે વાસ્તવિક લાગે છે.',
    suspicious: 'શંકાસ્પદ ચલણ',
    suspiciousDesc: 'કેટલીક સુરક્ષા સુવિધાઓની ચકાસણી કરી શકાઈ નથી. શારીરિક ચકાસણીની ભલામણ કરીએ છીએ.',
    counterfeit: 'સંભવિત નકલી',
    counterfeitDesc: 'ઘણી સુરક્ષા સુવિધાઓ ખૂટે છે અથવા વાસ્તવિક ચલણના પેટર્ન સાથે મેળ ખાતી નથી.',
    securityFeatures: 'સુરક્ષા સુવિધાઓ',
    present: 'હાજર',
    notDetected: 'શોધાયું નથી',
    match: '{{percent}}% મેળ',
    analysisConfidence: 'વિશ્લેષણ વિશ્વાસ',
    downloadReport: 'અહેવાલ ડાઉનલોડ કરો',
    anotherNote: 'બીજી નોટનું વિશ્લેષણ કરો',

    // Login page
    welcomeBack: 'પાછા આવ્યા તે આવકાર્ય છે',
    createAccount: 'ખાતું બનાવો',
    resetPassword: 'તમારો પાસવર્ડ રીસેટ કરો',
    loginDesc: 'લૉગિન કરવા માટે તમારું ઇમેઇલ અને પાસવર્ડ દાખલ કરો',
    signupDesc: 'નવું ખાતું બનાવવા માટે તમારી વિગતો દાખલ કરો',
    resetDesc: 'તમારું ઇમેઇલ દાખલ કરો અને અમે તમને રીસેટ લિંક મોકલીશું',
    email: 'ઇમેઇલ',
    password: 'પાસવર્ડ',
    confirmPassword: 'પાસવર્ડની પુષ્ટિ કરો',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    login: 'લૉગ ઇન',
    loggingIn: 'લૉગિન થઈ રહ્યું છે...',
    signup: 'સાઇન અપ',
    creatingAccount: 'ખાતું બની રહ્યું છે...',
    sendResetLink: 'રીસેટ લિંક મોકલો',
    sendingResetLink: 'રીસેટ લિંક મોકલી રહ્યા છીએ...',
    backToLogin: 'લૉગિન પર પાછા જાઓ',
    noAccount: 'ખાતું નથી?',
    hasAccount: 'પહેલેથી જ ખાતું છે?',
    terms: 'ચાલુ રાખીને, તમે અમારી સેવાની શરતો અને ગોપનીયતા નીતિ સાથે સંમત થાઓ છો.',

    // Landing page
    authenticatePrecision: 'ચોકસાઈથી ₹500 નોટ્સને પ્રમાણિત કરો',
    currencyGuardDesc: 'કરન્સીગાર્ડની અદ્યતન હાઇબ્રિડ નિર્ણય સિસ્ટમ અસાધારણ ચોકસાઈ સાથે ₹500 નોટ્સને ચકાસવા માટે બહુવિધ સુરક્ષા સુવિધાઓનું વિશ્લેષણ કરે છે.',
    authNow: 'હવે પ્રમાણિત કરો',
    advancedSecurity: 'અદ્યતન સુરક્ષા વિશ્લેષણ',
    hybraidDesc: 'અમારી હાઇબ્રિડ નિર્ણય સિસ્ટમ 99.8% ચોકસાઈ માટે બહુવિધ ચકાસણી તકનીકોનો લાભ લે છે',
    multiPoint: 'મલ્ટી-પોઇન્ટ એનાલિસિસ',
    multiPointDesc: 'વ્યાપક ચકાસણી માટે 15+ સુરક્ષા સુવિધાઓની એક સાથે તપાસ કરે છે',
    hybridSystem: 'હાઇબ્રિડ નિર્ણય સિસ્ટમ',
    hybridSystemDesc: 'વધુ સારી ચોકસાઈ માટે કમ્પ્યુટર વિઝન અને નિષ્ણાત ચકાસણી નિયમોને જોડે છે',
    confidenceScoring: 'કોન્ફિડન્સ સ્કોરિંગ',
    confidenceScoringDesc: 'દરેક વિશ્લેષિત સુરક્ષા સુવિધા માટે વિગતવાર વિશ્વાસ સ્કોર પ્રદાન કરે છે',
    counterfeitDetection: 'નકલી શોધ',
    counterfeitDetectionDesc: 'સામાન્ય અને સંકુલ નકલી તકનીકોને ઓળખવા માટે અદ્યતન એલ્ગોરિધમ',
    securityVerification: 'સુરક્ષા ચકાસણી',
    securityVerificationDesc: 'ચોકસાઈ સાથે માઇક્રોપ્રિન્ટિંગ, વોટરમાર્ક્સ, અને વિશિષ્ટ શાહી પેટર્નની ચકાસણી કરે છે',
    currencyExpertise: 'ચલણ નિપુણતા',
    currencyExpertiseDesc: 'ચલણ નિષ્ણાતો અને સુરક્ષા છાપકામ ટેકનોલોજીઓની નિપુણતા સાથે બનાવવામાં આવેલ',
    hybridDecisionTech: 'હાઇબ્રિડ નિર્ણય ટેકનોલોજી',
    hybridTechDesc: 'અમારી સિસ્ટમ ઉદ્યોગ-અગ્રણી ચોકસાઈ મેળવવા માટે બહુવિધ ચકાસણી ટેકનોલોજીઓને જોડે છે:',
    readyToVerify: 'તમારા ચલણને ચકાસવા માટે તૈયાર છો?',
    startUsingDesc: 'સંકુલ નકલી નોટ્સથી તમારી જાતને રક્ષવા માટે અમારી ઉદ્યોગ-અગ્રણી પ્રમાણીકરણ સિસ્ટમનો ઉપયોગ શરૂ કરો.',

    // Language selector
    selectLanguage: 'ભાષા પસંદ કરો',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  },
  bn: {
    // Authentication page
    currencyAuth: '₹500 মুদ্রা প্রমাণীকরণ',
    uploadDescription: 'আমাদের উন্নত AI সিস্টেম ব্যবহার করে ₹500 নোটের প্রামাণিকতা যাচাই করার জন্য আপলোড করুন বা ক্যাপচার করুন',
    startAuth: 'প্রমাণীকরণ শুরু করুন',
    uploadImage: 'ছবি আপলোড করুন',
    useCamera: 'ক্যামেরা ব্যবহার করুন',
    uploadNote: '₹500 নোটের ছবি আপলোড করুন',
    captureNote: '₹500 নোটের ছবি ক্যাপচার করুন',
    captureDescription: 'নোটটিকে ফ্রেমে স্পষ্টভাবে রাখুন এবং ভালো আলো নিশ্চিত করুন',
    dragDrop: 'আপনার ফাইলটি এখানে টেনে আনুন এবং ছেড়ে দিন অথবা ব্রাউজ করতে ক্লিক করুন',
    analyzing: 'বিশ্লেষণ করা হচ্ছে...',
    analyzeImage: 'ছবি বিশ্লেষণ করুন',
    captureImage: 'ছবি ক্যাপচার করুন',
    retakePhoto: 'আবার ছবি তুলুন',
    authResults: 'প্রমাণীকরণ ফলাফল',
    genuine: 'আসল মুদ্রা',
    genuineDesc: 'বিশ্লেষিত নোটটি {{confidence}}% আত্মবিশ্বাস সহ আসল বলে মনে হচ্ছে।',
    suspicious: 'সন্দেহজনক মুদ্রা',
    suspiciousDesc: 'কিছু নিরাপত্তা বৈশিষ্ট্য যাচাই করা যায়নি। শারীরিক যাচাইয়ের পরামর্শ দেওয়া হচ্ছে।',
    counterfeit: 'সম্ভাব্য জাল',
    counterfeitDesc: 'বেশ কয়েকটি নিরাপত্তা বৈশিষ্ট্য অনুপস্থিত বা আসল মুদ্রার প্যাটার্ন সাথে মেলে না।',
    securityFeatures: 'নিরাপত্তা বৈশিষ্ট্য',
    present: 'উপস্থিত',
    notDetected: 'শনাক্ত করা যায়নি',
    match: '{{percent}}% মিল',
    analysisConfidence: 'বিশ্লেষণ আত্মবিশ্বাস',
    downloadReport: 'রিপোর্ট ডাউনলোড করুন',
    anotherNote: 'আরেকটি নোট বিশ্লেষণ করুন',

    // Login page
    welcomeBack: 'ফিরে আসার জন্য স্বাগতম',
    createAccount: 'একাউন্ট তৈরি করুন',
    resetPassword: 'আপনার পাসওয়ার্ড রিসেট করুন',
    loginDesc: 'লগইন করতে আপনার ইমেল এবং পাসওয়ার্ড লিখুন',
    signupDesc: 'নতুন অ্যাকাউন্ট তৈরি করতে আপনার বিবরণ লিখুন',
    resetDesc: 'আপনার ইমেল লিখুন এবং আমরা আপনাকে একটি রিসেট লিঙ্ক পাঠাব',
    email: 'ইমেল',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    login: 'লগ ইন',
    loggingIn: 'লগইন করা হচ্ছে...',
    signup: 'সাইন আপ',
    creatingAccount: 'অ্যাকাউন্ট তৈরি করা হচ্ছে...',
    sendResetLink: 'রিসেট লিঙ্ক পাঠান',
    sendingResetLink: 'রিসেট লিঙ্ক পাঠানো হচ্ছে...',
    backToLogin: 'লগইনে ফিরে যান',
    noAccount: 'অ্যাকাউন্ট নেই?',
    hasAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    terms: 'চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের পরিষেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হন।',

    // Landing page
    authenticatePrecision: 'নির্ভুলতার সাথে ₹500 নোট যাচাই করুন',
    currencyGuardDesc: 'কারেন্সিগার্ডের উন্নত হাইব্রিড সিদ্ধান্ত সিস্টেম অসাধারণ নির্ভুলতা সহ ₹500 নোট যাচাই করতে একাধিক নিরাপত্তা বৈশিষ্ট্য বিশ্লেষণ করে।',
    authNow: 'এখনই যাচাই করুন',
    advancedSecurity: 'উন্নত নিরাপত্তা বিশ্লেষণ',
    hybraidDesc: 'আমাদের হাইব্রিড সিদ্ধান্ত সিস্টেম 99.8% নির্ভুলতার জন্য একাধিক যাচাইকরণ কৌশল ব্যবহার করে',
    multiPoint: 'মাল্টি-পয়েন্ট অ্যানালাইসিস',
    multiPointDesc: 'ব্যাপক যাচাইকরণের জন্য একসাথে 15+ নিরাপত্তা বৈশিষ্ট্য পরীক্ষা করে',
    hybridSystem: 'হাইব্রিড সিদ্ধান্ত সিস্টেম',
    hybridSystemDesc: 'উন্নত নির্ভুলতার জন্য কম্পিউটার ভিশন এবং বিশেষজ্ঞ যাচাইকরণ নিয়ম সংযুক্ত করে',
    confidenceScoring: 'কনফিডেন্স স্কোরিং',
    confidenceScoringDesc: 'প্রতিটি বিশ্লেষিত নিরাপত্তা বৈশিষ্ট্যের জন্য বিস্তারিত বিশ্বাস স্কোর প্রদান করে',
    counterfeitDetection: 'জাল শনাক্তকরণ',
    counterfeitDetectionDesc: 'সাধারণ এবং জটিল জালিয়াতি কৌশল শনাক্ত করার জন্য উন্নত অ্যালগরিদম',
    securityVerification: 'নিরাপত্তা যাচাইকরণ',
    securityVerificationDesc: 'নির্ভুলতার সাথে মাইক্রোপ্রিন্টিং, ওয়াটারমার্ক এবং বিশেষ কালি প্যাটার্ন যাচাই করে',
    currencyExpertise: 'মুদ্রা বিশেষজ্ঞতা',
    currencyExpertiseDesc: 'মুদ্রা বিশেষজ্ঞ এবং নিরাপত্তা মুদ্রণ প্রযুক্তির বিশেষজ্ঞতা দিয়ে নির্মিত',
    hybridDecisionTech: 'হাইব্রিড সিদ্ধান্ত প্রযুক্তি',
    hybridTechDesc: 'আমাদের সিস্টেম শিল্প-নেতৃস্থানীয় নির্ভুলতা অর্জন করতে একাধিক যাচাইকরণ প্রযুক্তি সংযুক্ত করে:',
    readyToVerify: 'আপনার মুদ্রা যাচাই করতে প্রস্তুত?',
    startUsingDesc: 'জটিল জাল নোট থেকে নিজেকে রক্ষা করতে আমাদের শিল্প-নেতৃস্থানীয় প্রমাণীকরণ সিস্টেম ব্যবহার শুরু করুন।',

    // Language selector
    selectLanguage: 'ভাষা নির্বাচন করুন',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  },
  ta: {
    // Authentication page
    currencyAuth: '₹500 பணத்தாள் அங்கீகரிப்பு',
    uploadDescription: 'எங்களின் மேம்பட்ட AI அமைப்பைப் பயன்படுத்தி ₹500 நோட்டின் நம்பகத்தன்மையை சரிபார்க்க பதிவேற்றவும் அல்லது கைப்பற்றவும்',
    startAuth: 'அங்கீகரிப்பைத் தொடங்குக',
    uploadImage: 'படத்தைப் பதிவேற்றுக',
    useCamera: 'கேமராவைப் பயன்படுத்துக',
    uploadNote: '₹500 நோட்டு படத்தைப் பதிவேற்றுக',
    captureNote: '₹500 நோட்டு படத்தைக் கைப்பற்றுக',
    captureDescription: 'நோட்டை பிரேமில் தெளிவாக வைத்து, நல்ல ஒளியைமைப்பை உறுதிப்படுத்தவும்',
    dragDrop: 'உங்கள் கோப்பை இங்கே இழுத்து விடவும் அல்லது உலாவ கிளிக் செய்யவும்',
    analyzing: 'பகுப்பாய்வு செய்கிறது...',
    analyzeImage: 'படத்தை பகுப்பாய்வு செய்க',
    captureImage: 'படத்தை கைப்பற்றுக',
    retakePhoto: 'மீண்டும் புகைப்படம் எடுக்கவும்',
    authResults: 'அங்கீகரிப்பு முடிவுகள்',
    genuine: 'உண்மையான பணத்தாள்',
    genuineDesc: 'பகுப்பாய்வு செய்யப்பட்ட நோட்டு {{confidence}}% நம்பிக்கையுடன் உண்மையானதாக தோன்றுகிறது.',
    suspicious: 'சந்தேகத்திற்குரிய பணத்தாள்',
    suspiciousDesc: 'சில பாதுகாப்பு அம்சங்களை சரிபார்க்க முடியவில்லை. உடல் சரிபார்ப்பு பரிந்துரைக்கப்படுகிறது.',
    counterfeit: 'கள்ள நோட்டாக இருக்கலாம்',
    counterfeitDesc: 'பல பாதுகாப்பு அம்சங்கள் காணப்படவில்லை அல்லது உண்மையான பணத்தாள் முறைகளுடன் பொருந்தவில்லை.',
    securityFeatures: 'பாதுகாப்பு அம்சங்கள்',
    present: 'உள்ளது',
    notDetected: 'கண்டறியப்படவில்லை',
    match: '{{percent}}% பொருத்தம்',
    analysisConfidence: 'பகுப்பாய்வு நம்பிக்கை',
    downloadReport: 'அறிக்கையைப் பதிவிறக்குக',
    anotherNote: 'மற்றொரு நோட்டை பகுப்பாய்வு செய்க',

    // Login page
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    createAccount: 'கணக்கை உருவாக்குக',
    resetPassword: 'உங்கள் கடவுச்சொல்லை மீட்டமைக்க',
    loginDesc: 'உள்நுழைய உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்',
    signupDesc: 'புதிய கணக்கை உருவாக்க உங்கள் விவரங்களை உள்ளிடவும்',
    resetDesc: 'உங்கள் மின்னஞ்சலை உள்ளிடவும், நாங்கள் உங்களுக்கு மீட்டமைப்பு இணைப்பை அனுப்புவோம்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    login: 'உள்நுழைக',
    loggingIn: 'உள்நுழைகிறது...',
    signup: 'பதிவு செய்க',
    creatingAccount: 'கணக்கை உருவாக்குகிறது...',
    sendResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்புக',
    sendingResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்புகிறது...',
    backToLogin: 'உள்நுழைவுக்குத் திரும்புக',
    noAccount: 'கணக்கு இல்லையா?',
    hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    terms: 'தொடர்வதன் மூலம், நீங்கள் எங்கள் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கைக்கு ஒப்புக்கொள்கிறீர்கள்.',

    // Landing page
    authenticatePrecision: 'துல்லியமாக ₹500 நோட்டுகளை அங்கீகரிக்கவும்',
    currencyGuardDesc: 'கரன்சிகார்டின் மேம்பட்ட கலப்பின முடிவு அமைப்பு அசாதாரண துல்லியத்துடன் ₹500 நோட்டுகளை சரிபார்க்க பல பாதுகாப்பு அம்சங்களை பகுப்பாய்வு செய்கிறது.',
    authNow: 'இப்போது அங்கீகரிக்கவும்',
    advancedSecurity: 'மேம்பட்ட பாதுகாப்பு பகுப்பாய்வு',
    hybraidDesc: 'எங்கள் கலப்பின முடிவு அமைப்பு 99.8% துல்லியத்திற்காக பல சரிபார்ப்பு நுட்பங்களைப் பயன்படுத்துகிறது',
    multiPoint: 'பல-புள்ளி பகுப்பாய்வு',
    multiPointDesc: 'விரிவான சரிபார்ப்புக்காக 15+ பாதுகாப்பு அம்சங்களை ஒரே நேரத்தில் ஆய்வு செய்கிறது',
    hybridSystem: 'கலப்பின முடிவு அமைப்பு',
    hybridSystemDesc: 'மேம்பட்ட துல்லியத்திற்காக கணினி பார்வையுடன் நிபுணர் சரிபார்ப்பு விதிகளை இணைக்கிறது',
    confidenceScoring: 'நம்பிக்கை மதிப்பெண்',
    confidenceScoringDesc: 'ஒவ்வொரு பகுப்பாய்வு செய்யப்பட்ட பாதுகாப்பு அம்சத்திற்கும் விரிவான நம்பிக்கை மதிப்பெண்களை வழங்குகிறது',
    counterfeitDetection: 'கள்ள நோட்டு கண்டறிதல்',
    counterfeitDetectionDesc: 'பொதுவான மற்றும் நுணுக்கமான கள்ள நோட்டு நுட்பங்களை அடையாளம் காண மேம்பட்ட அல்காரிதம்கள்',
    securityVerification: 'பாதுகாப்பு சரிபார்ப்பு',
    securityVerificationDesc: 'துல்லியத்துடன் நுண்-அச்சிடல், நீர்-குறிகள் மற்றும் சிறப்பு மை முறைகளை சரிபார்க்கிறது',
    currencyExpertise: 'பணத்தாள் நிபுணத்துவம்',
    currencyExpertiseDesc: 'பணத்தாள் நிபுணர்கள் மற்றும் பாதுகாப்பு அச்சிடல் தொழில்நுட்பங்களின் நிபுணத்துவத்துடன் கட்டமைக்கப்பட்டது',
    hybridDecisionTech: 'கலப்பின முடிவு தொழில்நுட்பம்',
    hybridTechDesc: 'எங்கள் அமைப்பு தொழில்துறை-முன்னணி துல்லியத்தை அடைய பல சரிபார்ப்பு தொழில்நுட்பங்களை இணைக்கிறது:',
    readyToVerify: 'உங்கள் பணத்தாளை சரிபார்க்க தயாரா?',
    startUsingDesc: 'நுட்பமான கள்ள நோட்டுகளிலிருந்து உங்களைப் பாதுகாக்க எங்கள் தொழில்துறை-முன்னணி அங்கீகரிப்பு அமைப்பைப் பயன்படுத்தத் தொடங்குங்கள்.',

    // Language selector
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    telugu: 'తెలుగు (Telugu)',
    gujarati: 'ગુજરાતી (Gujarati)',
    bengali: 'বাংলা (Bengali)',
    tamil: 'தமிழ் (Tamil)',
  }
};

// Create a hook to use our language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Helper function to get browser language
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in translations) {
    return browserLang as Language;
  }
  return 'en'; // Default to English
};

// Read from session storage or get browser language
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLanguage = sessionStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && savedLanguage in translations) {
      return savedLanguage;
    }
  }
  return getBrowserLanguage();
};

// The language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    
    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  // Update language and save to session storage
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
