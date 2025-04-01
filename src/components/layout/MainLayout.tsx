import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingScreen } from './LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <NavigationBar />
        <main className="pb-20"> {/* Add padding for bottom nav */}
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
}; 