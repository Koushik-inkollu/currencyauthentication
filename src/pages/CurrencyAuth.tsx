
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import CurrencyAuthenticator from '@/components/CurrencyAuthenticator';
import { setupFadeInObserver } from '@/utils/animationObserver';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/providers/LanguageProvider';

const CurrencyAuth = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Setup fade-in animations when components come into view
    const observer = setupFadeInObserver();
    
    // Use a MutationObserver to observe dynamic content
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // If new nodes were added, refresh the fade-in observer
          if (observer) {
            const fadeElems = document.querySelectorAll('.fade-in-section:not(.is-visible)');
            fadeElems.forEach(elem => {
              observer.observe(elem);
            });
          }
        }
      });
    });
    
    // Start observing the document body for changes
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup observer on component unmount
    return () => {
      if (observer) {
        observer.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <div className="container py-4 max-w-5xl mx-auto">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <CurrencyAuthenticator />
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
};

export default CurrencyAuth;
