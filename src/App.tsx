import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layout/MainLayout';
import { FormProvider } from './context/FormContext';

// Lazy load components
const HomeScreen = lazy(() => import('./components/screens/HomeScreen'));
const MonthlyReport = lazy(() => import('./components/reports/MonthlyReport'));
const VisualizationDashboard = lazy(() => import('./components/visualizations/VisualizationDashboard'));
const SettingsScreen = lazy(() => import('./components/settings/SettingsScreen'));

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomeScreen />} />
            <Route path="reports/monthly" element={<MonthlyReport />} />
            <Route path="visualizations" element={<VisualizationDashboard />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </BrowserRouter>
    </FormProvider>
  );
}

export default App; 