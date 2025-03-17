
import React from 'react';
import NavBar from '@/components/NavBar';
import CurrencyAuthenticator from '@/components/CurrencyAuthenticator';

const CurrencyAuth = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <CurrencyAuthenticator />
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>₹500 Currency Authentication System &copy; {new Date().getFullYear()} - Detect counterfeit ₹500 notes</p>
        </div>
      </footer>
    </div>
  );
};

export default CurrencyAuth;
