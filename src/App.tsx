import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/home/HomeScreen';
import { Settings } from './components/settings/Settings';
import { Visualizations } from './components/visualizations/Visualizations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/visualizations" element={<Visualizations />} />
        <Route path="*" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
            <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 