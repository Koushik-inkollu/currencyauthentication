
import React from 'react';
import { ModeToggle } from './ModeToggle';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            CurrencyGuard
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              to="/currency-auth" 
              className={`text-sm font-medium transition-colors ${
                isActive('/currency-auth') 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Currency Authentication
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
