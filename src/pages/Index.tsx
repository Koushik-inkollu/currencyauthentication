
import React from 'react';
import NavBar from '@/components/NavBar';
import KeyphraseGenerator from '@/components/KeyphraseGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import LanguageSelector from '@/components/LanguageSelector';
import { User, Shield, IndianRupee } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{t('appTitle')}</h1>
            <p className="text-muted-foreground">{t('appSubtitle')}</p>
            
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Button asChild>
                <Link to="/currency-auth" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  {t('currencyAuth')}
                </Link>
              </Button>
              
              {!loading && (
                !user ? (
                  <Button asChild variant="outline">
                    <Link to="/auth" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('signInRegister')}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="secondary">
                    <Link to="/currency-auth" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('myDashboard')}
                    </Link>
                  </Button>
                )
              )}
            </div>
            
            <div className="mt-6 flex justify-center">
              <LanguageSelector />
            </div>
          </div>
        </div>
        <KeyphraseGenerator />
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
