import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Navigation />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 