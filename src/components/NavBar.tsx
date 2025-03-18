
import React from 'react';
import { ModeToggle } from './ModeToggle';
import { Link, useLocation } from 'react-router-dom';
import { Shield, IndianRupee, Info } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 transition-transform hover:scale-105">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              <IndianRupee className="h-3.5 w-3.5 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">CurrencyGuard</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              to="/currency-auth" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/currency-auth') 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              <Shield className="h-4 w-4" />
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
