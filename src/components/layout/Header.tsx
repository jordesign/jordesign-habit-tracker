import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Habit Tracker
        </Link>
        <nav className="flex items-center gap-4">
          {/* Add user menu or other navigation items here */}
        </nav>
      </div>
    </header>
  );
}; 