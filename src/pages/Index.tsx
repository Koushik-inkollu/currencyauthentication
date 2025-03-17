
import React from 'react';
import NavBar from '@/components/NavBar';
import KeyphraseGenerator from '@/components/KeyphraseGenerator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <KeyphraseGenerator />
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>KeyPhrase Creator &copy; {new Date().getFullYear()} - Generate effective keyphrases for your content</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
