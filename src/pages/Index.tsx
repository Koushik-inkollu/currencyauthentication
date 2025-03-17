
import React from 'react';
import NavBar from '@/components/NavBar';
import KeyphraseGenerator from '@/components/KeyphraseGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">AI-Powered Tools Collection</h1>
            <p className="text-muted-foreground">Explore our suite of AI tools to boost your productivity</p>
            
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Button asChild>
                <Link to="/currency-auth">₹500 Currency Authentication</Link>
              </Button>
            </div>
          </div>
        </div>
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
