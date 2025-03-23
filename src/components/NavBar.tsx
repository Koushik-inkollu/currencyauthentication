
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { ModeToggle } from '@/components/ModeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import { LogOut, Shield, User } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const NavBar = () => {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Shield className="h-6 w-6" />
            <span className="hidden md:inline-block">CurrencyGuard</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <ModeToggle />
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link to="/currency-auth">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      <Shield className="mr-2 h-4 w-4" />
                      {t('currencyAuth')}
                    </Button>
                  </Link>
                  <Button onClick={logout} variant="ghost" size="icon" className="text-muted-foreground">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="gap-1">
                    <User className="h-4 w-4" />
                    <span>{t('login')}</span>
                  </Button>
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
