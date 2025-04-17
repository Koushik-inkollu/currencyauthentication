
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Globe, Languages } from 'lucide-react';
import { useLanguage, Language } from '@/providers/LanguageProvider';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  console.log('Current language in LanguageSelector:', language);

  const languages = [
    { code: 'en', name: t('english'), nativeName: 'English' },
    { code: 'hi', name: t('hindi'), nativeName: 'हिन्दी' },
    { code: 'te', name: t('telugu'), nativeName: 'తెలుగు' },
    { code: 'gu', name: t('gujarati'), nativeName: 'ગુજરાતી' },
    { code: 'bn', name: t('bengali'), nativeName: 'বাংলা' },
    { code: 'ta', name: t('tamil'), nativeName: 'தமிழ்' },
  ];

  const handleLanguageChange = (langCode: Language) => {
    console.log('Changing language to:', langCode);
    setLanguage(langCode);
  };

  // Find the current language label
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.nativeName || 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center">
              <span className="mr-2">{lang.nativeName}</span>
              <span className="text-muted-foreground text-sm">({lang.name})</span>
            </span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
