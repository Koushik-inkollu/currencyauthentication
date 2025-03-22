
import React from 'react';
import NavBar from '@/components/NavBar';
import CurrencyAuthWithImages from '@/components/CurrencyAuthWithImages';

const CurrencyAuth = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1 container max-w-4xl py-8">
        <CurrencyAuthWithImages />
      </main>
    </div>
  );
};

export default CurrencyAuth;
