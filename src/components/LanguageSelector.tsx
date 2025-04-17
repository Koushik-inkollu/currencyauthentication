
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Languages } from 'lucide-react';
import { useLanguage, Language } from '@/providers/LanguageProvider';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  console.log('Current language in LanguageSelector:', language);

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'hi', name: t('hindi') },
    { code: 'te', name: t('telugu') },
    { code: 'gu', name: t('gujarati') },
    { code: 'bn', name: t('bengali') },
    { code: 'ta', name: t('tamil') },
  ];

  const handleLanguageChange = (langCode: Language) => {
    console.log('Changing language to:', langCode);
    setLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('selectLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
