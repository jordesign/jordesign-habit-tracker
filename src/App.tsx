import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/home/HomeScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { VisualizationDashboard } from './components/visualizations/VisualizationDashboard';
import { AddMetricPage } from './components/metrics/AddMetricPage';
import { BooleanMetricTest } from './components/visualizations/BooleanMetricTest';
import { ValueMetricTest } from './components/visualizations/ValueMetricTest';
import { SelectMetricTest } from './components/visualizations/SelectMetricTest';
import { MonthlyReportTest } from './components/reports/MonthlyReportTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/visualizations" element={<VisualizationDashboard />} />
        <Route path="/metrics/new" element={<AddMetricPage />} />
        <Route path="/visualizations/boolean-test" element={<BooleanMetricTest />} />
        <Route path="/visualizations/value-test" element={<ValueMetricTest />} />
        <Route path="/visualizations/select-test" element={<SelectMetricTest />} />
        <Route path="/reports/monthly-test" element={<MonthlyReportTest />} />
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