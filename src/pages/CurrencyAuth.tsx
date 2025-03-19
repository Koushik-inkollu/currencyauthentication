
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import CurrencyAuthenticator from '@/components/CurrencyAuthenticator';
import { setupFadeInObserver } from '@/utils/animationObserver';

const CurrencyAuth = () => {
  useEffect(() => {
    // Setup fade-in animations when components come into view
    const observer = setupFadeInObserver();
    
    // Cleanup observer on component unmount
    return () => {
      if (observer) {
        // Disconnect the observer
        observer.disconnect();
      }
    };
  }, []);

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
