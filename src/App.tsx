import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/home/HomeScreen';
import { MetricEntry } from './components/metric/MetricEntry';
import { JournalEntry } from './components/journal/JournalEntry';
import { Settings } from './components/settings/Settings';
import { Visualizations } from './components/visualizations/Visualizations';
import { initializeTestData } from './utils/testData';

function App() {
  useEffect(() => {
    initializeTestData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/metric/:id/:date" element={<MetricEntry />} />
        <Route path="/journal/:date" element={<JournalEntry />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/visualizations" element={<Visualizations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 