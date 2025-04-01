import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart3, ClipboardList, Settings } from 'lucide-react';
import { UnsavedChangesGuard } from './UnsavedChangesGuard';

export const NavigationBar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/reports/monthly', icon: ClipboardList, label: 'Reports' },
    { path: '/visualizations', icon: BarChart3, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <UnsavedChangesGuard />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `
                  flex flex-col items-center py-3 px-4 text-sm
                  ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                  }
                `}
              >
                <Icon size={24} />
                <span className="mt-1">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}; 